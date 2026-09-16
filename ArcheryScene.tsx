"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

type Props = {
  onComplete?: () => void;
};

export default function ArcheryScene({ onComplete }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const archery = useRef<HTMLDivElement>(null);
  const bow = useRef<SVGSVGElement>(null);
  const arrow = useRef<SVGSVGElement>(null);
  const target = useRef<HTMLDivElement>(null);
  const targetHeart = useRef<HTMLSpanElement>(null);
  const strL = useRef<SVGLineElement>(null);
  const strR = useRef<SVGLineElement>(null);
  const serving = useRef<SVGCircleElement>(null);
  const aim = useRef<HTMLDivElement>(null);
  const eyebrow = useRef<HTMLParagraphElement>(null);
  const hint = useRef<HTMLParagraphElement>(null);
  const flood = useRef<HTMLDivElement>(null);
  const drawing = useRef(false);
  const played = useRef(false);
  const curDraw = useRef(0);
  const maxDraw = useRef(120);
  const startPX = useRef(0);
  const startPY = useRef(0);
  const startDraw = useRef(0);
  const arrowBaseX = useRef(0);
  const arrowBaseY = useRef(0);
  const svgScale = useRef(1);
  const pullUX = useRef(0);
  const pullUY = useRef(1);
  const nock = useRef({ val: 96 });

  useEffect(() => {
    const r = root.current, a = archery.current, b = bow.current, ar = arrow.current, t = target.current;
    const sl = strL.current, sr = strR.current, sv = serving.current, ai = aim.current;
    if (!r || !a || !b || !ar || !t || !sl || !sr || !sv || !ai) return;

    const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

    const applyNock = () => {
      const y = nock.current.val;
      sl.setAttribute("y2", String(y));
      sr.setAttribute("y2", String(y));
      sv.setAttribute("cy", String(y));
    };

    const refreshRig = () => {
      const W = r.clientWidth, H = r.clientHeight;
      const gripX = W * 0.24, gripY = H * 0.76;
      const heartX = W * 0.5, heartY = H * 0.33;
      const aimRad = Math.atan2(heartX - gripX, gripY - heartY);

      pullUX.current = -Math.sin(aimRad);
      pullUY.current = Math.cos(aimRad);
      nock.current.val = 96;
      applyNock();

      gsap.set(a, { rotation: 0, scale: 1, x: 0, y: 0 });
      a.style.left = "0px";
      a.style.top = "0px";

      const ar0 = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      const sr0 = sv.getBoundingClientRect();
      const rr = ar.getBoundingClientRect();

      svgScale.current = br.width / 460;

      const gripLX = (br.left - ar0.left) + 0.5 * br.width;
      const gripLY = (br.top - ar0.top) + (240 / 300) * br.height;
      const nockLX = (sr0.left - ar0.left) + 0.5 * sr0.width;
      const nockLY = (sr0.top - ar0.top) + 0.5 * sr0.height;

      arrowBaseX.current = nockLX - ((rr.left - ar0.left) + 0.5 * rr.width);
      arrowBaseY.current = nockLY - ((rr.top - ar0.top) + (205 / 220) * rr.height);

      a.style.left = `${gripX - gripLX}px`;
      a.style.top = `${gripY - gripLY}px`;

      gsap.set(a, {
        transformOrigin: `${gripLX}px ${gripLY}px`,
        rotation: aimRad * 180 / Math.PI,
      });
      gsap.set(ar, { x: arrowBaseX.current, y: arrowBaseY.current });
      maxDraw.current = Math.min(br.height * 0.72, H * 0.16, 132);
      curDraw.current = 0;
    };

    const setDraw = (d: number) => {
      curDraw.current = clamp(d, 0, maxDraw.current);
      gsap.set(ar, {
        x: arrowBaseX.current,
        y: arrowBaseY.current + curDraw.current,
      });
      nock.current.val = 96 + curDraw.current / svgScale.current;
      applyNock();
      gsap.set(ai, { opacity: 0.55 * (curDraw.current / maxDraw.current) });
    };

    const fire = () => {
      if (played.current) return;
      played.current = true;
      drawing.current = false;

      const tip = ar.querySelector("#tip") as SVGCircleElement | null;
      const tr = t.getBoundingClientRect();
      const rr = tip?.getBoundingClientRect();
      if (!rr) return;

      const tipX = rr.left + rr.width / 2, tipY = rr.top + rr.height / 2;
      const tcx = tr.left + tr.width / 2, tcy = tr.top + tr.height / 2;
      const flightDist = Math.hypot(tcx - tipX, tcy - tipY);
      const H = r.clientHeight, W = r.clientWidth;
      const fallPx = Math.min(H * 0.26, H - tcy - tr.height * 0.4);

      gsap.timeline({
        onComplete: () => onComplete?.(),
      })
      .to(nock.current, {
        val: 96,
        duration: 0.5,
        ease: "elastic.out(1,0.34)",
        onUpdate: applyNock,
      }, 0)
      .to(ar, {
        y: arrowBaseY.current + curDraw.current - flightDist,
        duration: 0.26,
        ease: "power2.in",
      }, 0)
      .to(ar, { scaleY: 1.16, duration: 0.14, ease: "power2.in" }, 0)
      .to(ar, { scaleY: 1, duration: 0.1 }, 0.16)
      .to(ai, { opacity: 0, duration: 0.18 }, 0)
      .to([eyebrow.current, hint.current], { opacity: 0, duration: 0.2 }, 0)
      .to(t, { x: 7, y: -9, duration: 0.06, ease: "power2.out" }, 0.26)
      .to(t, { x: 0, y: 0, duration: 0.32 }, 0.32)
      .to(t, { scale: 1.14, duration: 0.06 }, 0.26)
      .to(t, { scale: 1, duration: 0.26 }, 0.32)
      .to(ar, { rotation: "+=4", duration: 0.05, yoyo: true, repeat: 4 }, 0.27)
      .to(ar, { opacity: 0, duration: 0.16 }, 0.56)
      .to(t, {
        y: fallPx,
        scaleX: 0.84,
        scaleY: 1.3,
        duration: 0.34,
        ease: "power1.in",
      }, 0.64)
      .to(t, { scaleX: 1.4, scaleY: 0.6, duration: 0.07 }, 0.98)
      .to(flood.current, { opacity: 1, scale: 5, duration: 0.34, ease: "power2.in" }, 1.0)
      .to(t, { opacity: 0, duration: 0.12 }, 1.06);
    };

    const endDraw = () => {
      if (!drawing.current) return;
      drawing.current = false;
      if (curDraw.current > maxDraw.current * 0.26) fire();
      else {
        gsap.to({ d: curDraw.current }, {
          d: 0, duration: 0.55, ease: "elastic.out(1,0.4)",
          onUpdate: function () { setDraw(this.targets()[0].d); },
        });
      }
    };

    const down = (e: PointerEvent) => {
      if (played.current) return;
      drawing.current = true;
      a.setPointerCapture?.(e.pointerId);
      startPX.current = e.clientX;
      startPY.current = e.clientY;
      startDraw.current = curDraw.current;
      e.preventDefault();
    };

    const move = (e: PointerEvent) => {
      if (!drawing.current || played.current) return;
      const proj = (e.clientX - startPX.current) * pullUX.current +
                   (e.clientY - startPY.current) * pullUY.current;
      setDraw(startDraw.current + proj);
    };

    a.addEventListener("pointerdown", down);
    a.addEventListener("pointermove", move);
    a.addEventListener("pointerup", endDraw);
    a.addEventListener("pointercancel", endDraw);
    window.addEventListener("resize", refreshRig);
    refreshRig();
    gsap.fromTo(eyebrow.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 1.1, delay: .25 });
    gsap.fromTo(hint.current, { opacity: 0 }, { opacity: 1, duration: .8, delay: 1 });

    return () => {
      a.removeEventListener("pointerdown", down);
      a.removeEventListener("pointermove", move);
      a.removeEventListener("pointerup", endDraw);
      a.removeEventListener("pointercancel", endDraw);
      window.removeEventListener("resize", refreshRig);
      gsap.killTweensOf("*");
    };
  }, [onComplete]);

  return (
    <div ref={root} className="fixed inset-0 z-[200] overflow-hidden" style={{background:"radial-gradient(120% 88% at 50% 24%,#fff8f1 0%,#f9eee8 58%,#f2ddd8 100%)"}}>
      <div className="absolute inset-0 pointer-events-none" style={{background:"radial-gradient(circle at 50% 44%,rgba(255,190,150,.35),rgba(255,150,170,.10) 46%,transparent 70%)"}} />
      <p ref={eyebrow} className="absolute top-[13%] left-0 right-0 z-20 text-center italic font-semibold text-[clamp(15px,3.6vw,26px)] tracking-[.06em] text-[#a85069]">a little something, for you</p>

      <div className="absolute top-[33%] left-0 right-0 flex justify-center -translate-y-1/2 pointer-events-none">
        <div ref={target} className="relative w-[clamp(120px,27vw,208px)] aspect-[100/92] origin-[50%_60%]">
          <span className="absolute left-1/2 top-[52%] w-[230%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full blur-sm" style={{background:"radial-gradient(circle,rgba(255,120,150,.55),rgba(255,90,130,.18) 42%,transparent 68%)"}} />
          <span ref={targetHeart} className="absolute inset-0 block">
            <svg className="w-full h-full drop-shadow-[0_10px_22px_rgba(168,15,64,.34)]" viewBox="0 0 100 92">
              <defs><radialGradient id="hg2" cx="38%" cy="30%" r="80%"><stop offset="0%" stopColor="#ffd9e4"/><stop offset="42%" stopColor="#ff6f97"/><stop offset="82%" stopColor="#d81e57"/><stop offset="100%" stopColor="#9d0f3e"/></radialGradient><linearGradient id="hs2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fff" stopOpacity=".85"/><stop offset="34%" stopColor="#fff" stopOpacity="0"/></linearGradient></defs>
              <path d="M50 86.5C26 68 10.5 53.6 10.5 34.6 10.5 20.4 21 11 33.2 11c8.6 0 14.2 4.7 16.8 11.4C52.6 15.7 58.2 11 66.8 11 79 11 89.5 20.4 89.5 34.6 89.5 53.6 74 68 50 86.5Z" fill="url(#hg2)"/>
              <path d="M50 86.5C26 68 10.5 53.6 10.5 34.6 10.5 20.4 21 11 33.2 11c8.6 0 14.2 4.7 16.8 11.4C52.6 15.7 58.2 11 66.8 11 79 11 89.5 20.4 89.5 34.6 89.5 53.6 74 68 50 86.5Z" fill="url(#hs2)" opacity=".7"/>
              <ellipse cx="34" cy="30" rx="8.5" ry="5.4" fill="#fff" opacity=".72"/>
            </svg>
          </span>
        </div>
      </div>

      <div ref={archery} className="absolute top-0 left-0 w-[clamp(100px,18vw,168px)] cursor-grab touch-none z-30">
        <div ref={aim} className="absolute left-1/2 bottom-[32%] w-[2px] h-[190%] -ml-px opacity-0 pointer-events-none" style={{background:"linear-gradient(0deg,rgba(255,214,150,.6),rgba(255,150,170,.22) 52%,transparent 78%)"}} />
        <svg ref={bow} className="block w-full h-auto overflow-visible drop-shadow-[0_12px_18px_rgba(90,40,15,.3)]" viewBox="0 0 460 300">
          <defs><linearGradient id="limb2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#4a2a1a"/><stop offset=".18" stopColor="#6b3f24"/><stop offset=".5" stopColor="#8a5127"/><stop offset=".82" stopColor="#6b3f24"/><stop offset="1" stopColor="#4a2a1a"/></linearGradient><linearGradient id="limbHi2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffd6a0" stopOpacity=".8"/><stop offset="1" stopColor="#ffd6a0" stopOpacity="0"/></linearGradient><linearGradient id="grip2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#2a1a10"/><stop offset=".5" stopColor="#5a3822"/><stop offset="1" stopColor="#2a1a10"/></linearGradient></defs>
          <path d="M34 96 C118 168 168 240 230 252 C292 240 342 168 426 96" fill="none" stroke="url(#limb2)" strokeWidth="13" strokeLinecap="round"/>
          <path d="M34 96 C118 168 168 240 230 252 C292 240 342 168 426 96" fill="none" stroke="url(#limbHi2)" strokeWidth="3" strokeLinecap="round" opacity=".7"/>
          <path d="M34 96 C22 82 26 70 40 66" fill="none" stroke="url(#limb2)" strokeWidth="8" strokeLinecap="round"/>
          <path d="M426 96 C438 82 434 70 420 66" fill="none" stroke="url(#limb2)" strokeWidth="8" strokeLinecap="round"/>
          <rect x="216" y="206" width="28" height="70" rx="9" fill="url(#grip2)"/>
          <path d="M219 220h22 M219 236h22 M219 252h22" stroke="rgba(0,0,0,.35)" strokeWidth="2"/>
          <line ref={strL} x1="40" y1="70" x2="230" y2="96" stroke="#9a8068" strokeWidth="2.2" strokeLinecap="round"/>
          <line ref={strR} x1="420" y1="70" x2="230" y2="96" stroke="#9a8068" strokeWidth="2.2" strokeLinecap="round"/>
          <circle ref={serving} cx="230" cy="96" r="4.5" fill="#6f5137"/>
        </svg>

        <svg ref={arrow} className="absolute left-0 right-0 mx-auto bottom-[36%] w-[17.5%] h-auto overflow-visible drop-shadow-[0_5px_7px_rgba(90,40,15,.36)]" viewBox="0 0 64 220">
          <defs><linearGradient id="shaft2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#4a2c14"/><stop offset=".5" stopColor="#8a5a2c"/><stop offset="1" stopColor="#3e2410"/></linearGradient><linearGradient id="gold2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffe38c"/><stop offset=".45" stopColor="#f4a626"/><stop offset="1" stopColor="#a85f0e"/></linearGradient><linearGradient id="feath2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ff7f9c"/><stop offset=".5" stopColor="#e6396a"/><stop offset="1" stopColor="#a8154a"/></linearGradient></defs>
          <rect x="29.4" y="30" width="5.2" height="168" rx="2.6" fill="url(#shaft2)"/>
          <path d="M31 30 C10 16 2 20 4 34 C12 30 20 32 31 40Z" fill="#fff" stroke="rgba(196,132,58,.72)" strokeWidth="1.2"/>
          <path d="M33 30 C54 16 62 20 60 34 C52 30 44 32 33 40Z" fill="#fff" stroke="rgba(196,132,58,.72)" strokeWidth="1.2"/>
          <path d="M32 12 C30 7 22 6.5 21.5 13 C21 18 27 22 32 27 C37 22 43 18 42.5 13 C42 6.5 34 7 32 12Z" fill="url(#gold2)" stroke="#a5701a" strokeWidth=".8"/>
          <ellipse cx="27" cy="13" rx="2.6" ry="1.7" fill="#fff" opacity=".8"/>
          <path d="M32 150 C16 156 10 178 15 200 C24 194 30 184 32 176Z" fill="url(#feath2)"/>
          <path d="M32 150 C48 156 54 178 49 200 C40 194 34 184 32 176Z" fill="url(#feath2)" opacity=".92"/>
          <circle id="tip" cx="32" cy="9" r=".6" fill="none"/>
        </svg>
      </div>

      <div ref={flood} className="absolute left-1/2 top-1/2 z-10 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0" style={{background:"radial-gradient(circle,rgba(255,70,120,.9),rgba(255,160,180,.45) 35%,transparent 72%)"}} />

      <div className="absolute bottom-[5%] left-0 right-0 z-50 text-center">
        <p ref={hint} className="font-[var(--font-script)] text-3xl text-[#9d6170]">a little something, for you</p>
        <p className="mt-4 text-xs font-bold uppercase tracking-[.35em] text-[#a87983]">pull &amp; release</p>
      </div>
    </div>
  );
}
