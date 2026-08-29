import { useRef } from "react";
import React from "react";

/**
 * SignaturePad — canvas-based freehand signature input.
 *
 * Exposed via ref:
 *   ref.current.isEmpty()   → boolean
 *   ref.current.toDataURL() → PNG data URL
 */
const SignaturePad = React.forwardRef(function SignaturePad(_props, ref) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const hasInk = useRef(false);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const point = e.touches ? e.touches[0] : e;
    return { x: point.clientX - rect.left, y: point.clientY - rect.top };
  };

  const start = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
    drawing.current = true;
  };

  const move = (e) => {
    if (!drawing.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getPos(e, canvas);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "#1e3a8a";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();
    hasInk.current = true;
  };

  const end = () => {
    drawing.current = false;
  };

  const clear = () => {
    const canvas = canvasRef.current;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    hasInk.current = false;
  };

  React.useImperativeHandle(ref, () => ({
    isEmpty: () => !hasInk.current,
    toDataURL: () => canvasRef.current.toDataURL("image/png"),
  }));

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={360}
        height={100}
        className="w-full border border-gray-300 rounded bg-gray-50 touch-none"
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={end}
      />
      <button
        onClick={clear}
        className="text-xs text-gray-400 hover:text-gray-600 mt-1"
      >
        Clear signature
      </button>
    </div>
  );
});

export default SignaturePad;
