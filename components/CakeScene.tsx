import { useEffect, useRef, useState } from "react";

type Props = {
  cake: string;
  name: string;
  age: string;
  onComplete?: () => void;
};

type CakeKey = "strawberry" | "chocolate" | "vanilla";

const cakeInfo: Record<
  CakeKey,
  {
    title: string;
    bg1: string;
    bg2: string;
    main: string;
    light: string;
    cream: string;
    topping: string;
  }
> = {
  strawberry: {
    title: "Strawberry Blush",
    bg1: "#641c3b",
    bg2: "#160a12",
    main: "#e96b91",
    light: "#ffd5e2",
    cream: "#fff4f7",
    topping: "#ff9fbd",
  },
  chocolate: {
    title: "Midnight Chocolate",
    bg1: "#3a1d16",
    bg2: "#10090a",
    main: "#6f3d31",
    light: "#f0c7a8",
    cream: "#fff0df",
    topping: "#a9674d",
  },
  vanilla: {
    title: "Vanilla Gold",
    bg1: "#67501f",
    bg2: "#171007",
    main: "#f1d18a",
    light: "#fff5cf",
    cream: "#fff9e8",
    topping: "#e8b941",
  },
};

function Firework({
  left,
  delay,
  color,
}: {
  left: string;
  delay: number;
  color: string;
}) {
  return (
    <div
      className="firework"
      style={
        {
          left,
          "--fire-color": color,
          "--fw-delay": `${delay}s`,
          animationDelay: `${delay}s`,
        } as React.CSSProperties
      }
    >
      <span className="rocket" />
      <span className="burst">
        {Array.from({ length: 12 }).map((_, i) => (
          <i key={i} style={{ "--ray": `${i * 30}deg` } as React.CSSProperties} />
        ))}
      </span>
    </div>
  );
}

function AgeNumberCandles({ age }: { age: string }) {
  const digits = age.trim().replace(/\D/g, "").slice(0, 3).split("");

  return (
    <div className={`age-number-candles digits-${Math.max(1, Math.min(digits.length, 3))}`}>
      {(digits.length ? digits : ["?"]).map((digit, index) => (
        <div className="number-candle" key={`${digit}-${index}`}>
          <span className="number-wick" />
          <span className="number-flame" />
          <span className="number-value">{digit}</span>
        </div>
      ))}
    </div>
  );
}

function StrawberryCake({ age }: { age: string }) {
  return (
    <div className="cake-art cake-strawberry">
      <AgeNumberCandles age={age} />
      <div className="cake-tier strawberry-tier-top">
        <div className="icing icing-pink" />
        <span className="strawberry-fruit sf1">🍓</span>
        <span className="strawberry-fruit sf2">🍓</span>
        <span className="strawberry-fruit sf3">🍓</span>
        <span className="cream-swirl cs1" />
        <span className="cream-swirl cs2" />
      </div>
      <div className="cake-tier strawberry-tier-mid">
        <div className="cream-drip-modern" />
        <span className="berry-dot bd1" /><span className="berry-dot bd2" />
        <span className="berry-dot bd3" /><span className="berry-dot bd4" />
        <div className="pink-ribbon" />
      </div>
      <div className="cake-tier strawberry-tier-bottom">
        <div className="cream-drip-modern lower" />
        <span className="berry-dot bd5" /><span className="berry-dot bd6" />
        <span className="berry-dot bd7" /><span className="berry-dot bd8" />
      </div>
      <div className="cake-plate" />
    </div>
  );
}

function ChocolateCake({ age }: { age: string }) {
  return (
    <div className="cake-art cake-chocolate">
      <AgeNumberCandles age={age} />
      <div className="cake-tier chocolate-tier-top">
        <div className="dark-drip" />
        <div className="chocolate-crown">✦</div>
        <span className="truffle t1" /><span className="truffle t2" />
        <span className="truffle t3" /><span className="truffle t4" />
      </div>
      <div className="cake-tier chocolate-tier-mid">
        <div className="gold-ribbon" />
        <span className="chocolate-shard sh1" /><span className="chocolate-shard sh2" />
        <span className="chocolate-shard sh3" /><span className="chocolate-shard sh4" />
        <div className="chocolate-drip-line" />
      </div>
      <div className="cake-tier chocolate-tier-bottom">
        <div className="gold-ribbon bottom" />
        <div className="dark-drip bottom-drip" />
      </div>
      <div className="cake-plate" />
    </div>
  );
}

function VanillaCake({ age }: { age: string }) {
  return (
    <div className="cake-art cake-vanilla">
      <AgeNumberCandles age={age} />
      <div className="cake-tier vanilla-tier-top">
        <div className="gold-drip" />
        <span className="gold-rose gr1">✿</span><span className="gold-rose gr2">✿</span>
        <span className="pearl-big pb1" /><span className="pearl-big pb2" />
        <div className="vanilla-swirl">❦</div>
      </div>
      <div className="cake-tier vanilla-tier-mid">
        <div className="gold-band" />
        <span className="pearl pv1" /><span className="pearl pv2" />
        <span className="pearl pv3" /><span className="pearl pv4" />
        <span className="pearl pv5" /><span className="pearl pv6" />
      </div>
      <div className="cake-tier vanilla-tier-bottom">
        <div className="gold-drip lower" />
        <div className="gold-band bottom" />
        <span className="gold-dot gd1" /><span className="gold-dot gd2" />
        <span className="gold-dot gd3" /><span className="gold-dot gd4" />
      </div>
      <div className="cake-plate" />
    </div>
  );
}

