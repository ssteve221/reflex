import { useState, useRef } from "react";
import { FileSpreadsheet, Braces, Upload, X, Check } from "lucide-react";
import { CONNECTORS } from "../lib/connectors";

const ICON_MAP = { FileSpreadsheet, Braces, Upload, X, Check };

export default function ImportPanel({ onImport }) {
  const [source, setSource] = useState("spreadsheet");
  const [jsonText, setJsonText] = useState("");
  const fileRef = useRef(null);
  const [parsed, setParsed] = useState(null); // { valid, invalid, label }
  const [error, setError] = useState("");
  const [done, setDone] = useState(0);

  const switchSource = (key) => {
    setSource(key);
    setParsed(null);
    setError("");
    setDone(0);
  };

  const runConnector = async (input, label) => {
    setError("");
    setDone(0);
    try {
      const { valid, invalid } = await CONNECTORS[source].parse(input);
      if (valid.length === 0 && invalid.length === 0) {
        setError("No rows found to import.");
        setParsed(null);
        return;
      }
      setParsed({ valid, invalid, label });
    } catch {
      setError(
        source === "json"
          ? "That's not valid JSON. Check for a trailing comma or missing bracket."
          : "Couldn't read that file. Make sure it's a valid spreadsheet."
      );
      setParsed(null);
    }
  };

  const handleFile = (file) => {
    if (!/\.(xlsx|xls|csv)$/i.test(file.name)) {
      setError("Upload an .xlsx, .xls, or .csv file.");
      return;
    }
    runConnector(file, file.name);
  };

  const handleJson = () => {
    if (!jsonText.trim()) {
      setError("Paste a JSON array first.");
      return;
    }
    runConnector(jsonText, "Pasted JSON payload");
  };

  const confirmImport = () => {
    if (!parsed || parsed.valid.length === 0) return;
    onImport(parsed.valid);
    setDone(parsed.valid.length);
    setParsed(null);
    setJsonText("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const cancel = () => {
    setParsed(null);
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <h2 className="font-semibold text-blue-900 mb-1 flex items-center gap-2">
        <Upload className="w-4 h-4" /> Import deliveries
      </h2>
      <p className="text-xs text-gray-500 mb-3">
        One connector layer, several sources — each maps onto the same delivery
        record.
      </p>

      {/* Source tabs */}
      <div className="flex gap-1 mb-3 bg-gray-50 border border-gray-200 rounded-md p-1 w-fit">
        {Object.entries(CONNECTORS).map(([key, c]) => {
          const Icon = ICON_MAP[c.icon];
          return (
            <button
              key={key}
              id={`importTab-${key}`}
              onClick={() => switchSource(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium ${
                source === key
                  ? "bg-blue-900 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              {c.label}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-gray-400 mb-3">
        {CONNECTORS[source].description}
      </p>

      {/* Spreadsheet input */}
      {!parsed && source === "spreadsheet" && (
        <label
          htmlFor="fileUpload"
          className="flex flex-col items-center justify-center gap-1.5 border border-dashed border-gray-300 rounded-lg py-6 cursor-pointer hover:bg-gray-50 text-center"
        >
          <Upload className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-600">Click to choose a file</span>
          <span className="text-xs text-gray-400">.xlsx, .xls, or .csv</span>
          <input
            id="fileUpload"
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
          />
        </label>
      )}

      {/* JSON input */}
      {!parsed && source === "json" && (
        <div>
          <textarea
            id="jsonPayload"
            className="w-full border border-gray-300 rounded px-3 py-2 text-xs font-mono h-28 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder={
              '[{\n  "customer":"Grace Wanjiru",\n  "phone":"+2547...",\n  "address":"14 Ngong Rd",\n  "item":"1x LED TV"\n}]'
            }
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
          />
          <button
            id="parseJsonBtn"
            onClick={handleJson}
            className="w-full mt-2 bg-blue-900 text-white text-sm font-medium py-2 rounded hover:bg-blue-800"
          >
            Parse payload
          </button>
        </div>
      )}

      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

      {done > 0 && !parsed && (
        <p className="text-xs text-emerald-700 mt-2 flex items-center gap-1">
          <Check className="w-3.5 h-3.5" /> Imported {done}{" "}
          {done === 1 ? "delivery" : "deliveries"}.
        </p>
      )}

      {/* Preview / confirm */}
      {parsed && (
        <div className="mt-2 border border-gray-200 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 truncate">{parsed.label}</span>
            <button onClick={cancel} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-gray-700">
            <span className="font-medium text-emerald-700">
              {parsed.valid.length}
            </span>{" "}
            ready to import
            {parsed.invalid.length > 0 && (
              <>
                {" "}
                ·{" "}
                <span className="font-medium text-red-600">
                  {parsed.invalid.length}
                </span>{" "}
                skipped
              </>
            )}
          </p>
          {parsed.invalid.length > 0 && (
            <ul className="text-xs text-gray-400 mt-1 space-y-0.5 max-h-20 overflow-y-auto">
              {parsed.invalid.slice(0, 5).map((r, i) => (
                <li key={i}>
                  Row {r.row}: missing {r.missing.join(", ")}
                </li>
              ))}
              {parsed.invalid.length > 5 && (
                <li>…and {parsed.invalid.length - 5} more</li>
              )}
            </ul>
          )}
          <button
            id="confirmImportBtn"
            disabled={parsed.valid.length === 0}
            onClick={confirmImport}
            className="w-full mt-3 bg-blue-900 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-medium py-2 rounded hover:bg-blue-800"
          >
            Import {parsed.valid.length}{" "}
            {parsed.valid.length === 1 ? "delivery" : "deliveries"}
          </button>
        </div>
      )}
    </div>
  );
}
