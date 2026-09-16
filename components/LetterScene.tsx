// LetterScene.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  name: string;
  note: string;
  senderName: string;
  onComplete?: () => void;
};

export default function LetterScene({
  name,
  note,
  senderName,
  onComplete,
}: Props) {
  const [opened, setOpened] = useState(false);
  const [flowerBurst, setFlowerBurst] = useState(false);
  const [typedText, setTypedText] = useState("");

  const receiverName = name?.trim() || "you";
  const fromName = senderName?.trim() || "Someone special";
  const initial = useMemo(
    () => (receiverName.charAt(0) || "A").toUpperCase(),
    [receiverName]
  );

  const finalNote =
    note?.trim() ||
    "Every beautiful moment with you is worth remembering. ♡";

  useEffect(() => {
    if (!opened) return;

    setTypedText("");

    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setTypedText(finalNote.slice(0, index));

      if (index >= finalNote.length) {
        window.clearInterval(timer);
      }
    }, 32);

    return () => window.clearInterval(timer);
  }, [opened, finalNote]);

  return (
    <div className="letter-scene">
      <div className="letter-stars" aria-hidden="true">
        <span>✦</span>
        <span>·</span>
        <span>♡</span>
        <span>✧</span>
        <span>·</span>
        <span>✦</span>
        <span>·</span>
        <span>♡</span>
        <span>✧</span>
        <span>·</span>
        <span>✦</span>
        <span>·</span>
        <span>♡</span>
        <span>✧</span>
        <span>·</span>
      </div>

      <div className="letter-content">
        {!opened ? (
          <>
            <div className="letter-title">
              One last thing, {receiverName}...
            </div>

            <div className="letter-subtitle">
              {fromName} wrote you a letter.
            </div>

            <button
              type="button"
              className="envelope-button"
              onClick={() => {
                setFlowerBurst(true);

                window.setTimeout(() => {
                  setOpened(true);
                }, 700);
              }}
              aria-label="Open your letter"
            >
              {flowerBurst && (
                <div className="flower-burst" aria-hidden="true">
                  {[
                    "🌸",
                    "🌷",
                    "🌹",
                    "🌺",
                    "🌼",
                    "💐",
                    "🌸",
                    "🌷",
                    "🌹",
                    "🌺",
                    "🌼",
                    "🌸",
                    "🌷",
                    "🌹",
                    "🌺",
                    "🌼",
                  ].map((flower, i) => (
                    <span
                      key={i}
                      className="burst-flower"
                      style={{ "--i": i } as React.CSSProperties}
                    >
                      {flower}
                    </span>
                  ))}
                </div>
              )}

              <div className="envelope">
                <div className="envelope-flap" />
                <div className="envelope-fold left" />
                <div className="envelope-fold right" />
                <div className="envelope-fold bottom" />

                <div className="letter-seal">{initial}</div>
              </div>
            </button>

            <div className="tap-icon">☝</div>
            <div className="tap-text">Tap to open your letter</div>
          </>
        ) : (
          <div className="letter-open-wrap">
            <div className="paper">
              <div className="paper-glow" />

              <div className="paper-top">
                <span>For {receiverName} ♡</span>
              </div>

              <div className="paper-line" />

              <div className="paper-note">
                {typedText}
                {typedText.length < finalNote.length && (
                  <span className="typing-cursor" aria-hidden="true">
                    |
                  </span>
                )}
              </div>

              {typedText.length >= finalNote.length && (
                <div className="paper-sign">
                  — {fromName}
                </div>
              )}
            </div>

            {typedText.length >= finalNote.length && (
              <button
                type="button"
                className="letter-continue"
                onClick={() => onComplete?.()}
              >
                CONTINUE ✨
              </button>
            )}
          </div>
        )}
      </div>

      <style>{`
        .letter-scene {
          position: fixed;
          inset: 0;
          z-index: 2147483647;
          width: 100vw;
          height: 100vh;
          min-height: 100vh;
          overflow: hidden;
          isolation: isolate;
          color: #fff7ed;
          font-family: var(--font-poppins), Arial, sans-serif;
          background:
            radial-gradient(circle at 50% 42%, rgba(132, 83, 125, .30), transparent 30%),
            radial-gradient(circle at 18% 65%, rgba(193, 88, 104, .18), transparent 28%),
            radial-gradient(circle at 82% 28%, rgba(111, 78, 132, .20), transparent 25%),
            linear-gradient(145deg, #160b20 0%, #24102d 46%, #351827 100%);
        }

        .letter-scene::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(circle, rgba(255,255,255,.65) 0 1px, transparent 1.6px),
            radial-gradient(circle, rgba(255,224,190,.35) 0 1.2px, transparent 1.8px);
          background-size: 105px 120px, 165px 150px;
          background-position: 12px 18px, 55px 70px;
          opacity: .55;
          pointer-events: none;
        }

        .letter-content {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 0 18px;
          padding-top: clamp(85px, 15vh, 150px);
          overflow-y: auto;
        }

        .letter-title {
          font-size: clamp(25px, 4.5vw, 40px);
          font-weight: 600;
          letter-spacing: -.03em;
          text-shadow: 0 3px 20px rgba(0,0,0,.28);
          animation: letterFade .9s ease both;
        }

        .letter-subtitle {
          margin-top: 22px;
          color: rgba(255,240,230,.78);
          font-size: clamp(16px, 2.8vw, 22px);
          animation: letterFade 1s .1s ease both;
        }

        /* FLOWER SPLAT */
        .flower-burst {
          position: fixed;
          inset: 0;
          z-index: 100;
          pointer-events: none;
          overflow: hidden;
        }

        .burst-flower {
          --i: 0;
          --dx: 0px;
          --dy: 0px;
          position: absolute;
          left: 50%;
          top: 50%;
          font-size: clamp(20px, 3vw, 31px);
          opacity: 0;
          transform: translate(-50%, -50%) scale(.15) rotate(0deg);
          animation: flowerSplat .75s cubic-bezier(.16,.8,.25,1) forwards;
          animation-delay: calc(var(--i) * 18ms);
          filter: drop-shadow(0 4px 8px rgba(255,160,90,.35));
        }

        .burst-flower:nth-child(1)  { --dx:-230px; --dy:-120px; }
        .burst-flower:nth-child(2)  { --dx:-185px; --dy:-70px; }
        .burst-flower:nth-child(3)  { --dx:-145px; --dy:-145px; }
        .burst-flower:nth-child(4)  { --dx:-85px;  --dy:-175px; }
        .burst-flower:nth-child(5)  { --dx:-35px;  --dy:-115px; }
        .burst-flower:nth-child(6)  { --dx:35px;   --dy:-170px; }
        .burst-flower:nth-child(7)  { --dx:90px;   --dy:-120px; }
        .burst-flower:nth-child(8)  { --dx:145px;  --dy:-165px; }
        .burst-flower:nth-child(9)  { --dx:215px;  --dy:-105px; }
        .burst-flower:nth-child(10) { --dx:225px;  --dy:-35px; }
        .burst-flower:nth-child(11) { --dx:165px;  --dy:45px; }
        .burst-flower:nth-child(12) { --dx:105px;  --dy:75px; }
        .burst-flower:nth-child(13) { --dx:35px;   --dy:95px; }
        .burst-flower:nth-child(14) { --dx:-45px;  --dy:80px; }
        .burst-flower:nth-child(15) { --dx:-125px; --dy:65px; }
        .burst-flower:nth-child(16) { --dx:-205px; --dy:20px; }

        @keyframes flowerSplat {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(.15) rotate(0deg);
          }

          18% {
            opacity: 1;
          }

          100% {
            opacity: 0;
            transform:
              translate(
                calc(-50% + var(--dx)),
                calc(-50% + var(--dy))
              )
              scale(1.08)
              rotate(360deg);
          }
        }

        /* ENVELOPE */
        .envelope-button {
          appearance: none;
          border: 0;
          background: transparent;
          padding: 0;
          margin-top: 48px;
          cursor: pointer;
          width: min(620px, 88vw);
          animation: envelopeIn 1s .15s cubic-bezier(.2,.9,.2,1) both;
        }

        .envelope {
          position: relative;
          width: 100%;
          aspect-ratio: 1.7 / 1;
          background: linear-gradient(145deg, #f7bb4d, #d88c21);
          box-shadow:
            0 24px 55px rgba(0,0,0,.34),
            0 0 28px rgba(255,188,68,.13);
          overflow: hidden;
        }

        .envelope-button:active .envelope-flap {
          transform: rotateX(70deg);
        }

        .envelope-flap {
          position: absolute;
          inset: 0 0 auto 0;
          height: 55%;
          background: linear-gradient(145deg, #ffc95d, #eaa22e);
          clip-path: polygon(0 0, 100% 0, 50% 100%);
          z-index: 4;
          transform-origin: top center;
          transition: transform .8s cubic-bezier(.2,.8,.2,1);
        }

        .envelope-fold {
          position: absolute;
          z-index: 2;
        }

        .envelope-fold.left {
          inset: 0 auto 0 0;
          width: 50%;
          clip-path: polygon(0 0, 100% 50%, 0 100%);
          background: rgba(255,213,112,.35);
        }

        .envelope-fold.right {
          inset: 0 0 0 auto;
          width: 50%;
          clip-path: polygon(100% 0, 0 50%, 100% 100%);
          background: rgba(190,105,24,.24);
        }

        .envelope-fold.bottom {
          left: 0;
          right: 0;
          bottom: 0;
          height: 54%;
          clip-path: polygon(0 100%, 50% 0, 100% 100%);
          background: rgba(193,108,23,.24);
          z-index: 3;
        }

        .letter-seal {
          position: absolute;
          z-index: 8;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 92px;
          height: 92px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: #fff8e8;
          font-size: 38px;
          font-family: Georgia, serif;
          background: radial-gradient(circle at 35% 25%, #ffd982, #efa72d 60%, #d48618);
          border: 3px solid rgba(255,245,211,.9);
          box-shadow:
            0 5px 18px rgba(105,52,0,.35),
            0 0 22px rgba(255,202,91,.42);
        }

        .envelope-button:hover .letter-seal,
        .envelope-button:focus-visible .letter-seal {
          transform: translate(-50%, -50%) scale(1.05);
        }

        .tap-icon {
          margin-top: 38px;
          color: #ffbd1e;
          font-size: 42px;
          animation: handBounce 1.4s ease-in-out infinite;
          filter: drop-shadow(0 4px 12px rgba(255,183,35,.25));
        }

        .tap-text {
          margin-top: 12px;
          color: rgba(255,247,238,.88);
          font-size: clamp(18px, 3vw, 25px);
          font-weight: 700;
          letter-spacing: -.02em;
        }

        /* OPEN LETTER */
        .letter-open-wrap {
          width: min(700px, 92vw);
          margin-top: 25px;
          animation: paperIn .75s cubic-bezier(.2,.9,.2,1) both;
          padding-bottom: 35px;
        }

        .paper {
          position: relative;
          min-height: min(560px, 68vh);
          padding: 35px 38px 42px;
          text-align: left;
          color: #4c3025;
          background:
            linear-gradient(rgba(255,255,255,.92), rgba(255,246,228,.96)),
            #fff5df;
          border: 2px solid rgba(220,179,102,.72);
          border-radius: 8px 8px 28px 28px;
          box-shadow:
            0 24px 60px rgba(0,0,0,.38),
            0 0 28px rgba(255,196,82,.12);
          transform: rotate(-.25deg);
          overflow: hidden;
        }

        .paper::before {
          content: "";
          position: absolute;
          inset: 0;
          opacity: .18;
          background: repeating-linear-gradient(
            0deg,
            transparent 0 31px,
            rgba(120,80,50,.16) 32px
          );
          pointer-events: none;
        }

        .paper-glow {
          position: absolute;
          width: 240px;
          height: 240px;
          right: -90px;
          top: -90px;
          border-radius: 50%;
          background: rgba(255,196,82,.18);
          filter: blur(35px);
          pointer-events: none;
        }

        .paper-top {
          position: relative;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          font-family: Georgia, serif;
          font-size: clamp(16px, 2.5vw, 20px);
          font-style: italic;
          font-weight: 600;
        }

        .paper-line {
          position: relative;
          height: 2px;
          margin-top: 18px;
          background: linear-gradient(
            90deg,
            rgba(177,117,60,.65),
            rgba(177,117,60,.18)
          );
        }

        .paper-note {
          position: relative;
          margin-top: 34px;
          min-height: 330px;
          white-space: pre-wrap;
          font-family: "Comic Sans MS", "Segoe Print", cursive;
          font-size: clamp(18px, 2.8vw, 25px);
          line-height: 1.75;
          letter-spacing: .01em;
        }

        .typing-cursor {
          display: inline-block;
          margin-left: 2px;
          color: #b4773e;
          font-weight: 400;
          animation: cursorBlink .7s steps(1) infinite;
        }

        .paper-sign {
          position: relative;
          margin-top: 24px;
          text-align: right;
          font-family: var(--font-script), cursive;
          font-size: 31px;
          font-weight: 600;
          color: #a76649;
          animation: signIn .6s ease both;
        }

        .letter-continue {
          margin-top: 22px;
          border: 1px solid rgba(255,190,120,.65);
          border-radius: 999px;
          padding: 12px 26px;
          background: rgba(28,13,27,.9);
          color: #fff7ed;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .14em;
          cursor: pointer;
          box-shadow: 0 0 22px rgba(255,160,90,.14);
          animation: buttonIn .6s ease both;
        }

        .letter-continue:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 30px rgba(255,160,90,.24);
        }

        @keyframes letterFade {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes envelopeIn {
          from {
            opacity: 0;
            transform: translateY(30px) scale(.92);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes paperIn {
          from {
            opacity: 0;
            transform: translateY(35px) scale(.9) rotate(-2deg);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1) rotate(-.25deg);
          }
        }

        @keyframes handBounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-9px);
          }
        }

        @keyframes cursorBlink {
          0%, 45% {
            opacity: 1;
          }
          46%, 100% {
            opacity: 0;
          }
        }

        @keyframes signIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes buttonIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .letter-stars span {
          position: absolute;
          z-index: 1;
          color: rgba(255,224,190,.58);
          font-size: 14px;
          animation: starFloat 4s ease-in-out infinite;
        }

        .letter-stars span:nth-child(1){left:8%;top:22%}
        .letter-stars span:nth-child(2){left:18%;top:42%;font-size:9px}
        .letter-stars span:nth-child(3){left:28%;top:17%;font-size:13px}
        .letter-stars span:nth-child(4){left:43%;top:30%;font-size:10px}
        .letter-stars span:nth-child(5){left:54%;top:18%;font-size:8px}
        .letter-stars span:nth-child(6){left:68%;top:27%}
        .letter-stars span:nth-child(7){left:78%;top:45%;font-size:9px}
        .letter-stars span:nth-child(8){left:88%;top:20%;font-size:13px}
        .letter-stars span:nth-child(9){left:11%;top:70%;font-size:11px}
        .letter-stars span:nth-child(10){left:30%;top:75%;font-size:8px}
        .letter-stars span:nth-child(11){left:72%;top:70%}
        .letter-stars span:nth-child(12){left:92%;top:62%;font-size:9px}
        .letter-stars span:nth-child(13){left:48%;top:78%;font-size:10px}
        .letter-stars span:nth-child(14){left:61%;top:61%;font-size:12px}
        .letter-stars span:nth-child(15){left:84%;top:80%;font-size:8px}

        @keyframes starFloat {
          0%,100% {
            opacity:.25;
            transform:translateY(7px) scale(.8);
          }
          50% {
            opacity:.85;
            transform:translateY(-7px) scale(1.1);
          }
        }

        @media (max-width: 700px) {
          .letter-content {
            padding-top: 70px;
          }

          .letter-title {
            font-size: 27px;
          }

          .letter-subtitle {
            margin-top: 14px;
            font-size: 16px;
          }

          .envelope-button {
            margin-top: 35px;
            width: 88vw;
          }

          .letter-seal {
            width: 76px;
            height: 76px;
            font-size: 31px;
          }

          .tap-icon {
            margin-top: 25px;
            font-size: 35px;
          }

          .tap-text {
            font-size: 18px;
          }

          .letter-open-wrap {
            width: 92vw;
            margin-top: 18px;
          }

          .paper {
            min-height: 560px;
            padding: 27px 22px 34px;
            border-radius: 8px 8px 24px 24px;
          }

          .paper-note {
            margin-top: 27px;
            min-height: 390px;
            font-size: 19px;
            line-height: 1.68;
          }

          .paper-sign {
            font-size: 27px;
          }
        }
      `}</style>
    </div>
  );
}



