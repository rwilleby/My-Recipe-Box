import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./HelpTooltip.css";

export default function HelpTooltip({ text, label = "More information", placement = "top" }) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [position, setPosition] = useState(null);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const bubbleRef = useRef(null);
  const tooltipId = useId();
  const open = hovered || focused || pinned;

  const placeTooltip = useCallback(() => {
    const button = buttonRef.current;
    const bubble = bubbleRef.current;
    if (!button || !bubble) return;

    const margin = 12;
    const gap = 8;
    const buttonBox = button.getBoundingClientRect();
    const bubbleBox = bubble.getBoundingClientRect();
    const roomAbove = buttonBox.top - margin;
    const roomBelow = window.innerHeight - buttonBox.bottom - margin;
    let actualPlacement = placement === "bottom" ? "bottom" : "top";

    if (actualPlacement === "top" && bubbleBox.height + gap > roomAbove && roomBelow > roomAbove) {
      actualPlacement = "bottom";
    } else if (actualPlacement === "bottom" && bubbleBox.height + gap > roomBelow && roomAbove > roomBelow) {
      actualPlacement = "top";
    }

    const centeredLeft = buttonBox.left + (buttonBox.width / 2) - (bubbleBox.width / 2);
    const maxLeft = Math.max(margin, window.innerWidth - bubbleBox.width - margin);
    const left = Math.min(Math.max(centeredLeft, margin), maxLeft);
    const preferredTop = actualPlacement === "top"
      ? buttonBox.top - bubbleBox.height - gap
      : buttonBox.bottom + gap;
    const maxTop = Math.max(margin, window.innerHeight - bubbleBox.height - margin);
    const top = Math.min(Math.max(preferredTop, margin), maxTop);
    const arrowLeft = Math.min(
      Math.max(buttonBox.left + (buttonBox.width / 2) - left, 10),
      Math.max(10, bubbleBox.width - 10),
    );

    setPosition({ left, top, arrowLeft, placement: actualPlacement });
  }, [placement]);

  useLayoutEffect(() => {
    if (!open) {
      setPosition(null);
      return undefined;
    }

    placeTooltip();
    return undefined;
  }, [open, text, placeTooltip]);

  useEffect(() => {
    if (!open) return undefined;

    function closeOnOutsideClick(event) {
      if (!rootRef.current?.contains(event.target)) setPinned(false);
    }

    function closeOnEscape(event) {
      if (event.key === "Escape") {
        setPinned(false);
        setHovered(false);
        buttonRef.current?.blur();
      }
    }

    function reposition() {
      placeTooltip();
    }

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }, [open, placeTooltip]);

  return (
    <span ref={rootRef} className={`helpTooltip${open ? " isOpen" : ""}`}>
      <button
        ref={buttonRef}
        type="button"
        className="helpTooltipButton"
        aria-label={label}
        aria-describedby={tooltipId}
        aria-expanded={open}
        onClick={() => setPinned((current) => !current)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        i
      </button>
      {open && createPortal(
        <span
          ref={bubbleRef}
          id={tooltipId}
          className={`helpTooltipBubble helpTooltipBubble--${position?.placement || placement}${position ? " isPositioned" : ""}`}
          role="tooltip"
          style={position ? {
            left: `${position.left}px`,
            top: `${position.top}px`,
            "--help-tooltip-arrow-left": `${position.arrowLeft}px`,
          } : undefined}
        >
          {text}
        </span>,
        document.body,
      )}
    </span>
  );
}
