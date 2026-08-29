import { test, expect } from "@playwright/test";

/**
 * End-to-end test: full delivery lifecycle.
 *
 * Precondition: the dev server must be running on localhost:5173.
 * Run: npm run dev   (in another terminal), then npm run test:e2e
 *
 * Flow:
 *  1. Retailer signs up and logs a delivery
 *  2. Dispatcher sees the open request and assigns a rider
 *  3. Rider marks delivery as Picked Up, then Delivered
 *  4. Tracking view shows the delivery with full history
 */

const BASE = "http://localhost:5173";

test.describe("Reflex — delivery lifecycle", () => {
  // Fresh localStorage for every test
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE);
    await page.evaluate(() => {
      Object.keys(localStorage)
        .filter((k) => k.startsWith("reflex:"))
        .forEach((k) => localStorage.removeItem(k));
    });
    await page.reload();
  });

  test("Retailer can sign up and log a delivery", async ({ page }) => {
    await page.goto(BASE);

    // Switch to sign-up mode
    await page.click("text=Create an account");

    await page.fill("#businessName", "Nairobi Electronics");
    await page.fill("#email", "test@shop.co.ke");
    await page.fill("#password", "test1234");
    await page.click("#authSubmit");

    // Should now show the retailer view
    await expect(page.locator("text=Log a delivery")).toBeVisible();

    // Fill the form
    await page.fill("#customerName", "Grace Wanjiru");
    await page.fill("#customerPhone", "+254712345678");
    await page.fill("#deliveryAddress", "14 Ngong Road, Nairobi");
    await page.fill("#itemDescription", "1x LED TV, 43-inch");
    await page.click("#logDeliveryBtn");

    // The delivery card should appear
    await expect(page.locator("text=Grace Wanjiru")).toBeVisible();
    await expect(page.locator("text=New")).toBeVisible();
  });

  test("Dispatcher can assign a rider to an open request", async ({ page }) => {
    // First create a delivery via localStorage seed
    await page.goto(BASE);
    await page.evaluate(() => {
      const deliveries = [
        {
          id: "RFX-TEST1",
          customer: "Bob Kamau",
          phone: "+254711111111",
          address: "5 Kenyatta Ave",
          item: "Pharmacy supplies",
          status: "New",
          rider: null,
          createdAt: Date.now(),
          history: [{ status: "New", at: Date.now() }],
          pod: null,
          retailerId: "r1",
          retailerName: "Test Shop",
        },
      ];
      localStorage.setItem("reflex:deliveries", JSON.stringify(deliveries));
    });
    await page.reload();

    // Navigate to Dispatcher tab
    await page.click("#tab-dispatcher");

    // Should see the open request
    await expect(page.locator("text=Bob Kamau")).toBeVisible();

    // Assign Kevin
    await page.selectOption("#assignRider-RFX-TEST1", "Kevin");

    // Should move to in-progress column
    await expect(page.locator("text=Assigned").first()).toBeVisible();
  });

  test("Full lifecycle: New → Assigned → Picked Up → Delivered", async ({
    page,
  }) => {
    await page.goto(BASE);

    // Seed a delivery assigned to Kevin
    await page.evaluate(() => {
      const deliveries = [
        {
          id: "RFX-LIFE1",
          customer: "Alice Njeri",
          phone: "+254722222222",
          address: "10 Moi Ave",
          item: "Hardware tools",
          status: "Assigned",
          rider: "Kevin",
          createdAt: Date.now() - 60000,
          history: [
            { status: "New", at: Date.now() - 60000 },
            { status: "Assigned", at: Date.now() - 30000 },
          ],
          pod: null,
          retailerId: "r1",
          retailerName: "Test Shop",
        },
      ];
      localStorage.setItem("reflex:deliveries", JSON.stringify(deliveries));
    });
    await page.reload();

    // Rider tab — mark Picked Up
    await page.click("#tab-rider");
    await expect(page.locator("text=Alice Njeri")).toBeVisible();
    await page.click("#advance-RFX-LIFE1");

    // Mark Delivered
    await page.click("#advance-RFX-LIFE1");

    // Delivery should disappear from rider view (status = Delivered)
    await expect(page.locator("text=Alice Njeri")).not.toBeVisible();

    // Tracking tab — find delivery
    await page.click("#tab-tracking");
    await page.fill("#trackingQuery", "RFX-LIFE1");
    await page.click("#trackBtn");

    await expect(page.locator("text=Delivered").first()).toBeVisible();
    await expect(page.locator("text=Alice Njeri")).not.toBeVisible(); // tracking shows item, not name
  });
});
