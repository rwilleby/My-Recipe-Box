import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../src/App.css", import.meta.url), "utf8");

assert.match(app, /const \[openNavMenu, setOpenNavMenu\] = useState\(null\)/);
assert.match(app, /ref=\{mainNavigationRef\}/);
assert.match(app, /aria-expanded=\{isMenuOpen\}/);
assert.match(app, /aria-controls=\{menuId\}/);
assert.match(app, /current === group\.label \? null : group\.label/);
assert.match(app, /document\.addEventListener\("pointerdown", closeMenuFromOutside\)/);
assert.match(app, /event\.key === "Escape"/);
assert.match(app, /setOpenNavMenu\(null\);\s*setActivePage\(item\.page\)/s);
assert.match(styles, /\.simpleHeaderNavItem\.isOpen > \.simpleHeaderSubmenu \{[^}]*visibility: visible[^}]*pointer-events: auto/s);
assert.match(styles, /\.simpleHeaderNavButton \{[^}]*touch-action: manipulation/s);
assert.match(styles, /@media \(hover: none\), \(pointer: coarse\)/);
assert.match(styles, /@media \(max-width: 900px\) \{[\s\S]*?\.simpleHeaderNav \{[^}]*overflow: visible[^}]*flex-wrap: wrap/s);

console.log("iPad main navigation tap behavior v82.14 tests passed.");
