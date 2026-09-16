// FinalSurpriseScene.tsx
"use client";

import { useEffect, useState } from "react";

type Props = {
  name: string;
  senderName: string;
  age: string;
  birthday: string;
};

export default function FinalSurpriseScene({
  name,
  senderName,
  age,
  birthday,
}: Props) {
  const [show, setShow] = useState(false);
  const [hearts, setHearts] = useState<number[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => setShow(true), 250);
    setHearts(Array.from({ length: 22 }, (_, i) => i));
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="final-scene">
      <div className="final-stars" aria-hidden="true">
        {Array.from({ length: 34 }, (_, i) => (
          <span key={i} style={{ "--i": i } as React.CSSProperties}>
            {i % 5 === 0 ? "✦" : "·"}
          </span>
        ))}
      </div>

      <div className="floating-hearts" aria-hidden="true">
        {hearts.map((i) => (
          <span key={i} style={{ "--i": i } as React.CSSProperties}>
            {i % 3 === 0 ? "♡" : "♥"}
          </span>
        ))}
      </div>

      <main className={`final-content ${show ? "visible" : ""}`}>
        <div className="final-badge">A LITTLE SURPRISE, MADE WITH LOVE</div>

        <div className="cake-icon" aria-hidden="true">
          🎂
        </div>

        <p className="final-eyebrow">and one last thing...</p>

        <h1>
          Happy Birthday,
          <br />
          <span>{name || "Beautiful"}</span>
        </h1>

        <div className="gold-line">
          <i />
          <span>♡</span>
          <i />
        </div>

        <p className="final-message">
          I hope this little journey made you smile,
          <br className="desktop-break" />
          because you deserve every beautiful moment today.
        </p>

        <div className="final-card">
          <div className="final-card-top">
            <span>YOUR SPECIAL DAY</span>
            <span>✨</span>
          </div>

          <div className="final-details">
            <div>
              <strong>{age || "∞"}</strong>
              <span>years of you</span>
            </div>

            <div>
              <strong>∞</strong>
              <span>moments to come</span>
            </div>

            <div>
              <strong>♥</strong>
              <span>loved always</span>
            </div>
          </div>

          {birthday && <div className="birthday-date">{birthday}</div>}
        </div>

        <p className="final-quote">
          “Some people make ordinary moments feel unforgettable.”
        </p>

        <div className="signature">
          <span>With all my love,</span>
          <strong>{senderName || "Someone special"}</strong>
        </div>

        <div className="final-footer">
          <span>Made especially for {name || "you"}</span>
          <span>♥</span>
        </div>
      </main>

      <style>{`
        .final-scene {
          position: fixed;
          inset: 0;
          z-index: 2147483647;
          width: 100vw;
          height: 100vh;
          min-height: 100vh;
          overflow-y: auto;
          overflow-x: hidden;
          isolation: isolate;
          color: #fff8f0;
          font-family: var(--font-poppins), Arial, sans-serif;
          background:
            radial-gradient(circle at 50% 35%, rgba(164, 69, 108, .22), transparent 42%),
            linear-gradient(145deg, #100818 0%, #1b0b21 50%, #24101d 100%);
        }

        .final-scene::before {
          content: "";
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, .08);
          pointer-events: none;
        }

        .final-stars {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .final-stars span {
          --i: 0;
          position: absolute;
          left: calc((var(--i) * 29px) % 100vw);
          top: calc((var(--i) * 47px) % 100vh);
          color: rgba(255, 222, 170, .58);
          font-size: calc(7px + (var(--i) % 4) * 3px);
          animation: starPulse 3s ease-in-out infinite;
          animation-delay: calc(var(--i) * -130ms);
        }

        .floating-hearts {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .floating-hearts span {
          --i: 0;
          position: absolute;
          left: calc((var(--i) * 41px) % 100vw);
          bottom: -40px;
          color: rgba(255, 113, 153, .42);
          font-size: calc(13px + (var(--i) % 4) * 5px);
          animation: heartRise calc(7s + (var(--i) % 5) * 1s) linear infinite;
          animation-delay: calc(var(--i) * -420ms);
        }

        .final-content {
          position: relative;
          z-index: 5;
          width: min(720px, 92vw);
          min-height: 100%;
          margin: 0 auto;
          padding: clamp(58px, 9vh, 100px) 0 45px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          opacity: 0;
          transform: translateY(22px);
          transition: opacity .9s ease, transform .9s ease;
        }

        .final-content.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .final-badge {
          padding: 9px 18px;
          border: 1px solid rgba(255, 194, 122, .35);
          border-radius: 999px;
          background: rgba(255, 188, 105, .08);
          color: rgba(255, 219, 180, .72);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: .22em;
        }

        .cake-icon {
          margin-top: 30px;
          font-size: 52px;
          filter: drop-shadow(0 0 18px rgba(255, 183, 91, .34));
          animation: cakeFloat 3s ease-in-out infinite;
        }

        .final-eyebrow {
          margin: 22px 0 0;
          color: rgba(255, 215, 191, .72);
          font-family: Georgia, serif;
          font-size: 16px;
          font-style: italic;
        }

        h1 {
          margin: 10px 0 0;
          font-family: var(--font-playfair), Georgia, serif;
          font-size: clamp(44px, 8vw, 76px);
          line-height: .98;
          font-weight: 600;
          letter-spacing: -.045em;
          text-shadow: 0 8px 35px rgba(0,0,0,.32);
        }

        h1 span {
          color: #ffb0c6;
          font-family: var(--font-script), cursive;
          font-size: 1.04em;
          font-weight: 400;
          letter-spacing: 0;
        }

        .gold-line {
          display: flex;
          align-items: center;
          gap: 14px;
          width: min(310px, 65vw);
          margin-top: 24px;
          color: #f7c878;
        }

        .gold-line i {
          height: 1px;
          flex: 1;
          background: linear-gradient(90deg, transparent, rgba(247, 200, 120, .65));
        }

        .gold-line i:last-child {
          background: linear-gradient(90deg, rgba(247, 200, 120, .65), transparent);
        }

        .gold-line span {
          font-size: 15px;
          text-shadow: 0 0 15px rgba(247, 200, 120, .55);
        }

        .final-message {
          margin: 24px 0 0;
          color: rgba(255, 244, 234, .76);
          font-size: clamp(14px, 2.2vw, 18px);
          line-height: 1.8;
        }

        .final-card {
          width: min(560px, 88vw);
          margin-top: 34px;
          padding: 22px 24px 20px;
          border: 1px solid rgba(255, 205, 137, .24);
          border-radius: 24px;
          background: rgba(255, 242, 227, .055);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.06),
            0 20px 60px rgba(0,0,0,.20);
          backdrop-filter: blur(12px);
        }

        .final-card-top {
          display: flex;
          justify-content: space-between;
          color: rgba(255, 216, 169, .65);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: .2em;
        }

        .final-details {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          margin-top: 18px;
        }

        .final-details div {
          display: flex;
          flex-direction: column;
          gap: 3px;
          padding: 0 10px;
          border-right: 1px solid rgba(255,255,255,.08);
        }

        .final-details div:last-child {
          border-right: 0;
        }

        .final-details strong {
          color: #ffd28b;
          font-family: var(--font-playfair), Georgia, serif;
          font-size: 27px;
          font-weight: 600;
        }

        .final-details span {
          color: rgba(255, 241, 229, .58);
          font-size: 9px;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .birthday-date {
          margin-top: 18px;
          color: rgba(255, 202, 157, .75);
          font-family: Georgia, serif;
          font-size: 13px;
          font-style: italic;
        }

        .final-quote {
          max-width: 530px;
          margin: 34px 0 0;
          color: rgba(255, 231, 218, .66);
          font-family: Georgia, serif;
          font-size: 16px;
          font-style: italic;
          line-height: 1.7;
        }

        .signature {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 26px;
        }

        .signature span {
          color: rgba(255, 226, 207, .58);
          font-family: Georgia, serif;
          font-size: 13px;
          font-style: italic;
        }

        .signature strong {
          margin-top: 2px;
          color: #ffafc5;
          font-family: var(--font-script), cursive;
          font-size: 32px;
          font-weight: 400;
        }

        .final-footer {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-top: 34px;
          color: rgba(255, 220, 198, .38);
          font-size: 9px;
          letter-spacing: .13em;
          text-transform: uppercase;
        }

        .final-footer span:last-child {
          color: #ff8eae;
          font-size: 13px;
        }

        @keyframes starPulse {
          0%, 100% { opacity: .18; transform: scale(.8); }
          50% { opacity: .9; transform: scale(1.18); }
        }

        @keyframes heartRise {
          0% {
            opacity: 0;
            transform: translate3d(0, 0, 0) rotate(-8deg) scale(.7);
          }
          12% { opacity: .65; }
          100% {
            opacity: 0;
            transform: translate3d(calc((var(--i) % 7 - 3) * 28px), -110vh, 0)
              rotate(24deg) scale(1.15);
          }
        }

        @keyframes cakeFloat {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }

        @media (max-width: 600px) {
          .final-content {
            padding-top: 48px;
            padding-bottom: 34px;
          }

          .final-badge {
            font-size: 8px;
            letter-spacing: .16em;
          }

          .cake-icon {
            margin-top: 24px;
            font-size: 45px;
          }

          .final-eyebrow {
            margin-top: 17px;
            font-size: 14px;
          }

          h1 {
            font-size: 45px;
          }

          .final-message {
            font-size: 14px;
            line-height: 1.7;
          }

          .final-card {
            margin-top: 27px;
            padding: 18px 12px;
          }

          .final-details strong {
            font-size: 23px;
          }

          .final-details span {
            font-size: 8px;
          }

          .final-quote {
            margin-top: 27px;
            padding: 0 12px;
            font-size: 14px;
          }

          .desktop-break {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
