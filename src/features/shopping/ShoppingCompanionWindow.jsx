import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ShoppingCompanionPanel from "./ShoppingCompanionPanel.jsx";

const COMPANION_WINDOW_NAME = "rrbShoppingCompanion";

export default function ShoppingCompanionWindow(props) {
  const [portalTarget, setPortalTarget] = useState(null);
  const closeCallback = useRef(props.onClose);

  useEffect(() => {
    const availableWidth = Math.max(720, Number(window.screen?.availWidth) || 1440);
    const availableHeight = Math.max(640, Number(window.screen?.availHeight) || 900);
    const left = Math.max(0, Math.min(availableWidth - 430, 24));
    const companionWindow = window.open("", COMPANION_WINDOW_NAME, `popup=yes,width=410,height=${Math.min(760, availableHeight - 70)},left=${left},top=35,resizable=yes,scrollbars=yes`);
    if (!companionWindow) {
      window.alert("Please allow pop-up windows to open the Shopping Companion.");
      closeCallback.current();
      return undefined;
    }

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
    };
  }, []);

  return portalTarget ? createPortal(<ShoppingCompanionPanel {...props} />, portalTarget) : null;
}
