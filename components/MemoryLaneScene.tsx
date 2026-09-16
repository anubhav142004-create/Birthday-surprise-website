"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  photos: string[];
  onComplete?: () => void;
};

export default function MemoryLaneScene({
  photos,
  onComplete,
}: Props) {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 250);

    return () => clearTimeout(timer);
  }, []);

  const scrollToPhoto = (index: number) => {
    if (!photos.length) return;

    const next = Math.max(
      0,
      Math.min(index, photos.length - 1)
    );

    setActive(next);

    const track = trackRef.current;

    if (track) {
      const card =
        track.children[next] as HTMLElement | undefined;

      if (card) {
        track.scrollTo({
          left:
            card.offsetLeft -
            (track.clientWidth - card.offsetWidth) / 2,
          behavior: "smooth",
        });
      }
    }
  };

  const handleScroll = () => {
    const track = trackRef.current;

    if (!track || !photos.length) return;

    const center =
      track.scrollLeft +
      track.clientWidth / 2;

    let closest = 0;
    let distance = Infinity;

    Array.from(track.children).forEach(
      (child, index) => {
        const element = child as HTMLElement;

        const childCenter =
          element.offsetLeft +
          element.offsetWidth / 2;

        const currentDistance =
          Math.abs(center - childCenter);

        if (currentDistance < distance) {
          distance = currentDistance;
          closest = index;
        }
      }
    );

    setActive(closest);
  };

  const gradients = [
    "linear-gradient(135deg, #ffb347, #ff6f61)",
    "linear-gradient(135deg, #ff8fab, #ff5c8a)",
    "linear-gradient(135deg, #ffc371, #ff5f6d)",
    "linear-gradient(135deg, #ff9a9e, #fad0c4)",
    "linear-gradient(135deg, #fbc2eb, #a6c1ee)",
    "linear-gradient(135deg, #ffecd2, #fcb69f)",
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999999,
        overflow: "hidden",
        background:
          "radial-gradient(circle at 50% 28%, rgba(111,52,95,.72), transparent 42%), linear-gradient(180deg, #16091c 0%, #241025 42%, #4a2038 100%)",
        color: "#fff",
      }}
    >
      <style>{`

        * {
          -webkit-tap-highlight-color: transparent;
        }

        @keyframes memoryFade {
          0% {
            opacity: 0;
            transform: translateY(35px);
          }

          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes titleGlow {
          0%, 100% {
            text-shadow:
              0 0 12px rgba(255,255,255,.08);
          }

          50% {
            text-shadow:
              0 0 25px rgba(255,180,220,.25);
          }
        }

         @keyframes memoryBulbGlow {
  0%, 100% {
    opacity: .85;
    transform: scale(.92);
  }

  50% {
    opacity: 1;
    transform: scale(1.08);
  }
}

        @keyframes starTwinkle {
          0%, 100% {
            opacity: .15;
            transform: scale(.8);
          }

          50% {
            opacity: .85;
            transform: scale(1.2);
          }
        }

        @keyframes cardFloat {
          0%, 100% {
            transform:
              rotate(-1.5deg)
              translateY(0);
          }

          50% {
            transform:
              rotate(-1.5deg)
              translateY(-6px);
          }
        }

        @keyframes buttonGlow {
          0%, 100% {
            box-shadow:
              0 8px 25px rgba(255,105,70,.18);
          }

          50% {
            box-shadow:
              0 8px 40px rgba(255,105,70,.42),
              0 0 25px rgba(255,170,100,.15);
          }
        }

        .memory-track::-webkit-scrollbar {
          display: none;
        }

        .memory-track {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        @media (max-width: 700px) {

          .memory-title {
            font-size: 31px !important;
          }

          .memory-subtitle {
            font-size: 17px !important;
            margin-top: 12px !important;
          }

          /*
           * MOBILE:
           * Light line stays above the photos.
           */
          .memory-light-line {
            top: 29% !important;
          }
             .memory-bulb {
                  top: calc(29% - 11px) !important;
            }

          .memory-track {
            top: 30.5% !important;
            height: 61% !important;
            padding-left: 18vw !important;
            padding-right: 18vw !important;
            gap: 18px !important;
            align-items: flex-start !important;
            overflow-y: visible !important;
          }

          .memory-card {
            min-width: 62vw !important;
            width: 62vw !important;
            padding: 9px 9px 16px !important;
            margin-top: 8px !important;
          }

          .memory-photo {
            height: 36vh !important;
            max-height: 360px !important;
          }

          .memory-bottom {
            bottom: 1.5% !important;
          }

          .memory-button {
            width: 82vw !important;
            height: 60px !important;
            font-size: 18px !important;
          }

          .memory-dots {
            bottom: 10.5% !important;
          }
        }

        @media (min-width: 701px) {

          .memory-title {
            font-size: 43px !important;
          }

          /*
           * DESKTOP:
           * Line = 29%
           * Bulbs = above line
           * Photos = below line
           */
          .memory-light-line {
            top: 29% !important;
          }

          .memory-bulb {
  top: calc(29% - 11px) !important;
}

          .memory-track {
            top: 30.5% !important;
            height: 62% !important;
            padding-left: 36vw !important;
            padding-right: 36vw !important;
            gap: 24px !important;
            align-items: flex-start !important;
            overflow-y: visible !important;
          }

          .memory-card {
            min-width: 300px !important;
            width: 300px !important;
            padding: 10px 10px 18px !important;
            margin-top: 8px !important;
          }

          .memory-photo {
            height: 325px !important;
            max-height: 325px !important;
          }

          .memory-bottom {
            bottom: 1.5% !important;
          }

          .memory-button {
            width: min(430px, 70vw) !important;
            height: 62px !important;
            font-size: 18px !important;
          }

          .memory-dots {
            bottom: 10% !important;
          }
        }

      `}</style>

      {/* =========================================
          STARS
      ========================================= */}

      {Array.from({ length: 45 }).map(
        (_, i) => (
          <span
            key={`star-${i}`}
            style={{
              position: "absolute",
              left: `${(i * 37) % 100}%`,
              top: `${8 + ((i * 23) % 76)}%`,
              width:
                i % 5 === 0
                  ? "4px"
                  : "2px",
              height:
                i % 5 === 0
                  ? "4px"
                  : "2px",
              borderRadius: "50%",
              background:
                i % 4 === 0
                  ? "#ffdca8"
                  : "#fff",
              opacity: 0.2,
              animation:
                `starTwinkle ${
                  2.5 + (i % 4)
                }s ease-in-out ${
                  (i % 7) * .35
                }s infinite`,
              pointerEvents: "none",
            }}
          />
        )
      )}

      {/* =========================================
          TOP CONTENT
      ========================================= */}

      <div
        style={{
          position: "absolute",
          top: "5%",
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 10,
          opacity: visible ? 1 : 0,
          animation:
            visible
              ? "memoryFade .9s ease-out both"
              : undefined,
        }}
      >
        <div
          className="memory-title"
          style={{
            fontFamily:
              "Georgia, 'Times New Roman', serif",
            fontWeight: 600,
            fontStyle: "italic",
            fontSize:
              "clamp(34px, 4.5vw, 54px)",
            letterSpacing: ".015em",
            color: "#fff8f3",
            textShadow:
              "0 4px 20px rgba(255,180,220,.22), 0 0 35px rgba(255,255,255,.08)",
            animation:
              "titleGlow 4s ease-in-out infinite",
          }}
        >
          A walk down memory lane
        </div>

        <div
          className="memory-subtitle"
          style={{
            marginTop: "14px",
            fontFamily:
              "Georgia, 'Times New Roman', serif",
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: "18px",
            letterSpacing: ".08em",
            color:
              "rgba(255,235,225,.82)",
            textShadow:
              "0 2px 12px rgba(255,170,210,.22)",
          }}
        >
          swipe through{" "}
          <span
            style={{
              display: "inline-block",
              marginLeft: "5px",
              fontStyle: "normal",
              fontSize: "20px",
              filter:
                "drop-shadow(0 0 7px rgba(255,210,140,.35))",
            }}
          >
            📸
          </span>
        </div>
      </div>

      {/* =========================================
          LIGHT LINE
      ========================================= */}

      <div
        className="memory-light-line"
        style={{
          position: "absolute",
          top: "29%",
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, rgba(255,193,104,.72), transparent)",
          boxShadow:
            "0 0 14px rgba(255,193,104,.3)",
          zIndex: 2,
        }}
      />

      {/* =========================================
          LIGHT BULBS
          BULBS ARE ABOVE THE LINE
      ========================================= */}

      {Array.from({ length: 7 }).map(
        (_, i) => (
          <span
            key={`bulb-${i}`}
            className="memory-bulb"
            style={{
              position: "absolute",

              /*
               * ABOVE THE LINE
               */
              top: "calc(27.5% - 5px)",

              left:
                `${10 + i * 13.3}%`,

              width: "11px",
              height: "11px",

              borderRadius: "50%",

              background: "#ffe29a",

             boxShadow:
                 "0 0 8px rgba(255,225,150,.95), 0 0 18px rgba(255,205,110,.75), 0 0 32px rgba(255,180,80,.35)",
                  animation: "memoryBulbGlow 2s ease-in-out infinite",
              zIndex: 4,
            }}
          />
        )
      )}

      {/* =========================================
          PHOTO AREA
          BELOW LIGHT LINE
      ========================================= */}

      {photos.length > 0 ? (
        <div
          ref={trackRef}
          className="memory-track"
          onScroll={handleScroll}
          style={{
            position: "absolute",

            /*
             * PHOTO STARTS BELOW THE LINE
             */
            top: "30.5%",

            left: 0,
            right: 0,

            height: "62%",

            display: "flex",

            alignItems: "flex-start",

            gap: "30px",

            overflowX: "auto",

            /*
             * IMPORTANT:
             * Don't cut the clip or heart.
             */
            overflowY: "visible",

            paddingLeft: "17vw",
            paddingRight: "17vw",

            scrollSnapType:
              "x mandatory",

            zIndex: 8,
          }}
        >
          {photos.map(
            (photo, index) => (
              <div
                key={`${photo}-${index}`}
                className="memory-card"
                style={{
                  position: "relative",

                  minWidth: "72vw",
                  width: "72vw",
                  maxWidth: "520px",

                  flexShrink: 0,

                  padding:
                    "15px 15px 28px",

                  background:
                    "#fffdf4",

                  borderRadius: "5px",

                  boxShadow:
                    "0 18px 50px rgba(0,0,0,.35), 0 4px 15px rgba(255,210,160,.12)",

                  scrollSnapAlign:
                    "center",

                  transform:
                    index % 2 === 0
                      ? "rotate(-2deg)"
                      : "rotate(2deg)",

                  animation:
                    "cardFloat 5s ease-in-out infinite",

                  animationDelay:
                    `${index * .25}s`,
                }}
              >

                {/* =================================
                    HANGING STRING
                    ================================= */}

                <div
                  style={{
                    position: "absolute",

                    /*
                     * Clip is attached to the
                     * light line area.
                     */
                    top: "-39px",

                    left: "50%",

                    transform:
                      "translateX(-50%)",

                    width: "2px",
                    height: "28px",

                    background:
                      "linear-gradient(180deg, rgba(255,216,145,.15), #e0b866)",

                    boxShadow:
                      "0 0 5px rgba(255,210,130,.35)",

                    zIndex: 5,
                  }}
                />

                {/* =================================
                    GOLD CLIP
                    ================================= */}

                <div
                  style={{
                    position: "absolute",

                    /*
                     * Clip sits just below
                     * the light line.
                     */
                    top: "-15px",

                    left: "50%",

                    transform:
                      "translateX(-50%)",

                    width: "25px",
                    height: "31px",

                    borderRadius:
                      "7px 7px 5px 5px",

                    background:
                      "linear-gradient(180deg,#fff0ad 0%,#e0bd68 48%,#c99b45 100%)",

                    border:
                      "1px solid rgba(255,245,205,.75)",

                    boxShadow:
                      "0 3px 8px rgba(0,0,0,.22), 0 0 8px rgba(255,215,130,.25)",

                    zIndex: 20,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      bottom: "-5px",

                      transform:
                        "translateX(-50%)",

                      width: "11px",
                      height: "7px",

                      borderRadius:
                        "0 0 8px 8px",

                      borderLeft:
                        "2px solid #c99d4d",

                      borderRight:
                        "2px solid #c99d4d",

                      borderBottom:
                        "2px solid #c99d4d",
                    }}
                  />
                </div>

                {/* =================================
                    PHOTO
                ================================= */}

                <div
                  className="memory-photo"
                  style={{
                    width: "100%",

                    height: "48vh",

                    maxHeight: "520px",

                    overflow: "hidden",

                    background:
                      gradients[
                        index %
                          gradients.length
                      ],

                    border:
                      "4px solid rgba(255,255,255,.96)",

                    borderRadius: "3px",

                    boxShadow:
                      "inset 0 0 0 1px rgba(120,70,90,.10), 0 4px 14px rgba(0,0,0,.12)",
                  }}
                >
                  <img
                    src={photo}
                    alt={`Memory ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>

                {/* =================================
                    POLAROID HEART
                ================================= */}

                <div
                  style={{
                    textAlign: "center",
                    paddingTop: "11px",
                    fontSize: "24px",
                    lineHeight: 1,
                  }}
                >
                  ❤️
                </div>

              </div>
            )
          )}
        </div>
      ) : (
        <div
          style={{
            position: "absolute",
            top: "51%",
            left: "50%",
            transform:
              "translate(-50%,-50%)",
            textAlign: "center",
            color:
              "rgba(255,240,235,.7)",
            zIndex: 10,
          }}
        >
          No memories added yet ❤️
        </div>
      )}

      {/* =========================================
          DOTS
      ========================================= */}

      {photos.length > 0 && (
        <div
          className="memory-dots"
          style={{
            position: "absolute",
            left: "50%",
            bottom: "10%",

            transform:
              "translateX(-50%)",

            display: "flex",
            gap: "10px",

            zIndex: 20,
          }}
        >
          {photos.map(
            (_, index) => (
              <button
                key={`dot-${index}`}
                type="button"
                aria-label={`Photo ${index + 1}`}
                onClick={() =>
                  scrollToPhoto(index)
                }
                style={{
                  width:
                    index === active
                      ? "18px"
                      : "8px",

                  height: "8px",

                  padding: 0,

                  border: "none",

                  borderRadius:
                    "999px",

                  background:
                    index === active
                      ? "#ffb32f"
                      : "rgba(255,255,255,.25)",

                  cursor: "pointer",

                  transition:
                    "all .3s ease",
                }}
              />
            )
          )}
        </div>
      )}

      {/* =========================================
          KEEP GOING
      ========================================= */}

      <div
        className="memory-bottom"
        style={{
          position: "absolute",

          left: "50%",
          bottom: "1.5%",

          transform:
            "translateX(-50%)",

          zIndex: 30,

          width: "100%",

          display: "flex",
          justifyContent: "center",
        }}
      >
        <button
          className="memory-button"
          type="button"
          onClick={() => {
            onComplete?.();
          }}
          style={{
            width:
              "min(430px, 70vw)",

            height: "62px",

            border: "none",

            borderRadius:
              "999px",

            background:
              "linear-gradient(135deg,#ff7657,#ffad5a)",

            color: "#fff",

            fontFamily:
              "Poppins, Arial, sans-serif",

            fontSize: "18px",

            fontWeight: 600,

            letterSpacing: ".01em",

            cursor: "pointer",

            animation:
              "buttonGlow 2.5s ease-in-out infinite",
          }}
        >
          Keep going ✨
        </button>
      </div>

    </div>
  );
}