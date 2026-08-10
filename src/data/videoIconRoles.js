export const VIDEO_ICON_ROLES = Object.freeze({
  MAIN: Object.freeze({
    role: "main",
    label: "Main / large hero video",
    asset: "images/icons/video-red.webp",
  }),
  SUPPLEMENTAL: Object.freeze({
    role: "supplemental",
    label: "Supplemental / descriptive video",
    asset: "images/icons/video-gray.webp",
  }),
});

export function getVideoIconAsset(role = "supplemental") {
  return role === "main"
    ? VIDEO_ICON_ROLES.MAIN.asset
    : VIDEO_ICON_ROLES.SUPPLEMENTAL.asset;
}
