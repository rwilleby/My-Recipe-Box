import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ShoppingCompanionPanel from "./ShoppingCompanionPanel.jsx";

const COMPANION_WINDOW_NAME = "rrbShoppingCompanion";
let companionWindowReference = null;

function companionWindowBounds(browserWindow = window) {
  const screen = browserWindow.screen || {};
  const availableWidth = Math.max(720, Number(screen.availWidth) || 1440);
  const availableHeight = Math.max(640, Number(screen.availHeight) || 900);
  const availableLeft = Number(screen.availLeft) || 0;
  const availableTop = Number(screen.availTop) || 0;
  const width = availableWidth >= 1100 ? Math.max(410, Math.floor(availableWidth * 0.25)) : Math.min(430, availableWidth);
  return { width, height: availableHeight, left: availableLeft + (availableWidth >= 1100 ? Math.floor(availableWidth * 0.31) : 0), top: availableTop };
}

export function focusShoppingCompanionWindow() {
  if (!companionWindowReference || companionWindowReference.closed) return false;
  companionWindowReference.focus();
  return true;
}

export function restoreShoppingCompanionWindow(browserWindow = window) {
  if (!companionWindowReference || companionWindowReference.closed) return false;
  const bounds = companionWindowBounds(browserWindow);
  companionWindowReference.moveTo(bounds.left, bounds.top);
  companionWindowReference.resizeTo(bounds.width, bounds.height);
  companionWindowReference.focus();
  return true;
}

export default function ShoppingCompanionWindow(props) {
  const [portalTarget, setPortalTarget] = useState(null);
  const closeCallback = useRef(props.onClose);

  useEffect(() => {
    const bounds = companionWindowBounds(window);
    const companionWindow = window.open("", COMPANION_WINDOW_NAME, `popup=yes,width=${bounds.width},height=${bounds.height},left=${bounds.left},top=${bounds.top},resizable=yes,scrollbars=yes`);
    if (!companionWindow) {
      window.alert("Please allow pop-up windows to open the Shopping Companion.");
      closeCallback.current();
      return undefined;
    }
    companionWindowReference = companionWindow;
    companionWindow.moveTo?.(bounds.left, bounds.top);
    companionWindow.resizeTo?.(bounds.width, bounds.height);

    companionWindow.document.title = "Shopping Companion · Robert's Recipe Box";
    companionWindow.document.head.replaceChildren();
    document.querySelectorAll('link[rel="stylesheet"], style').forEach((node) => companionWindow.document.head.appendChild(node.cloneNode(true)));
    companionWindow.document.body.replaceChildren();
    companionWindow.document.body.className = "shoppingCompanionWindowBody";
    const target = companionWindow.document.createElement("div");
    target.id = "shopping-companion-root";
    companionWindow.document.body.appendChild(target);
    setPortalTarget(target);
    companionWindow.focus();

    const handleWindowClose = () => closeCallback.current();
    companionWindow.addEventListener("beforeunload", handleWindowClose);
    return () => {
      companionWindow.removeEventListener("beforeunload", handleWindowClose);
      if (!companionWindow.closed) companionWindow.close();
      if (companionWindowReference === companionWindow) companionWindowReference = null;
    };
  }, []);

  return portalTarget ? createPortal(<ShoppingCompanionPanel {...props} />, portalTarget) : null;
}
