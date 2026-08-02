import { useEffect, useId, useRef, useState } from "react";
import "./HelpTooltip.css";

export default function HelpTooltip({ text, label = "More information", placement = "top" }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const tooltipId = useId();

  useEffect(() => {
    if (!open) return undefined;

    function closeOnOutsideClick(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }

    function closeOnEscape(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <span ref={rootRef} className={`helpTooltip helpTooltip--${placement}${open ? " isOpen" : ""}`}>
      <button
        type="button"
        className="helpTooltipButton"
        aria-label={label}
        aria-describedby={tooltipId}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        i
      </button>
      <span id={tooltipId} className="helpTooltipBubble" role="tooltip">
        {text}
      </span>
    </span>
  );
}
