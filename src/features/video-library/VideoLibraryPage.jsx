import { useRef, useState } from "react";
import {
  VIDEO_LIBRARY_ITEMS,
  VIDEO_LIBRARY_PLACEHOLDER_POSTER,
} from "./videoLibraryItems.js";
import "./VideoLibraryPage.css";

export { VIDEO_LIBRARY_ITEMS } from "./videoLibraryItems.js";

function siteAsset(path) {
  return `${import.meta.env.BASE_URL}${path}`;
}

export default function VideoLibraryPage({ setActivePage }) {
  const videoRefs = useRef([]);
  const [startedVideos, setStartedVideos] = useState({});
  const [activeVideoId, setActiveVideoId] = useState(null);

  function handlePlay(activeIndex, activeId) {
    videoRefs.current.forEach((player, index) => {
      if (player && index !== activeIndex && !player.paused) player.pause();
    });
    setActiveVideoId(activeId);
  }

  function toggleVideo(index) {
    const player = videoRefs.current[index];
    if (!player) return;

    if (player.paused || player.ended) {
      player.play().catch(() => {});
    } else {
      player.pause();
    }
  }

  function openAssociatedPage(page) {
    setActivePage(page);
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  return (
    <main className="pageShell videoLibraryPage">
      <header className="videoLibraryIntro rrbSectionIntroComponent isCentered">
        <div className="rrbSectionIntroCopy">
          <div className="rrbSectionIntroTitleRow">
            <h2>Video Library</h2>
          </div>
          <p>
            Browse the guides in Robert’s preferred order. A color-bar test pattern marks
            each planned subject that does not yet have a finished video.
          </p>
        </div>
      </header>

      <div className="videoLibraryGrid" aria-label="Robert’s Recipe Box ordered video library">
        {VIDEO_LIBRARY_ITEMS.map((item, index) => (
          <article className="videoLibraryCard" key={item.id}>
            <div className="videoLibraryPlayerFrame">
              {item.video ? (
                startedVideos[item.id] ? (
                  <>
                    <video
                      ref={(node) => {
                        videoRefs.current[index] = node;
                      }}
                      autoPlay
                      playsInline
                      preload="metadata"
                      poster={siteAsset(item.poster)}
                      onPlay={() => handlePlay(index, item.id)}
                      onPause={() => setActiveVideoId((current) => current === item.id ? null : current)}
                      onEnded={() => setActiveVideoId((current) => current === item.id ? null : current)}
                      onClick={() => toggleVideo(index)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          toggleVideo(index);
                        }
                      }}
                      tabIndex="0"
                      role="button"
                      aria-label={`${activeVideoId === item.id ? "Pause" : "Play"} ${item.title}`}
                    >
                      <source src={siteAsset(item.video)} type="video/mp4" />
                      Your browser does not support HTML5 video.
                    </video>
                    {activeVideoId !== item.id && (
                      <span className="videoLibraryPausedOverlay" aria-hidden="true">▶</span>
                    )}
                  </>
                ) : (
                  <button
                    className="videoLibraryPosterButton"
                    type="button"
                    onClick={() => {
                      setStartedVideos((current) => ({ ...current, [item.id]: true }));
                    }}
                    aria-label={`Play ${item.title}`}
                  >
                    <img src={siteAsset(item.poster)} alt="" aria-hidden="true" />
                    <span className="videoLibraryPlayIcon" aria-hidden="true">▶</span>
                  </button>
                )
              ) : (
                <div
                  className="videoLibraryPlaceholder"
                  role="img"
                  aria-label={`${item.title} video not yet assigned`}
                >
                  <img
                    src={siteAsset(VIDEO_LIBRARY_PLACEHOLDER_POSTER)}
                    alt=""
                    aria-hidden="true"
                  />
                  <span>VIDEO NOT YET ASSIGNED</span>
                  <small>TEST PATTERN</small>
                </div>
              )}
            </div>
            <div className="videoLibraryCardCopy">
              <span className="videoLibraryNumber">VIDEO {String(index + 1).padStart(2, "0")}</span>
              <h4>{item.title}</h4>
              <p>{item.description}</p>
              <button type="button" onClick={() => openAssociatedPage(item.page)}>
                {item.pageLabel}
              </button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