export default function CakeScene({ cake, name, age, onComplete }: Props) {
  const [mounted, setMounted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioRef = useRef<AudioContext | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setMounted(true);

    return () => {
      setMounted(false);

      // Stop the Happy Birthday song when this Cake Scene closes.
      if (musicRef.current) {
        musicRef.current.pause();
        musicRef.current.currentTime = 0;
      }

      // Close the Web Audio context used for the small boom effects.
      if (audioRef.current) {
        void audioRef.current.close();
        audioRef.current = null;
      }
    };
  }, []);

  const selected = (cakeInfo[cake as CakeKey] ? cake : "strawberry") as CakeKey;
  const c = cakeInfo[selected];

  const boomSound = () => {
    try {
      const AC =
        window.AudioContext ||
        (window as typeof window & {
          webkitAudioContext?: typeof AudioContext;
        }).webkitAudioContext;

      if (!AC) return;

      if (!audioRef.current) audioRef.current = new AC();

      const ctx = audioRef.current;
      if (ctx.state === "suspended") void ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(210, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(48, ctx.currentTime + 0.22);

      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.28, ctx.currentTime + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.24);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {}
  };

  const startAudio = () => {
    // Start the Happy Birthday song without showing a music button.
    const music = musicRef.current;
    if (music) {
      void music.play().catch(() => {
        // Browser autoplay may be blocked until the user interacts once.
      });
    }

    // Enable the small boom effect without showing a boom button.
    try {
      const AC =
        window.AudioContext ||
        (window as typeof window & {
          webkitAudioContext?: typeof AudioContext;
        }).webkitAudioContext;

      if (AC) {
        if (!audioRef.current) audioRef.current = new AC();
        void audioRef.current.resume();
      }
    } catch {}

    setSoundEnabled(true);
    window.setTimeout(boomSound, 80);
  };

  useEffect(() => {
    // Try immediately. If the browser blocks autoplay, the first tap/click
    // anywhere on the Cake Scene starts both music and boom sound.
    startAudio();

    const unlock = () => {
      startAudio();
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };

    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  useEffect(() => {
    if (!soundEnabled) return;

    // Match the five small fireworks that rise from the bottom.
    const intervals: number[] = [];
    const timeouts: number[] = [];

    intervals.push(window.setInterval(boomSound, 3600));

    for (const offset of [900, 1800, 2700, 1450]) {
      timeouts.push(
        window.setTimeout(() => {
          intervals.push(window.setInterval(boomSound, 3600));
        }, offset)
      );
    }

    return () => {
      intervals.forEach((id) => window.clearInterval(id));
      timeouts.forEach((id) => window.clearTimeout(id));
    };
  }, [soundEnabled]);

  return (
    <div
      className="cake-scene"
      style={
        {
          "--bg1": c.bg1,
          "--bg2": c.bg2,
          "--accent": c.main,
          "--light": c.light,
          "--cream": c.cream,
          "--topping": c.topping,
        } as React.CSSProperties
      }
    >
      <audio
        ref={musicRef}
        src="/music/happy-birthday.mp3"
        loop
        preload="auto"
      />

      {/* ✨ Romantic background decorations */}
      <div className="cake-decorations" aria-hidden="true">
        <div className="cake-halo" />

        <div className="floating-sparkles">
          <span>✦</span><span>✧</span><span>✦</span><span>✧</span>
          <span>✦</span><span>✧</span><span>✦</span><span>✧</span>
          <span>✦</span><span>✧</span><span>✦</span><span>✧</span>
        </div>

        <div className="floating-hearts">
          <span>♥</span><span>♡</span><span>♥</span><span>♡</span>
          <span>♥</span><span>♡</span><span>♥</span><span>♡</span>
        </div>

        <div className="cake-floor-glow" />
      </div>

      <style>{`
        .cake-scene {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 2147483647;
          overflow: hidden;
          width: 100vw;
          height: 100vh;
          min-height: 100vh;
          isolation: isolate;
          background:
            radial-gradient(circle at 50% 42%, color-mix(in srgb, var(--accent) 33%, transparent) 0%, transparent 34%),
            radial-gradient(circle at 15% 22%, color-mix(in srgb, var(--light) 13%, transparent) 0%, transparent 25%),
            radial-gradient(circle at 85% 24%, color-mix(in srgb, var(--accent) 13%, transparent) 0%, transparent 25%),
            linear-gradient(180deg, var(--bg1), var(--bg2));
          color: #fff;
          font-family: Georgia, serif;
        }

        .cake-scene::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(circle, rgba(255,255,255,.45) 0 1px, transparent 1.5px),
            radial-gradient(circle, rgba(255,220,180,.3) 0 1px, transparent 1.5px);
          background-size: 90px 110px, 150px 140px;
          opacity: .28;
          pointer-events: none;
        }

        .cake-message {
          position: absolute;
          top: 5%;
          left: 15px;
          right: 15px;
          text-align: center;
          z-index: 30;
          animation: messageIn 1s ease-out both;
        }

        .cake-message .small {
          color: var(--cream);
          font-size: 16px;
          font-style: italic;
          letter-spacing: .12em;
        }

        .cake-message h1 {
          margin: 8px 0 0;
          font-size: clamp(34px, 5vw, 58px);
          color: #fffaf6;
          text-shadow: 0 0 30px var(--accent);
        }

        .cake-message .name {
          margin-top: 3px;
          font-family: var(--font-script), cursive;
          font-size: clamp(30px, 4vw, 48px);
          color: var(--accent);
        }

        .cake-stage {
          position: absolute;
          left: 50%;
          bottom: 8%;
          width: 460px;
          height: 510px;
          transform: translateX(-50%);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          z-index: 20;
        }

        .cake-art {
          position: relative;
          width: 300px;
          height: 330px;
          z-index: 10;
          animation: cakeDrop 1.6s cubic-bezier(.22,1,.36,1) .15s both;
          filter: drop-shadow(0 18px 25px rgba(0,0,0,.42));
        }

        .tier {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 18px 18px 12px 12px;
          box-shadow:
            inset 0 5px 8px rgba(255,255,255,.16),
            inset 0 -9px 12px rgba(0,0,0,.15);
        }

        /* STRAWBERRY */
        .strawberry-top {
          top: 78px;
          width: 210px;
          height: 85px;
          background: #fff1f6;
        }

        .strawberry-mid {
          top: 145px;
          width: 255px;
          height: 82px;
          background: #e96b91;
        }

        .strawberry-bottom {
          top: 211px;
          width: 285px;
          height: 75px;
          background: #bd466e;
        }

        .cream-drip {
          position: absolute;
          top: -3px;
          left: 0;
          right: 0;
          height: 34px;
          background: #fff4f7;
          border-radius: 18px;
          clip-path: polygon(0 0,100% 0,100% 58%,94% 58%,91% 100%,85% 100%,82% 55%,73% 55%,69% 86%,63% 86%,60% 55%,49% 55%,46% 96%,40% 96%,37% 56%,27% 56%,24% 80%,18% 80%,15% 55%,0 55%);
        }

        .cream-drip.lower { height: 25px; opacity: .85; }

        .cream-line {
          position: absolute;
          left: 14px;
          right: 14px;
          top: 28px;
          height: 7px;
          border-radius: 99px;
          background: #fff4f7;
        }

        .cream-line.second { top: 53px; opacity: .55; }

        .berry {
          position: absolute;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #ff9fbd;
          box-shadow: inset -4px -4px 6px rgba(0,0,0,.12);
        }

        .b1 { left: 30px; top: -15px; }
        .b2 { right: 35px; top: -16px; }
        .b3 { left: 92px; top: -19px; width: 28px; height: 28px; }
        .b4 { left: 150px; top: -10px; width: 18px; height: 18px; }

        .dot {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #fff4f7;
        }

        .d1 { left: 35px; top: 18px; }
        .d2 { left: 120px; top: 42px; }
        .d3 { right: 42px; top: 25px; }

        /* CHOCOLATE */
        .chocolate-top {
          top: 76px;
          width: 235px;
          height: 78px;
          background: #efc8a8;
        }

        .chocolate-mid {
          top: 139px;
          width: 265px;
          height: 88px;
          background: #6f3d31;
        }

        .chocolate-bottom {
          top: 211px;
          width: 292px;
          height: 78px;
          background: #48261f;
        }

        .choco-drip {
          position: absolute;
          inset: 0;
          background: #5b3027;
          border-radius: 18px;
          clip-path: polygon(0 0,100% 0,100% 55%,94% 55%,91% 90%,86% 90%,83% 55%,72% 55%,68% 78%,63% 78%,60% 55%,48% 55%,45% 94%,39% 94%,36% 55%,25% 55%,22% 82%,16% 82%,13% 55%,0 55%);
        }

        .gold-ring {
          position: absolute;
          left: 22px;
          right: 22px;
          top: 13px;
          height: 7px;
          border-radius: 99px;
          background: #e3b53e;
          z-index: 2;
        }

        .gold-line {
          position: absolute;
          left: 16px;
          right: 16px;
          top: 31px;
          height: 7px;
          border-radius: 99px;
          background: #dcae37;
        }

        .gold-line.low { top: 58px; opacity: .55; }

        .choco-berry {
          position: absolute;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #9d3047;
          z-index: 3;
        }

        .cb1 { left: 38px; top: -13px; }
        .cb2 { left: 104px; top: -19px; width: 32px; height: 32px; }
        .cb3 { right: 35px; top: -11px; }

        .choco-piece {
          position: absolute;
          width: 20px;
          height: 24px;
          background: #3a1d16;
          border-radius: 3px;
          top: 10px;
          transform: rotate(8deg);
        }

        .s1 { left: 40px; }
        .s2 { left: 125px; top: 43px; }
        .s3 { right: 45px; top: 18px; }

        /* VANILLA */
        .vanilla-top {
          top: 78px;
          width: 230px;
          height: 80px;
          background: #fff9e8;
        }

        .vanilla-mid {
          top: 143px;
          width: 270px;
          height: 86px;
          background: #f1d18a;
        }

        .vanilla-bottom {
          top: 211px;
          width: 294px;
          height: 77px;
          background: #cfa94f;
        }

        .gold-swirl {
          position: absolute;
          left: 50%;
          top: 22px;
          width: 100px;
          height: 30px;
          transform: translateX(-50%);
          border: 5px solid #e0ae34;
          border-left-color: transparent;
          border-right-color: transparent;
          border-radius: 50%;
        }

        .gold-ball {
          position: absolute;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #e4b43e;
        }

        .v1 { left: 34px; top: -8px; }
        .v2 { left: 100px; top: -14px; width: 22px; height: 22px; }
        .v3 { right: 34px; top: -7px; }
        .v4 { left: 154px; top: 5px; width: 12px; height: 12px; }

        .pearl {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #fff5d4;
        }

        .p1 { left: 37px; top: 13px; }
        .p2 { left: 93px; top: 47px; }
        .p3 { right: 53px; top: 20px; }
        .p4 { right: 105px; top: 52px; }

        .cream-band {
          position: absolute;
          left: 18px;
          right: 18px;
          top: 28px;
          height: 9px;
          border-radius: 99px;
          background: #fff5d4;
        }

        /* =========================================
           NEW PREMIUM CAKE DESIGNS
           ========================================= */
        .cake-art { width: 340px; height: 325px; }
        .cake-tier {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 24px 24px 14px 14px;
          box-shadow: inset 0 7px 10px rgba(255,255,255,.18), inset 0 -12px 18px rgba(0,0,0,.18), 0 10px 20px rgba(0,0,0,.12);
          overflow: visible;
        }
        /* Plate stays directly UNDER the cake */
        .cake-plate {
          position: absolute;
          left: 50%;
          top: 291px;
          bottom: auto;
          transform: translateX(-50%);
          width: 338px;
          height: 28px;
          border-radius: 50%;
          background:
            linear-gradient(180deg, rgba(255,255,255,.96), rgba(255,255,255,.20));
          border: 1px solid rgba(255,245,225,.55);
          box-shadow:
            0 7px 22px rgba(0,0,0,.42),
            0 0 25px var(--accent);
          z-index: 2;
        }

        /* Strawberry Blush — pink ombre, cream swirls and strawberries */
        .cake-strawberry .strawberry-tier-top { top:74px; width:220px; height:88px; background:linear-gradient(180deg,#fff9fb,#ffdbe7); }
        .cake-strawberry .strawberry-tier-mid { top:139px; width:270px; height:92px; background:linear-gradient(180deg,#f48aaa,#d94e79); }
        .cake-strawberry .strawberry-tier-bottom { top:210px; width:310px; height:82px; background:linear-gradient(180deg,#d94e79,#a92f5d); }
        .icing-pink { position:absolute; left:0; right:0; top:-6px; height:38px; border-radius:22px 22px 12px 12px; background:#fff8fb; clip-path:polygon(0 0,100% 0,100% 58%,94% 58%,91% 100%,85% 100%,81% 58%,72% 58%,68% 86%,62% 86%,58% 58%,48% 58%,45% 96%,39% 96%,36% 58%,26% 58%,22% 82%,16% 82%,13% 58%,0 58%); }
        .strawberry-fruit { position:absolute; font-size:24px; filter:drop-shadow(0 4px 5px rgba(100,0,30,.25)); }        .sf1{left:24px;top:-25px}.sf2{left:96px;top:-31px;font-size:29px;animation-delay:.5s}.sf3{right:25px;top:-24px;animation-delay:1s}
        .cream-swirl { position:absolute; width:42px;height:14px;border-top:5px solid #fff;border-radius:50%; top:42px; opacity:.9; }
        .cs1{left:38px}.cs2{right:38px}
        .cream-drip-modern { position:absolute; inset:0 0 auto; height:28px; background:#fff6fa; border-radius:24px 24px 8px 8px; clip-path:polygon(0 0,100% 0,100% 65%,91% 65%,88% 100%,81% 100%,78% 64%,68% 64%,64% 92%,57% 92%,53% 64%,43% 64%,39% 100%,32% 100%,28% 64%,18% 64%,14% 91%,8% 91%,5% 64%,0 64%); }
        .cream-drip-modern.lower{opacity:.8}
        .pink-ribbon{position:absolute;left:16px;right:16px;top:52px;height:7px;border-radius:99px;background:#ffd9e6;box-shadow:0 0 8px #fff}
        .berry-dot{position:absolute;width:13px;height:13px;border-radius:50%;background:#ffb2c8;box-shadow:0 2px 5px #8b2446}.bd1{left:34px;top:42px}.bd2{left:92px;top:65px}.bd3{right:50px;top:38px}.bd4{right:26px;top:62px}.bd5{left:42px;top:44px}.bd6{left:112px;top:62px}.bd7{right:78px;top:42px}.bd8{right:34px;top:59px}

        /* Midnight Chocolate — rich ganache, gold trim, truffles and shards */
        .cake-chocolate .chocolate-tier-top{top:72px;width:230px;height:90px;background:linear-gradient(180deg,#7d4335,#4b241e)}
        .cake-chocolate .chocolate-tier-mid{top:138px;width:278px;height:94px;background:linear-gradient(180deg,#63352b,#321714)}
        .cake-chocolate .chocolate-tier-bottom{top:211px;width:316px;height:84px;background:linear-gradient(180deg,#4c251e,#24100e)}
        .dark-drip{position:absolute;left:0;right:0;top:-3px;height:34px;background:#3a1915;border-radius:24px;clip-path:polygon(0 0,100% 0,100% 55%,94% 55%,91% 100%,85% 100%,82% 55%,72% 55%,68% 84%,62% 84%,58% 55%,48% 55%,44% 96%,38% 96%,35% 55%,25% 55%,21% 82%,15% 82%,12% 55%,0 55%)}
        .chocolate-crown{position:absolute;left:50%;top:12px;transform:translateX(-50%);color:#f3c95c;font-size:27px;text-shadow:0 0 12px #f3c95c}
        .truffle{position:absolute;width:23px;height:23px;border-radius:50%;background:radial-gradient(circle at 30% 25%,#9b5a45,#2b100c 70%);box-shadow:0 4px 7px #180805}.t1{left:27px;top:-13px}.t2{left:92px;top:-20px;width:29px;height:29px}.t3{right:91px;top:-16px}.t4{right:28px;top:-10px}
        .gold-ribbon{position:absolute;left:18px;right:18px;top:31px;height:7px;border-radius:99px;background:linear-gradient(90deg,#9f6a16,#ffe27b,#b77a20);box-shadow:0 0 9px #e7b83d}.gold-ribbon.bottom{top:29px}
        .chocolate-shard{position:absolute;width:22px;height:31px;background:linear-gradient(135deg,#24100c,#633226);border-radius:3px;box-shadow:2px 3px 5px #160805;transform:rotate(8deg)}.sh1{left:38px;top:8px}.sh2{left:119px;top:50px;transform:rotate(10deg)}.sh3{right:67px;top:9px;transform:rotate(-7deg)}.sh4{right:27px;top:49px;transform:rotate(13deg)}
        .chocolate-drip-line{position:absolute;left:22px;right:22px;bottom:16px;height:4px;border-radius:99px;background:#9a5a31;opacity:.7}.bottom-drip{opacity:.55}

        /* Vanilla Gold — ivory tiers, gold drip, pearls and royal details */
        .cake-vanilla .vanilla-tier-top{top:75px;width:232px;height:88px;background:linear-gradient(180deg,#fffdf3,#f7e9c6)}
        .cake-vanilla .vanilla-tier-mid{top:142px;width:280px;height:91px;background:linear-gradient(180deg,#f5dda0,#d8ad4f)}
        .cake-vanilla .vanilla-tier-bottom{top:211px;width:318px;height:84px;background:linear-gradient(180deg,#dfbb62,#ad8030)}
        .gold-drip{position:absolute;left:0;right:0;top:-4px;height:34px;background:#f1cf73;border-radius:24px;clip-path:polygon(0 0,100% 0,100% 58%,93% 58%,90% 100%,84% 100%,81% 58%,72% 58%,68% 88%,62% 88%,58% 58%,48% 58%,44% 97%,38% 97%,35% 58%,25% 58%,21% 82%,15% 82%,12% 58%,0 58%)}
        .gold-drip.lower{opacity:.7}.gold-rose{position:absolute;color:#c89422;font-size:28px;text-shadow:0 0 9px #e9c76a}.gr1{left:25px;top:-16px}.gr2{right:27px;top:-15px}
        .pearl-big{position:absolute;width:18px;height:18px;border-radius:50%;background:radial-gradient(circle at 30% 25%,#fff,#e7d9b4 70%);box-shadow:0 2px 6px #98722b}.pb1{left:82px;top:-8px}.pb2{right:82px;top:-7px}
        .vanilla-swirl{position:absolute;left:50%;top:28px;transform:translateX(-50%);font-size:39px;color:#c18d20;text-shadow:0 0 8px #efd27d}
        .gold-band{position:absolute;left:18px;right:18px;top:31px;height:8px;border-radius:99px;background:linear-gradient(90deg,#b98219,#ffe18a,#b98219);box-shadow:0 0 10px #efc85e}.gold-band.bottom{top:31px}
        .pearl{position:absolute;width:10px;height:10px;border-radius:50%;background:#fff8df;box-shadow:0 1px 5px #9a762f}.pv1{left:38px;top:14px}.pv2{left:73px;top:57px}.pv3{left:132px;top:48px}.pv4{right:74px;top:16px}.pv5{right:39px;top:57px}.pv6{right:130px;top:51px}
        .gold-dot{position:absolute;width:11px;height:11px;border-radius:50%;background:#f4d77f;box-shadow:0 0 8px #f4d77f}.gd1{left:43px;top:50px}.gd2{left:105px;top:61px}.gd3{right:105px;top:47px}.gd4{right:43px;top:62px}

        /* AGE NUMBER CANDLES — the entered age becomes real golden number candles */
        .age-number-candles {
          position: absolute;
          left: 50%;
          top: 2px;
          transform: translateX(-50%);
          z-index: 40;
          height: 72px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: 5px;
          filter: drop-shadow(0 8px 10px rgba(0,0,0,.35));
        }

        .number-candle {
          position: relative;
          width: 58px;
          height: 92px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .number-wick {
          position: absolute;
          left: 50%;
          top: 25px;
          width: 3px;
          height: 13px;
          transform: translateX(-50%);
          border-radius: 3px;
          background: #3b2415;
          z-index: 6;
        }

        .number-flame {
          position: absolute;
          z-index: 7;
          left: 50%;
          top: 6px;
          width: 18px;
          height: 30px;
          transform: translateX(-50%);
          border-radius: 50% 50% 45% 45%;
          background:
            radial-gradient(circle at 50% 76%,
              #fff 0 18%,
              #ffe36c 20% 47%,
              #ff9d27 50% 73%,
              #ff5d25 78% 100%);
          box-shadow:
            0 0 8px rgba(255,238,142,.98),
            0 0 18px rgba(255,172,48,.86),
            0 0 30px rgba(255,112,30,.45);
          animation: numberFlame .75s ease-in-out infinite,
                     numberFlameGlow 1.2s ease-in-out infinite;
        }

        .number-flame::after {
          content: "";
          position: absolute;
          left: 50%;
          bottom: 2px;
          width: 5px;
          height: 11px;
          transform: translateX(-50%);
          border-radius: 50%;
          background: #fffde8;
        }

        .number-value {
          position: relative;
          z-index: 5;
          display: block;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 64px;
          line-height: .82;
          font-weight: 900;
          letter-spacing: -6px;
          color: #f8cf5c;
          -webkit-text-stroke: 2px #fff0a2;
          text-shadow:
            -2px -2px 0 #fff5b5,
            2px 2px 0 #c1841c,
            0 5px 0 #9e6512,
            0 8px 14px rgba(0,0,0,.42),
            0 0 15px rgba(255,211,91,.62);
          transform: perspective(180px) rotateY(-3deg);
        }

        .number-value::after {
          content: "";
          position: absolute;
          left: 12%;
          right: 12%;
          bottom: -6px;
          height: 4px;
          border-radius: 50%;
          background: linear-gradient(90deg, transparent, #fff2a5, transparent);
          opacity: .95;
        }

        .age-number-candles.digits-1 .number-candle {
          width: 70px;
        }

        .age-number-candles.digits-3 {
          gap: 0;
        }

        .age-number-candles.digits-3 .number-candle {
          width: 50px;
        }

        .age-number-candles.digits-3 .number-value {
          font-size: 56px;
          letter-spacing: -5px;
        }

        @keyframes numberFlame {
          0%,100% {
            transform: translateX(-50%) scale(.94) rotate(-2deg);
          }
          50% {
            transform: translateX(-50%) scale(1.08) rotate(2deg);
          }
        }

        @keyframes numberFlameGlow {
          0%,100% { opacity: .9; }
          50% { opacity: 1; }
        }

        /* CANDLES */
        .candles {
          position: absolute;
          left: 50%;
          top: 0;
          transform: translateX(-50%);
          width: 190px;
          height: 95px;
          z-index: 12;
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
        }

        .candle {
          position: relative;
          width: 13px;
          height: 67px;
          border-radius: 5px 5px 3px 3px;
          box-shadow: inset 3px 0 4px rgba(255,255,255,.35);
        }

        .candle.pink {
          background: repeating-linear-gradient(135deg,#ff9fbc 0 7px,#fff 7px 12px);
        }

        .candle.white {
          background: repeating-linear-gradient(135deg,#fff 0 7px,#ff9fbc 7px 12px);
        }

        .candle.gold {
          background: repeating-linear-gradient(135deg,#d9a62e 0 7px,#fff1a8 7px 12px);
        }

        .candle.cream {
          background: repeating-linear-gradient(135deg,#fff3d1 0 7px,#d8a63b 7px 12px);
        }

        .candle span {
          position: absolute;
          width: 14px;
          height: 25px;
          left: 50%;
          top: -27px;
          transform: translateX(-50%);
          border-radius: 50% 50% 45% 45%;
          background: radial-gradient(circle at 50% 75%,#fffbd4 0 18%,#ffd45b 20% 52%,#ff7135 55% 100%);
          animation: flame .8s ease-in-out infinite, flameGlow 1.3s ease-in-out infinite;
        }

        .plate {
          display: none;
        }

        /* FIREWORKS: clear rocket rise + BIG visible burst in every direction */
        .firework {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 1px;
          height: 1px;
          z-index: 8;
          pointer-events: none;
          overflow: visible;
          animation: fireworkCycle 4.2s linear infinite;
          animation-delay: var(--fw-delay);
        }

        .rocket {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 6px;
          height: 24px;
          transform: translate(-50%, 0);
          border-radius: 99px;
          background: linear-gradient(to top, transparent, var(--fire-color) 35%, #fff);
          box-shadow:
            0 0 8px var(--fire-color),
            0 0 18px var(--fire-color),
            0 0 28px rgba(255,255,255,.45);
        }

        .rocket::after {
          content: "";
          position: absolute;
          left: 50%;
          bottom: -15px;
          width: 5px;
          height: 18px;
          transform: translateX(-50%);
          border-radius: 50%;
          background: linear-gradient(#fff, var(--fire-color), transparent);
          box-shadow: 0 0 10px var(--fire-color);
        }

        .burst {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 1px;
          height: 1px;
          opacity: 0;
          transform: translate(0, 0) scale(.1);
          overflow: visible;
          animation: burst 4.2s ease-out infinite;
          animation-delay: var(--fw-delay);
        }

        .burst::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          width: 12px;
          height: 12px;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: #fff;
          box-shadow:
            0 0 10px #fff,
            0 0 24px var(--fire-color),
            0 0 55px var(--fire-color);
        }

        .burst i {
          position: absolute;
          left: 0;
          top: 0;
          width: 7px;
          height: 7px;
          margin: -3.5px;
          border-radius: 50%;
          background: var(--fire-color);
          box-shadow:
            0 0 9px var(--fire-color),
            0 0 20px var(--fire-color);
          transform: rotate(var(--ray)) translateX(0) scale(.2);
          transform-origin: 50% 50%;
          animation: raySpread 4.2s ease-out infinite;
          animation-delay: var(--fw-delay);
        }

        .firework:nth-of-type(1) { --fw-delay: .15s; }
        .firework:nth-of-type(2) { --fw-delay: 1.00s; }
        .firework:nth-of-type(3) { --fw-delay: 1.85s; }
        .firework:nth-of-type(4) { --fw-delay: 2.70s; }
        .firework:nth-of-type(5) { --fw-delay: 3.55s; }

        @keyframes fireworkCycle {
          0% { opacity: 0; transform: translateY(0); }
          5% { opacity: 1; }
          48% { opacity: 1; transform: translateY(-58vh); }
          50% { opacity: 1; transform: translateY(-58vh); }
          70% { opacity: 1; transform: translateY(-58vh); }
          78% { opacity: 0; transform: translateY(-58vh); }
          100% { opacity: 0; transform: translateY(0); }
        }

        @keyframes burst {
          0%, 49% {
            opacity: 0;
            transform: translate(0, 0) scale(.1);
          }
          50% {
            opacity: 1;
            transform: translate(0, 0) scale(.65);
          }
          57% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
          68% {
            opacity: .9;
            transform: translate(0, 0) scale(1.18);
          }
          78%, 100% {
            opacity: 0;
            transform: translate(0, 0) scale(1.45);
          }
        }

        @keyframes raySpread {
          0%, 49% {
            opacity: 0;
            transform: rotate(var(--ray)) translateX(0) scale(.15);
          }
          52% {
            opacity: 1;
            transform: rotate(var(--ray)) translateX(22px) scale(1);
          }
          60% {
            opacity: 1;
            transform: rotate(var(--ray)) translateX(58px) scale(1);
          }
          69% {
            opacity: .9;
            transform: rotate(var(--ray)) translateX(92px) scale(.8);
          }
          79%, 100% {
            opacity: 0;
            transform: rotate(var(--ray)) translateX(118px) scale(.15);
          }
        }

        .cake-age {
          position: absolute;
          left: 50%;
          bottom: 10%;
          transform: translateX(-50%);
          z-index: 35;
          color: var(--cream);
          font-style: italic;
          font-size: 15px;
          white-space: nowrap;
          text-shadow: 0 2px 10px #0008;
        }

        .cake-buttons {
          position: absolute;
          left: 50%;
          bottom: 3%;
          transform: translateX(-50%);
          z-index: 40;
          display: flex;
          justify-content: center;
          gap: 10px;
        }

        .cake-buttons button {
          border: 1px solid var(--accent);
          background: rgba(15,8,12,.94);
          color: #fffaf5;
          border-radius: 999px;
          padding: 12px 24px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .14em;
          text-transform: uppercase;
          cursor: pointer;
        }

        .cake-buttons .sound {
          animation: buttonPulse 2s ease-in-out infinite;
        }

        @keyframes cakeDrop {
          0% { opacity: 0; transform: translateY(100px) scale(.72); }
          65% { opacity: 1; transform: translateY(-8px) scale(1.03); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes messageIn {
          from { opacity: 0; transform: translateY(-15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes flame {
          0%,100% { transform: translateX(-50%) scale(.9) rotate(-2deg); }
          50% { transform: translateX(-50%) scale(1.15) rotate(3deg); }
        }

        @keyframes flameGlow {
          0%,100% { filter: drop-shadow(0 0 5px #fff4a0) drop-shadow(0 0 12px #ff9b43); }
          50% { filter: drop-shadow(0 0 10px #fffbd0) drop-shadow(0 0 25px #ff8a35); }
        }

        @keyframes buttonPulse {
          0%,100% { box-shadow: 0 0 18px var(--accent); }
          50% { box-shadow: 0 0 35px var(--accent); }
        }

        /* =========================================
           ROMANTIC CAKE DECORATIONS
           ========================================= */

        .cake-decorations {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 2;
        }

        .cake-halo {
          position: absolute;
          left: 50%;
          top: 58%;
          width: 540px;
          height: 540px;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(255, 215, 160, .20) 0%,
            rgba(255, 185, 125, .10) 30%,
            rgba(255, 150, 100, .035) 52%,
            transparent 72%
          );
          filter: blur(8px);
          animation: cakeHaloPulse 4s ease-in-out infinite;
        }

        @keyframes cakeHaloPulse {
          0%, 100% {
            opacity: .65;
            transform: translate(-50%, -50%) scale(.92);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.06);
          }
        }

        .floating-sparkles {
          position: absolute;
          inset: 0;
        }

        .floating-sparkles span {
          position: absolute;
          color: rgba(255, 225, 175, .88);
          font-family: Georgia, serif;
          font-size: 18px;
          text-shadow:
            0 0 7px rgba(255, 225, 175, .95),
            0 0 18px rgba(255, 190, 120, .55);
          animation: sparkleFloat 4s ease-in-out infinite;
        }

        .floating-sparkles span:nth-child(1) { left: 10%; top: 27%; animation-delay: 0s; }
        .floating-sparkles span:nth-child(2) { left: 21%; top: 48%; font-size: 12px; animation-delay: 1.2s; }
        .floating-sparkles span:nth-child(3) { left: 31%; top: 19%; font-size: 10px; animation-delay: 2s; }
        .floating-sparkles span:nth-child(4) { left: 42%; top: 37%; font-size: 13px; animation-delay: .7s; }
        .floating-sparkles span:nth-child(5) { left: 58%; top: 31%; font-size: 12px; animation-delay: 1.7s; }
        .floating-sparkles span:nth-child(6) { left: 68%; top: 18%; font-size: 10px; animation-delay: 2.5s; }
        .floating-sparkles span:nth-child(7) { left: 79%; top: 42%; font-size: 17px; animation-delay: .4s; }
        .floating-sparkles span:nth-child(8) { left: 88%; top: 28%; font-size: 11px; animation-delay: 1.8s; }
        .floating-sparkles span:nth-child(9) { left: 8%; top: 67%; font-size: 12px; animation-delay: 2.2s; }
        .floating-sparkles span:nth-child(10) { left: 26%; top: 73%; font-size: 10px; animation-delay: .9s; }
        .floating-sparkles span:nth-child(11) { left: 73%; top: 72%; font-size: 12px; animation-delay: 1.4s; }
        .floating-sparkles span:nth-child(12) { left: 91%; top: 63%; font-size: 15px; animation-delay: 2.8s; }

        @keyframes sparkleFloat {
          0%, 100% {
            opacity: .25;
            transform: translateY(8px) scale(.75) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: translateY(-12px) scale(1.15) rotate(45deg);
          }
        }

        .floating-hearts {
          position: absolute;
          inset: 0;
        }

        .floating-hearts span {
          position: absolute;
          color: rgba(255, 170, 185, .30);
          font-size: 16px;
          text-shadow: 0 0 10px rgba(255, 130, 160, .42);
          animation: heartFloat 6s ease-in-out infinite;
        }

        .floating-hearts span:nth-child(1) { left: 16%; top: 38%; animation-delay: 0s; }
        .floating-hearts span:nth-child(2) { left: 27%; top: 58%; font-size: 12px; animation-delay: 1.5s; }
        .floating-hearts span:nth-child(3) { left: 38%; top: 25%; font-size: 11px; animation-delay: 3s; }
        .floating-hearts span:nth-child(4) { left: 61%; top: 22%; font-size: 13px; animation-delay: 1s; }
        .floating-hearts span:nth-child(5) { left: 71%; top: 53%; font-size: 17px; animation-delay: 2.5s; }
        .floating-hearts span:nth-child(6) { left: 84%; top: 36%; font-size: 11px; animation-delay: 4s; }
        .floating-hearts span:nth-child(7) { left: 9%; top: 51%; font-size: 13px; animation-delay: 3.5s; }
        .floating-hearts span:nth-child(8) { left: 90%; top: 72%; font-size: 15px; animation-delay: 1.8s; }

        @keyframes heartFloat {
          0%, 100% {
            opacity: .15;
            transform: translateY(10px) scale(.8);
          }
          50% {
            opacity: .65;
            transform: translateY(-18px) scale(1.08);
          }
        }

        .cake-floor-glow {
          position: absolute;
          left: 50%;
          top: 84%;
          width: 430px;
          height: 80px;
          transform: translateX(-50%);
          border-radius: 50%;
          background: radial-gradient(
            ellipse,
            rgba(255, 220, 170, .32) 0%,
            rgba(255, 190, 130, .13) 38%,
            transparent 72%
          );
          filter: blur(12px);
          animation: floorGlow 3.5s ease-in-out infinite;
        }

        @keyframes floorGlow {
          0%, 100% {
            opacity: .55;
            transform: translateX(-50%) scale(.9);
          }
          50% {
            opacity: .9;
            transform: translateX(-50%) scale(1.08);
          }
        }

        @media (max-width: 700px) {
          .cake-stage {
            transform: translateX(-50%) scale(.76);
            bottom: 8%;
          }

          .cake-halo {
            width: 380px;
            height: 380px;
          }

          .cake-floor-glow {
            width: 300px;
          }

          .cake-message {
            top: 4%;
          }

          .cake-message h1 {
            font-size: 34px;
          }

          .cake-buttons {
            bottom: 2%;
          }

          .cake-buttons button {
            padding: 10px 17px;
            font-size: 9px;
          }

          .cake-age {
            bottom: 9%;
            font-size: 13px;
          }
        }
      `}</style>

      <Firework left="14%" delay={0.15} color={c.main} />
      <Firework left="29%" delay={1.00} color={c.light} />
      <Firework left="48%" delay={1.85} color={c.main} />
      <Firework left="69%" delay={2.70} color={c.light} />
      <Firework left="84%" delay={3.55} color={c.main} />

      <div className="cake-message">
        <div className="small">{c.title}</div>
        <h1>Happy Birthday!</h1>
        <div className="name">{name || "Someone Special"}</div>
      </div>

      <div className="cake-stage">
        {selected === "strawberry" && <StrawberryCake age={age} />}
        {selected === "chocolate" && <ChocolateCake age={age} />}
        {selected === "vanilla" && <VanillaCake age={age} />}
      </div>

      <div className="cake-age">
        {age ? `Celebrating ${age} beautiful years ✨` : "Make a wish ✨"}
      </div>

      <div className="cake-buttons">
        <button type="button" onClick={() => onComplete?.()}>
          Continue ✨
        </button>
      </div>
    </div>
    
  );
}







