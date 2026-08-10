const VIDEO_ICON_PATHS = {
  main: "images/icons/video-red.webp",
  supplemental: "images/icons/video-gray.webp",
};

export default function VideoIcon({ role = "supplemental", alt = "", className = "" }) {
  const normalizedRole = role === "main" ? "main" : "supplemental";
  return (
    <img
      src={`${import.meta.env.BASE_URL}${VIDEO_ICON_PATHS[normalizedRole]}`}
      alt={alt}
      className={className}
      data-video-icon-role={normalizedRole}
    />
  );
}

export { VIDEO_ICON_PATHS };
