"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  name: string;
  age: string;
  birthday: string;
  onComplete?: () => void;
};

export default function BirthdayTreeScene({
  name,
  age,
  birthday,
  onComplete,
}: Props) {
  const [showTree, setShowTree] = useState(false);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowTree(true), 300);
    const t2 = setTimeout(() => setShowText(true), 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  /*
   * HEART-SHAPED LEAVES
   */
  const hearts = useMemo(() => {
    const result: {
      x: number;
      y: number;
      s: number;
      d: number;
      color: string;
      rotate: number;
    }[] = [];

    const colors = [
      "#ef4f88", "#f04d83", "#f45f91", "#ff6f9c",
      "#f77da8", "#ff8fae", "#ff9b72", "#ffad88",
      "#ffb6a0", "#ffc1c9", "#ff5d98", "#e9477f",
      "#f96b9b", "#ff789f",
    ];

    const points: { x: number; y: number; depth: number }[] = [];

    // OUTER HEART - fills a real ❤️ shape
    for (let y = -1.25; y <= 1.05; y += 0.15) {
      for (let x = -1.35; x <= 1.35; x += 0.15) {
        const yy = -y;
        const equation =
          Math.pow(x * x + yy * yy - 1, 3) -
          x * x * Math.pow(yy, 3);

        if (equation <= 0) {
          const noise =
            Math.sin((x + 2) * 17.3 + (y + 2) * 11.7) * 0.035;

          points.push({
            x: 50 + x * 29 + noise * 10,
            y: 28 + y * 27 + noise * 7,
            depth: Math.sqrt(x * x + y * y),
          });
        }
      }
    }

    // INNER HEART - extra density so the crown stays very full
    for (let y = -0.95; y <= 0.85; y += 0.16) {
      for (let x = -1.08; x <= 1.08; x += 0.16) {
        const yy = -y;
        const equation =
          Math.pow(x * x + yy * yy - 0.72, 3) -
          x * x * Math.pow(yy, 3);

        if (equation <= 0) {
          points.push({
            x: 50 + x * 27 + Math.sin(x * 12 + y * 8) * 1.2,
            y: 29 + y * 27 + Math.cos(x * 9 + y * 11) * 1.2,
            depth: Math.sqrt(x * x + y * y),
          });
        }
      }
    }

    points.forEach((point, i) => {
      const sizes = [
        0.42, 0.48, 0.55, 0.62, 0.68,
        0.75, 0.82, 0.9, 0.98,
      ];

      const edgeFactor = Math.min(1, point.depth * 0.75);
      const size = sizes[i % sizes.length] * (1.08 - edgeFactor * 0.22);

      result.push({
        x: point.x,
        y: point.y,
        s: size,
        d: (i % 55) * 0.014,
        color: colors[i % colors.length],
        rotate: -45 + Math.sin(i * 1.73) * 8,
      });
    });

    return result;
  }, []);

  /*
   * FLOATING HEARTS
   */
  const floatingHearts = [
    { x: 7, y: 18, s: 0.55, d: 0.2 },
    { x: 94, y: 15, s: 0.65, d: 0.6 },
    { x: 4, y: 34, s: 0.75, d: 1 },
    { x: 96, y: 31, s: 0.6, d: 1.4 },
    { x: 8, y: 49, s: 0.5, d: 1.8 },
    { x: 92, y: 48, s: 0.58, d: 2.1 },
    { x: 5, y: 65, s: 0.7, d: 2.4 },
    { x: 95, y: 63, s: 0.48, d: 2.8 },
    { x: 14, y: 76, s: 0.45, d: 3 },
    { x: 87, y: 74, s: 0.52, d: 3.4 },
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999999,
        overflow: "hidden",
        background:
          "linear-gradient(180deg,#fffaf5 0%,#fff3ea 50%,#ffe0d1 100%)",
      }}
    >
      <style>{`

        /* =========================
           TREE GROW
        ========================= */

        @keyframes treeGrow {
          0% {
            transform:
              translateX(-50%)
              translateY(100px)
              scaleY(0);
            transform-origin: bottom center;
            opacity: 0;
          }

          100% {
            transform:
              translateX(-50%)
              translateY(0)
              scaleY(1);
            transform-origin: bottom center;
            opacity: 1;
          }
        }

        /* =========================
           BRANCH GROW
        ========================= */

        @keyframes branchGrow {
          0% {
            stroke-dashoffset: 600;
            opacity: 0;
          }

          100% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }

        /* =========================
           HEART APPEAR
        ========================= */

        @keyframes heartAppear {
          0% {
            opacity: 0;
            transform:
              translate(-50%,-50%)
              scale(0);
          }

          65% {
            opacity: 1;
            transform:
              translate(-50%,-50%)
              scale(1.16);
          }

          100% {
            opacity: 1;
            transform:
              translate(-50%,-50%)
              scale(1);
          }
        }

        /* =========================
           HEART FLOAT
        ========================= */

        @keyframes heartFloat {
          0%,
          100% {
            margin-top: 0;
          }

          50% {
            margin-top: -4px;
          }
        }

        /* =========================
           FLOATING HEARTS
        ========================= */

        @keyframes floatingHeart {
          0% {
            opacity: 0;
            transform:
              translateY(20px)
              scale(.65)
              rotate(-10deg);
          }

          20% {
            opacity: .8;
          }

          50% {
            opacity: .7;
            transform:
              translateY(-8px)
              scale(1)
              rotate(7deg);
          }

          100% {
            opacity: 0;
            transform:
              translateY(-40px)
              scale(.8)
              rotate(-5deg);
          }
        }

        /* =========================
           TEXT PANEL
        ========================= */

        @keyframes panelAppear {
          0% {
            opacity: 0;
            transform: translateY(45px);
            filter: blur(12px);
          }

          100% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }

        /* =========================
           TITLE GLOW
        ========================= */

        @keyframes titleGlow {
          0%,
          100% {
            text-shadow:
              0 4px 15px rgba(190,30,85,.16);
          }

          50% {
            text-shadow:
              0 4px 25px rgba(220,40,100,.36),
              0 0 18px rgba(255,100,160,.12);
          }
        }

        /* =========================
           NAME GLOW
        ========================= */

        @keyframes nameGlow {
          0%,
          100% {
            text-shadow:
              0 4px 18px rgba(220,55,110,.20);
          }

          50% {
            text-shadow:
              0 4px 25px rgba(220,55,110,.42),
              0 0 20px rgba(255,120,170,.18);
          }
        }

        /* =========================
           BUTTON
        ========================= */

        @keyframes buttonPulse {
          0%,
          100% {
            box-shadow:
              0 0 16px rgba(255,100,160,.20);
          }

          50% {
            box-shadow:
              0 0 28px rgba(255,100,160,.42),
              0 0 50px rgba(255,70,150,.14);
          }
        }

        /* =========================
           MOBILE
        ========================= */

        @media (max-width:700px) {

          .birthday-tree-wrap {
            width: 125vw !important;
            height: 77vh !important;

            /*
             * TREE নিচে
             */
            top: 10% !important;
          }

          .birthday-text-panel {
            right: 3% !important;
            bottom: 3% !important;
            width: 57% !important;

            padding:
              15px 12px 13px !important;
          }

          .birthday-small-title {
            font-size: 12px !important;
            margin-bottom: 10px !important;
          }

          .birthday-main-title {
            font-size: 29px !important;
          }

          .birthday-happy {
            margin-bottom: 10px !important;
          }

          .birthday-name {
            font-size: 42px !important;
          }

          .birthday-age {
            font-size: 13px !important;
          }

          .birthday-date {
            font-size: 11px !important;
          }

          .birthday-button {
            padding:
              9px 17px !important;
            font-size: 9px !important;
          }
        }

        /* =========================
           DESKTOP
        ========================= */

        @media (min-width:701px) {

          .birthday-tree-wrap {
            width:
              min(760px,68vw) !important;

            height: 82vh !important;

            left: 32% !important;

            /*
             * TREE নিচে
             */
            top: 8% !important;
          }

          .birthday-text-panel {
            right: 5% !important;
            bottom: 10% !important;
            width:
              min(390px,32vw) !important;
          }
        }

      `}</style>

      {/* =========================
          BACKGROUND GLOW
      ========================= */}

      <div
        style={{
          position: "absolute",
          left: "35%",
          top: "38%",
          width: "80vw",
          maxWidth: "850px",
          aspectRatio: "1",
          transform: "translate(-50%,-50%)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(255,190,170,.48),rgba(255,220,200,.16) 55%,transparent 72%)",
          filter: "blur(12px)",
          pointerEvents: "none",
        }}
      />

      {/* =========================
          LIGHT RAYS
      ========================= */}

      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.3,
          pointerEvents: "none",
          background: `
            repeating-conic-gradient(
              from 250deg at 32% 5%,
              rgba(255,255,255,.58) 0deg 7deg,
              transparent 7deg 17deg
            )
          `,
          maskImage:
            "linear-gradient(to bottom,black 0%,transparent 70%)",
          WebkitMaskImage:
            "linear-gradient(to bottom,black 0%,transparent 70%)",
        }}
      />

      {/* =========================
          FLOATING HEARTS
      ========================= */}

      {floatingHearts.map((heart, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${heart.x}%`,
            top: `${heart.y}%`,
            width: `${38 * heart.s}px`,
            height: `${38 * heart.s}px`,
            zIndex: 3,
            opacity: 0,
            animation:
              `floatingHeart 5s ease-in-out ${heart.d}s infinite`,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              transform: "rotate(-45deg)",
              borderRadius: "50% 50% 0 50%",
              background:
                i % 3 === 0
                  ? "#ef4f88"
                  : i % 3 === 1
                    ? "#ff9b72"
                    : "#f77da8",
              boxShadow:
                "0 5px 15px rgba(220,50,110,.20)",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                top: "-50%",
                left: 0,
                background: "inherit",
              }}
            />

            <div
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                left: "50%",
                top: 0,
                background: "inherit",
              }}
            />
          </div>
        </div>
      ))}

      {/* =========================
          HEART TREE
      ========================= */}

      {showTree && (
        <div
          className="birthday-tree-wrap"
          style={{
            position: "absolute",

            /*
             * TREE POSITION
             */
            left: "32%",
            top: "8%",

            width: "min(760px,68vw)",
            height: "82vh",

            transform: "translateX(-50%)",

            animation:
              "treeGrow 2s cubic-bezier(.22,1,.36,1) both",

            zIndex: 5,
          }}
        >

          {/* =========================
              TREE SVG
          ========================= */}

          <svg
            viewBox="0 0 600 700"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              overflow: "visible",
            }}
          >

            <defs>

              <linearGradient
                id="treeTrunk"
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop
                  offset="0%"
                  stopColor="#43242c"
                />

                <stop
                  offset="35%"
                  stopColor="#69333e"
                />

                <stop
                  offset="65%"
                  stopColor="#87434e"
                />

                <stop
                  offset="100%"
                  stopColor="#43242c"
                />
              </linearGradient>

            </defs>

            {/* =========================
                MAIN TRUNK
            ========================= */}

            <path
              d="
                M300 700
                C300 620 292 545 300 470
                C307 400 301 330 300 260
              "
              fill="none"
              stroke="url(#treeTrunk)"
              strokeWidth="25"
              strokeLinecap="round"
            />

            {/* TRUNK HIGHLIGHT */}

            <path
              d="
                M302 695
                C302 620 298 545 305 470
                C312 400 306 330 305 260
              "
              fill="none"
              stroke="#bd6874"
              strokeWidth="3"
              strokeLinecap="round"
              opacity=".4"
            />

            {/* LEFT UPPER */}

            <path
              d="
                M300 390
                C240 330 175 270 112 210
              "
              fill="none"
              stroke="#63333d"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray="600"
              style={{
                animation:
                  "branchGrow 1.25s ease-out .6s both",
              }}
            />

            {/* LEFT TOP */}

            <path
              d="
                M300 315
                C270 255 230 205 195 145
              "
              fill="none"
              stroke="#63333d"
              strokeWidth="11"
              strokeLinecap="round"
              strokeDasharray="600"
              style={{
                animation:
                  "branchGrow 1.15s ease-out .75s both",
              }}
            />


            {/* RIGHT UPPER */}

            <path
              d="
                M300 390
                C360 330 425 270 488 210
              "
              fill="none"
              stroke="#63333d"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray="600"
              style={{
                animation:
                  "branchGrow 1.25s ease-out .6s both",
              }}
            />

            {/* RIGHT TOP */}

            <path
              d="
                M300 315
                C330 255 370 205 405 145
              "
              fill="none"
              stroke="#63333d"
              strokeWidth="11"
              strokeLinecap="round"
              strokeDasharray="600"
              style={{
                animation:
                  "branchGrow 1.15s ease-out .75s both",
              }}
            />

            {/* CENTER TOP */}

            <path
              d="
                M300 285
                C300 220 300 165 300 105
              "
              fill="none"
              stroke="#63333d"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray="600"
              style={{
                animation:
                  "branchGrow 1s ease-out .85s both",
              }}
            />

          </svg>

          {/* =========================
              HEART LEAVES
          ========================= */}

          {hearts.map((heart, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${heart.x}%`,
                top: `${heart.y}%`,

                width:
                  `${43 * heart.s}px`,

                height:
                  `${43 * heart.s}px`,

                transform:
                  "translate(-50%,-50%)",

                zIndex: 4,

                animation:
                  `heartAppear .5s cubic-bezier(.22,1,.36,1) ${heart.d}s both`,
              }}
            >

              <div
                style={{
                  width: "100%",
                  height: "100%",
                  position: "relative",

                  transform:
                    `rotate(${heart.rotate}deg)`,

                  borderRadius:
                    "50% 50% 0 50%",

                  background:
                    heart.color,

                  boxShadow:
                    "0 4px 11px rgba(180,30,80,.18)",
                }}
              >

                {/* LEFT HEART LOBE */}

                <div
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    top: "-50%",
                    left: 0,
                    background: "inherit",
                  }}
                />

                {/* RIGHT HEART LOBE */}

                <div
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    left: "50%",
                    top: 0,
                    background: "inherit",
                  }}
                />

              </div>

            </div>
          ))}

        </div>
      )}

      {/* =========================
          BIRTHDAY TEXT
      ========================= */}

      {showText && (
        <div
          className="birthday-text-panel"
          style={{
            position: "absolute",
            right: "5%",
            bottom: "10%",

            width:
              "min(390px,32vw)",

            padding:
              "24px 22px 20px",

            textAlign: "center",

            background:
              "rgba(255,248,244,.48)",

            backdropFilter:
              "blur(14px)",

            WebkitBackdropFilter:
              "blur(14px)",

            border:
              "1px solid rgba(255,255,255,.58)",

            borderRadius: "26px",

            boxShadow:
              "0 18px 55px rgba(160,70,90,.10),inset 0 1px 0 rgba(255,255,255,.65)",

            animation:
              "panelAppear 1.2s cubic-bezier(.22,1,.36,1) both",

            zIndex: 30,
          }}
        >

          {/* SMALL LINE */}

          <div
            className="birthday-small-title"
            style={{
              fontFamily:
                "Georgia,'Times New Roman',serif",
              fontStyle: "italic",
              fontWeight: 600,
              fontSize: "18px",
              color: "#8e5261",
              letterSpacing: ".055em",
              marginBottom: "12px",
            }}
          >
            it's officially your day
          </div>

          {/* HAPPY */}

          <div
            className="birthday-main-title birthday-happy"
            style={{
              fontFamily:
                "Georgia,'Times New Roman',serif",
              fontWeight: 700,
              fontSize:
                "clamp(35px,4vw,58px)",
              lineHeight: ".95",
              color: "#c82e68",
              letterSpacing: "-.035em",

              /*
               * HAPPY ও BIRTHDAY-এর মাঝে GAP
               */
              marginBottom: "14px",

              animation:
                "titleGlow 3s ease-in-out infinite",
            }}
          >
            Happy
          </div>

          {/* BIRTHDAY */}

          <div
            className="birthday-main-title"
            style={{
              fontFamily:
                "Georgia,'Times New Roman',serif",
              fontWeight: 700,
              fontSize:
                "clamp(35px,4vw,58px)",
              lineHeight: ".95",
              color: "#c82e68",
              letterSpacing: "-.035em",
              animation:
                "titleGlow 3s ease-in-out infinite",
            }}
          >
            Birthday,
          </div>

          {/* NAME FROM STEP 1 */}

          <div
            className="birthday-name"
            style={{
              marginTop: "9px",
              fontFamily:
                "var(--font-script),'Brush Script MT',cursive",
              fontSize:
                "clamp(44px,5vw,70px)",
              lineHeight: ".92",
              fontWeight: 400,
              color: "#ef5c91",
              animation:
                "nameGlow 3s ease-in-out infinite",
            }}
          >
            {name || "Your Name"}
          </div>

          {/* AGE FROM STEP 1 */}

          <div
            className="birthday-age"
            style={{
              marginTop: "14px",
              fontFamily:
                "Georgia,'Times New Roman',serif",
              fontStyle: "italic",
              fontWeight: 600,
              fontSize:
                "clamp(15px,1.8vw,21px)",
              lineHeight: "1.35",
              color: "#70404d",
            }}
          >
            and just like that, you're turning{" "}
            <span
              style={{
                color: "#c82e68",
                fontWeight: 700,
              }}
            >
              {age || ""}
            </span>

            {age ? " ✨" : ""}
          </div>

          {/* DATE FROM STEP 1 */}

          <div
            className="birthday-date"
            style={{
              marginTop: "8px",
              fontFamily:
                "Poppins,Arial,sans-serif",
              fontSize:
                "clamp(12px,1.5vw,16px)",
              fontWeight: 500,
              letterSpacing: ".12em",
              color: "#9a5969",
            }}
          >
            {birthday || ""}
          </div>

          {/* BUTTON */}

          <button
            className="birthday-button"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onComplete?.();
            }}
            style={{
              marginTop: "16px",
              padding: "11px 25px",

              borderRadius: "999px",

              border:
                "1px solid rgba(255,190,210,.8)",

              background:
                "rgba(25,25,25,.96)",

              color: "#fff8f5",

              fontSize: "10px",
              fontWeight: 700,

              letterSpacing: ".15em",

              textTransform:
                "uppercase",

              cursor: "pointer",

              whiteSpace:
                "nowrap",

              animation:
                "buttonPulse 2.2s ease-in-out infinite",
            }}
          >
            TAP TO CONTINUE ✨
          </button>

        </div>
      )}
    </div>
  );
}