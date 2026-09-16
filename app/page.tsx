"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { gsap } from "gsap";
import ArcheryScene from "@/components/ArcheryScene";
import BirthdayTreeScene from "../components/BirthdayTreeScene";
import MemoryLaneScene from "@/components/MemoryLaneScene";
import CakeScene from "@/components/CakeScene";
import LetterScene from "@/components/LetterScene";
import FinalSurpriseScene from "@/components/FinalSurpriseScene";

const musicFiles: Record<string, string> = {
  "Perfect — Ed Sheeran": "/music/perfect.mp3",
  "Until I Found You — Stephen Sanchez": "/music/until-i-found-you.mp3",
  "A Thousand Years — Christina Perri": "/music/a-thousand-years.mp3",
  "Tum Se Hi — Mohit Chauhan": "/music/tum-se-hi.mp3",
};

const musicOptions = {
  Romantic: [
    "Perfect — Ed Sheeran",
    "Until I Found You — Stephen Sanchez",
    "A Thousand Years — Christina Perri",
    "Tum Se Hi — Mohit Chauhan",
  ],
  Happy: [
    "Love You Zindagi",
    "Gallan Goodiyaan",
    "Ilahi",
    "What Makes You Beautiful",
  ],
  Emotional: [
    "Photograph — Ed Sheeran",
    "Someone You Loved — Lewis Capaldi",
    "Agar Tum Saath Ho",
    "Tujh Mein Rab Dikhta Hai",
  ],
};

export default function Home() {
  const [step, setStep] = useState(1);

  const [selectedCake, setSelectedCake] = useState("strawberry");
  const [showCakeBuild, setShowCakeBuild] = useState(false);
  const [craftingStep, setCraftingStep] = useState(0);
  const [showBirthdayTree, setShowBirthdayTree] = useState(false);
  const [showSurprise, setShowSurprise] = useState(false);
  const [showMemoryLane, setShowMemoryLane] = useState(false);
  const [showCakeScene, setShowCakeScene] = useState(false);
  const [showLetterScene, setShowLetterScene] = useState(false);
  const [showFinalScene, setShowFinalScene] = useState(false);

  const [heartHit, setHeartHit] = useState(false);
  const [arrowReleased, setArrowReleased] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const pullStartY = useRef(0);

  const [selectedMusic, setSelectedMusic] = useState("");
  const [selectedSong, setSelectedSong] = useState("");

  const [selectedSongFile, setSelectedSongFile] =
    useState<File | null>(null);

  const [audioUrl, setAudioUrl] = useState("");

const audioRef = useRef<HTMLAudioElement | null>(null);
const customPreviewAudioRef = useRef<HTMLAudioElement | null>(null);
const [playingSong, setPlayingSong] = useState("");

  const [name, setName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [age, setAge] = useState("");
  const [birthday, setBirthday] = useState("");
  const [memoryPhotos, setMemoryPhotos] = useState<string[]>([]);
  const [memoryPhotoFiles, setMemoryPhotoFiles] = useState<File[]>([]);
 const [loveMessage, setLoveMessage] = useState("");

 const [showTreeScene, setShowTreeScene] = useState(false);
 const [createdSurpriseId, setCreatedSurpriseId] = useState<string | null>(null);
const [showShareScreen, setShowShareScreen] = useState(false);
const [isSavingSurprise, setIsSavingSurprise] = useState(false);

  const startSelectedSong = async () => {
    const src =
      selectedSongFile && audioUrl
        ? audioUrl
        : selectedSong
          ? musicFiles[selectedSong]
          : "";

    if (!src) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(src);
    audio.loop = true;
    audioRef.current = audio;

    try {
      await audio.play();
      setPlayingSong(selectedSong || selectedSongFile?.name || "");
    } catch {
      // Browser autoplay policy may block playback until a user gesture.
    }
  };

useEffect(() => {
  if (!showCakeBuild) return;

  setCraftingStep(0);
  setShowSurprise(false);
  setShowShareScreen(false);

  const timer = setInterval(() => {
    setCraftingStep((current) => {
      if (current >= 5) {
        clearInterval(timer);
        return 5;
      }

      return current + 1;
    });
  }, 1200);

  return () => clearInterval(timer);
}, [showCakeBuild]);

// After processing reaches the final step,
// wait for Supabase upload/save to finish.
useEffect(() => {
  if (!showCakeBuild) return;
  if (craftingStep < 5) return;
  if (isSavingSurprise) return;

  const timer = setTimeout(() => {
    setShowCakeBuild(false);
    setShowShareScreen(true);
  }, 1000);

  return () => clearTimeout(timer);
}, [showCakeBuild, craftingStep, isSavingSurprise]);

useEffect(() => {
  return () => {
    audioRef.current?.pause();
    audioRef.current = null;
  };
}, []);

// Song selection is only a preview on Step 2.
// Stop all preview audio as soon as the user leaves Step 2.
// The song will be started again from the Archery Scene.
useEffect(() => {
  if (step !== 2) {
    audioRef.current?.pause();
    audioRef.current = null;
    customPreviewAudioRef.current?.pause();
    if (customPreviewAudioRef.current) {
      customPreviewAudioRef.current.currentTime = 0;
    }
    setPlayingSong("");
  }
}, [step]);

return (
    <main className="relative min-h-screen overflow-hidden bg-[#fff8f5] px-4 py-8 text-[#3c2929]">

      {/* Animated Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="bg-heart heart-1">♥</span>
        <span className="bg-heart heart-2">♥</span>
        <span className="bg-heart heart-3">♥</span>
        <span className="bg-heart heart-4">♥</span>
        <span className="bg-heart heart-5">♥</span>

        <span className="bg-sparkle sparkle-1">✦</span>
        <span className="bg-sparkle sparkle-2">✧</span>
        <span className="bg-sparkle sparkle-3">✦</span>
        <span className="bg-sparkle sparkle-4">✧</span>
      </div>

      {/* Main Card */}
      {!showSurprise && !showBirthdayTree && !showCakeBuild && !showMemoryLane && !showCakeScene && !showLetterScene && !showFinalScene && (
      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-xl flex-col justify-center">

        <div className="rounded-[32px] border border-[#f1deda] bg-white/85 p-6 shadow-[0_25px_80px_rgba(180,90,100,0.12)] backdrop-blur-md sm:p-10">

          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto flex items-center justify-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl shadow-md">
                💌
              </div>

              <p className="text-sm font-bold uppercase tracking-[0.35em] text-[#8f656d]">
                OUR MOMENTS
              </p>

            </div>

            <p className="mt-2 text-xs text-[#b78b91]">
              A little something special ✨
            </p>
          </div>

          {/* Progress */}
          <div className="mb-2 flex items-center justify-between">
            <span className="font-semibold text-[#8f656d]">
              Step {step} of 5
            </span>

            <span className="font-semibold text-[#8f656d]">
              {step === 1 && "Let's begin ✨"}
              {step === 2 && "Choose your music 🎵"}
              {step === 3 && "Add your memories 📸"}
              {step === 4 && "Write from the heart 💌"}
              {step === 5 && "Almost ready ✨"}
            </span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-[#f5e4e4]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#ff6f91] to-[#ff9b58] transition-all duration-500"
              style={{ width: `${step * 20}%` }}
            />
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <>
              {/* Hero */}
              <div className="mb-9 mt-8 text-center">

                {/* Main Animated Heart */}
                <div className="main-heart-wrap mx-auto mb-7">

                  <div className="heart-ring ring-one" />
                  <div className="heart-ring ring-two" />

                  <div className="main-heart">
                    <span>♥</span>
                  </div>

                  <span className="heart-mini mini-1">♥</span>
                  <span className="heart-mini mini-2">♥</span>
                  <span className="heart-mini mini-3">✦</span>

                </div>

                <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-[#c17782]">
                  A little surprise
                </p>

                <h1 className="text-3xl font-black leading-[1.12] tracking-[-0.035em] sm:text-4xl">
                  Make a little{" "}
                  <span className="font-light italic text-[#eb6684]">
                    magic
                  </span>
                  <br />
                  for someone special
                </h1>

                <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-[#8c7074]">
                  Create a beautiful birthday surprise filled with memories,
                  music, wishes and a letter from the heart.
                </p>

              </div>

              {/* Form */}
              <div className="space-y-5">

                {/* Name */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-[#5a3e42]">
                    Their name{" "}
                    <span className="text-[#ef6683]">*</span>
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter their name"
                    className="w-full rounded-2xl border border-[#ead9da] bg-[#fffaf9] px-5 py-4 text-base outline-none transition placeholder:text-[#c4aeb1] focus:border-[#ef718c] focus:ring-4 focus:ring-[#ef718c]/10"
                  />
                </div>

                {/* Your Name / Creator Name */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-[#5a3e42]">
                    Your name <span className="text-[#ef6683]">*</span>
                  </label>

                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full rounded-2xl border border-[#ead9da] bg-[#fffaf9] px-5 py-4 text-base outline-none transition placeholder:text-[#c4aeb1] focus:border-[#ef718c] focus:ring-4 focus:ring-[#ef718c]/10"
                  />

                  <p className="mt-2 px-1 text-xs text-[#b59da0]">
                    💌 This name will appear as the person who created the surprise.
                  </p>
                </div>

                {/* Age */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-[#5a3e42]">
                    Turning age{" "}
                    <span className="font-normal text-[#b59da0]">
                      (optional)
                    </span>
                  </label>

                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Enter age"
                    className="w-full rounded-2xl border border-[#ead9da] bg-[#fffaf9] px-5 py-4 text-base outline-none transition placeholder:text-[#c4aeb1] focus:border-[#ef718c] focus:ring-4 focus:ring-[#ef718c]/10"
                  />
                </div>

                {/* Birthday */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-[#5a3e42]">
                    Their birthday{" "}
                    <span className="font-normal text-[#b59da0]">
                      (optional)
                    </span>
                  </label>

                  <input
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    className="w-full rounded-2xl border border-[#ead9da] bg-[#fffaf9] px-5 py-4 text-base outline-none transition focus:border-[#ef718c] focus:ring-4 focus:ring-[#ef718c]/10"
                  />

                  <p className="mt-2 px-1 text-xs text-[#b59da0]">
                    🎂 Adding the date can unlock a special midnight birthday
                    moment.
                  </p>
                </div>

              </div>

              {/* Continue */}
              <button
                type="button"
                onClick={() => {
                  if (!name.trim()) {
                    alert("Please enter their name ❤️");
                    return;
                  }

                  if (!senderName.trim()) {
                    alert("Please enter your name ❤️");
                    return;
                  }

                  setStep(2);
                }}
                className="mt-6 w-full rounded-2xl bg-gradient-to-r from-[#ff6f70] to-[#ff9b58] px-6 py-4 text-lg font-bold text-white shadow-lg transition hover:scale-[1.02]"
              >
                Continue to the magic ✨
              </button>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="mt-10 rounded-3xl border border-pink-100 bg-white/90 p-6 shadow-sm">

              {/* Heading */}
              <div className="mb-6 text-center">

                <p className="text-xs font-bold uppercase tracking-[0.3em] text-pink-400">
                  STEP 2 OF 5
                </p>

                <h2 className="mt-3 text-3xl font-black text-[#3c2929]">
                  Pick a little{" "}
                  <span className="text-pink-500">music</span> 🎵
                </h2>

                <p className="mt-2 text-sm text-[#9b7b7f]">
                  First choose a mood, then pick your favourite song.
                </p>

              </div>

              {/* Music Moods */}
              <div className="mb-6 grid grid-cols-3 gap-2">

                {/* Romantic */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMusic("Romantic");
                    setSelectedSong("");
                    setSelectedSongFile(null);
                    setAudioUrl("");
                  }}
                  className={`rounded-2xl border p-3 text-center transition-all ${
                    selectedMusic === "Romantic"
                      ? "border-pink-400 bg-pink-50 shadow-md"
                      : "border-pink-100 bg-white hover:bg-pink-50"
                  }`}
                >
                  <div className="text-2xl">💕</div>

                  <p className="mt-1 text-sm font-bold text-[#4a3438]">
                    Romantic
                  </p>
                </button>

                {/* Happy */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMusic("Happy");
                    setSelectedSong("");
                    setSelectedSongFile(null);
                    setAudioUrl("");
                  }}
                  className={`rounded-2xl border p-3 text-center transition-all ${
                    selectedMusic === "Happy"
                      ? "border-pink-400 bg-pink-50 shadow-md"
                      : "border-pink-100 bg-white hover:bg-pink-50"
                  }`}
                >
                  <div className="text-2xl">🎉</div>

                  <p className="mt-1 text-sm font-bold text-[#4a3438]">
                    Happy
                  </p>
                </button>

                {/* Emotional */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMusic("Emotional");
                    setSelectedSong("");
                    setSelectedSongFile(null);
                    setAudioUrl("");
                  }}
                  className={`rounded-2xl border p-3 text-center transition-all ${
                    selectedMusic === "Emotional"
                      ? "border-pink-400 bg-pink-50 shadow-md"
                      : "border-pink-100 bg-white hover:bg-pink-50"
                  }`}
                >
                  <div className="text-2xl">✨</div>

                  <p className="mt-1 text-sm font-bold text-[#4a3438]">
                    Emotional
                  </p>
                </button>

              </div>

              {/* Built-in Song List */}
              {selectedMusic &&
                selectedMusic !== "My Song" && (
                  <div className="space-y-3">

                    <p className="mb-3 text-sm font-bold text-[#6d4b51]">
                      Choose your song 🎧
                    </p>

                    {musicOptions[
                      selectedMusic as keyof typeof musicOptions
                    ].map((song) => (
                      <button
                        key={song}
                        type="button"
                        onClick={() => {
  // Step 2 only selects the song. Playback starts later in Archery.
  audioRef.current?.pause();
  audioRef.current = null;
  setPlayingSong("");
  setSelectedSong(song);
}}
                        className={`w-full rounded-2xl border p-4 text-left transition-all ${
                          selectedSong === song
                            ? "border-pink-400 bg-pink-50 shadow-md"
                            : "border-pink-100 bg-white hover:border-pink-200 hover:bg-pink-50/50"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 text-lg">
                              🎵
                            </div>

                            <div>
                              <p className="text-sm font-bold text-[#4a3438]">
                                {song.split(" — ")[0]}
                              </p>

                              {song.includes(" — ") && (
                                <p className="text-xs text-[#a88b90]">
                                  {song.split(" — ")[1]}
                                </p>
                              )}
                            </div>

                          </div>

                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                              selectedSong === song
                                ? "bg-pink-500 text-white"
                                : "bg-pink-50 text-pink-400"
                            }`}
                          >
                           {playingSong === song ? "❚❚" : "▶"}
                          </div>

                        </div>
                      </button>
                    ))}

                  </div>
                )}

              {/* Own Song */}
              <div className="mt-5 rounded-2xl border border-dashed border-pink-200 bg-[#fffaf9] p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-100 text-lg">
                    🎶
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="text-sm font-bold text-[#5a3e42]">
                      Have your own special song?
                    </p>

                    <p className="mt-0.5 text-xs text-[#a88b90]">
                      Add your favourite MP3
                    </p>

                  </div>

                  <label className="cursor-pointer rounded-full bg-pink-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-pink-600">
                    Add

                    <input
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];

                        if (file) {
                          const url = URL.createObjectURL(file);

                          setSelectedSongFile(file);
                          setAudioUrl(url);
                          setSelectedSong(
                            `My song — ${file.name}`
                          );
                          setSelectedMusic("My Song");
                        }
                      }}
                    />
                  </label>

                </div>

                {/* Custom Song Preview */}
                {selectedSongFile && audioUrl && (
                  <div className="mt-4 rounded-2xl bg-pink-50 p-3">

                    <p className="mb-2 truncate text-xs font-semibold text-pink-600">
                      ✓ {selectedSongFile.name}
                    </p>

                    <p className="text-xs text-[#a88b90]">
                      Your song will play after the surprise begins. 🎵
                    </p>

                  </div>
                )}

              </div>

              {/* Buttons */}
              <div className="mt-6 flex gap-3">

                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                  }}
                  className="w-1/3 rounded-2xl border border-pink-200 bg-white px-4 py-4 font-bold text-[#9b6f77] transition hover:bg-pink-50"
                >
                  ← Back
                </button>

                <button
                  type="button"
                  disabled={!selectedSong}
                  onClick={() => setStep(3)}
                 
                 className="w-2/3rounded-2xl bg-gradient-to-r from-[#ff6f70] to-[#ff9b58] px-4 py-4 font-bold text-white shadow-lg transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40"
                  
                >
                  Continue to memories ✨
                </button>

              </div>

            </div>
          )}

         {/* STEP 3 - MEMORIES */}
{step === 3 && (
  <div className="mt-10 rounded-3xl border border-pink-100 bg-white/90 p-6 shadow-sm">

    {/* Heading */}
    <div className="mb-7 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-pink-400">
        STEP 3 OF 5
      </p>

      <h2 className="mt-3 text-3xl font-black text-[#3c2929]">
        Add your{" "}
        <span className="text-pink-500">memories</span> 📸
      </h2>

      <p className="mt-2 text-sm leading-6 text-[#9b7b7f]">
        Add a few favourite photos to make the surprise feel personal.
      </p>
    </div>

    {/* Upload Box */}
    <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-pink-200 bg-[#fffaf9] px-5 py-8 text-center transition hover:border-pink-400 hover:bg-pink-50/40">

      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 text-3xl">
        📷
      </div>

      <p className="mt-4 text-base font-bold text-[#5a3e42]">
        Add your favourite photos
      </p>

      <p className="mt-1 text-xs text-[#a88b90]">
        JPG, PNG or WEBP • Up to 6 photos
      </p>

      <span className="mt-4 rounded-full bg-pink-500 px-5 py-2.5 text-xs font-bold text-white">
        Choose photos
      </span>

      <input
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
  const files = Array.from(e.target.files || []);

  const remainingSlots = 6 - memoryPhotoFiles.length;

  if (remainingSlots <= 0) {
    e.target.value = "";
    return;
  }

  const newFiles = files.slice(0, remainingSlots);

  const newUrls = newFiles.map((file) =>
    URL.createObjectURL(file)
  );

  setMemoryPhotoFiles((current) => [
    ...current,
    ...newFiles,
  ]);

  setMemoryPhotos((current) => [
    ...current,
    ...newUrls,
  ]);

  e.target.value = "";
}}
      />
    </label>

    {/* Photo Preview */}
    {memoryPhotos.length > 0 && (
      <div className="mt-6">

        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-bold text-[#6d4b51]">
            Your memories 💕
          </p>

          <span className="text-xs font-semibold text-pink-400">
            {memoryPhotos.length}/6
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

          {memoryPhotos.map((photo, index) => (
            <div
              key={photo}
              className="group relative aspect-square overflow-hidden rounded-2xl border border-pink-100 bg-pink-50 shadow-sm"
            >

              <img
                src={photo}
                alt={`Memory ${index + 1}`}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />

              {/* Remove */}
              <button
                type="button"
                onClick={() => {
                  URL.revokeObjectURL(photo);

                  setMemoryPhotos((current) =>
                    current.filter((_, i) => i !== index)
                  );

                  setMemoryPhotoFiles((current) =>
                    current.filter((_, i) => i !== index)
                  );
                }}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-sm font-bold text-red-500 shadow-md backdrop-blur-sm transition hover:bg-red-50"
              >
                ×
              </button>

            </div>
          ))}

        </div>
      </div>
    )}

    {/* Photo Count Message */}
    {memoryPhotos.length === 6 && (
      <p className="mt-3 text-center text-xs font-medium text-pink-400">
        ✨ You have added the maximum 6 memories.
      </p>
    )}

    {/* Buttons */}
    <div className="mt-7 flex gap-3">

      <button
        type="button"
        onClick={() => setStep(2)}
        className="w-1/3 rounded-2xl border border-pink-200 bg-white px-4 py-4 font-bold text-[#9b6f77] transition hover:bg-pink-50"
      >
        ← Back
      </button>

      <button
        type="button"
        disabled={memoryPhotos.length === 0}
        onClick={() => setStep(4)}
        className="w-2/3 rounded-2xl bg-gradient-to-r from-[#ff6f70] to-[#ff9b58] px-4 py-4 font-bold text-white shadow-lg transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Continue to wishes ✨
      </button>

    </div>

  </div>
)}
    {/* STEP 4 - LETTER */}
{step === 4 && (
  <div className="mt-10 rounded-3xl border border-pink-100 bg-white/90 p-6 shadow-sm">

    {/* Heading */}
    <div className="mb-7 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-pink-400">
        STEP 4 OF 5
      </p>

      <h2 className="mt-3 text-3xl font-black text-[#3c2929]">
        Write from the{" "}
        <span className="font-light italic text-pink-500">
          heart
        </span>{" "}
        💌
      </h2>

      <p className="mt-2 text-sm leading-6 text-[#9b7b7f]">
        Say something they will want to remember forever.
      </p>
    </div>

    {/* Message Box */}
    <div className="rounded-3xl border border-pink-100 bg-[#fffaf9] p-4">

      <div className="mb-3 flex items-center justify-between">
        <label className="text-sm font-bold text-[#5a3e42]">
          Your message 💕
        </label>

        <span className="text-xs font-medium text-[#b89b9f]">
          {loveMessage.length}/1000
        </span>
      </div>

      <textarea
        value={loveMessage}
        onChange={(e) => {
          if (e.target.value.length <= 1000) {
            setLoveMessage(e.target.value);
          }
        }}
        placeholder="Write something from your heart..."
        rows={8}
        className="w-full resize-none rounded-2xl border border-pink-100 bg-white px-4 py-4 text-sm leading-7 text-[#4a3438] outline-none transition placeholder:text-[#c4aeb1] focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
      />

      <p className="mt-2 px-1 text-xs text-[#b89b9f]">
        💗 There are no perfect words. Just write what you truly feel.
      </p>

    </div>


    {/* MESSAGE SUGGESTIONS */}
    <div className="mt-7">

      <div className="mb-4 flex items-center justify-between">
        <p className="text-base font-bold text-[#6d4b51]">
          Need a little inspiration? ✨
        </p>

        <span className="text-xs text-[#b89b9f]">
          Choose one
        </span>
      </div>


      <div className="grid gap-4 sm:grid-cols-2">

        {/* Sweet & Romantic */}
        <button
          type="button"
          onClick={() =>
            setLoveMessage(
              "Happy Birthday, my love! You make every ordinary day feel special just by being there. Thank you for all the smiles, memories, and beautiful moments we share. I hope this year brings you everything your heart wishes for. No matter where life takes us, I’ll always be grateful to have you. ❤️"
            )
          }
          className="group rounded-3xl border border-pink-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-pink-300 hover:bg-pink-50/40 hover:shadow-md"
        >
          <div className="mb-3 flex items-center gap-2">
            <span className="text-2xl">💕</span>

            <span className="text-base font-bold text-[#5a3e42]">
              Sweet & Romantic
            </span>
          </div>

          <p className="text-sm leading-6 text-[#8f7075]">
            Happy Birthday, my love! You make every ordinary day feel special
            just by being there. Thank you for all the smiles, memories, and
            beautiful moments we share.
          </p>

          <p className="mt-4 text-sm font-bold text-pink-500 group-hover:text-pink-600">
            Use this message →
          </p>
        </button>


        {/* Deep & Emotional */}
        <button
          type="button"
          onClick={() =>
            setLoveMessage(
              "On your special day, I just want you to know how deeply you are loved. You have become such a beautiful part of my life, and every moment with you means more than words can say. I wish you endless happiness, peaceful days, and a lifetime filled with love, laughter, and unforgettable memories. ❤️"
            )
          }
          className="group rounded-3xl border border-pink-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-pink-300 hover:bg-pink-50/40 hover:shadow-md"
        >
          <div className="mb-3 flex items-center gap-2">
            <span className="text-2xl">💌</span>

            <span className="text-base font-bold text-[#5a3e42]">
              Deep & Emotional
            </span>
          </div>

          <p className="text-sm leading-6 text-[#8f7075]">
            On your special day, I just want you to know how deeply you are
            loved. You have become such a beautiful part of my life, and every
            moment with you means more than words can say.
          </p>

          <p className="mt-4 text-sm font-bold text-pink-500 group-hover:text-pink-600">
            Use this message →
          </p>
        </button>

      </div>
    </div>

    {/* Buttons */}
    <div className="mt-7 flex gap-3">

      <button
        type="button"
        onClick={() => setStep(3)}
        className="w-1/3 rounded-2xl border border-pink-200 bg-white px-4 py-4 font-bold text-[#9b6f77] transition hover:bg-pink-50"
      >
        ← Back
      </button>

      <button
        type="button"
        disabled={!loveMessage.trim()}
        onClick={() => setStep(5)}
        className="w-2/3 rounded-2xl bg-gradient-to-r from-[#ff6f70] to-[#ff9b58] px-4 py-4 font-bold text-white shadow-lg transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Continue to final ✨
      </button>

    </div>

  </div>
)}

{/* STEP 5 - CAKE */}
{step === 5 && (
  <div className="mt-10 rounded-3xl border border-pink-100 bg-white/90 p-6 shadow-sm">

    {/* Heading */}
    <div className="mb-7 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-pink-400">
        STEP 5 OF 5
      </p>

      <div className="mt-4 text-5xl">
        🎂
      </div>

      <h2 className="mt-3 text-3xl font-black text-[#3c2929]">
        Pick their{" "}
        <span className="font-light italic text-pink-500">
          cake
        </span>
      </h2>

      <p className="mt-2 text-sm leading-6 text-[#9b7b7f]">
        Choose a cake for their special day.
      </p>
    </div>


    {/* Cake Options */}
    <div className="space-y-4">

      {/* Midnight Chocolate */}
      <button
        type="button"
        onClick={() => setSelectedCake("chocolate")}
        className={`flex w-full items-center gap-5 rounded-3xl border-2 p-5 text-left transition ${
          selectedCake === "chocolate"
            ? "border-[#ff766b] bg-[#fff8f5] shadow-md"
            : "border-[#f3e5df] bg-[#fffdfb] hover:border-pink-200"
        }`}
      >
        <div className="relative flex h-24 w-28 shrink-0 items-center justify-center">

          {/* Candle */}
          <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2">
            <div className="relative">
              <div className="h-10 w-[6px] rounded-full bg-[#f5d6a5]" />

              {/* Flame */}
              <span className="absolute -top-5 left-1/2 h-5 w-3 -translate-x-1/2 animate-pulse rounded-[50%_50%_50%_50%] bg-gradient-to-t from-orange-500 via-yellow-300 to-yellow-100 shadow-[0_0_12px_4px_rgba(255,180,60,0.55)]" />
            </div>
          </div>

          {/* Cake */}
          <div className="absolute bottom-1 h-10 w-28 rounded-xl bg-[#4b211d] shadow-md" />
          <div className="absolute bottom-10 h-8 w-20 rounded-xl bg-[#6b3028]" />
        </div>

        <div>
          <h3 className="text-lg font-black text-[#3c2929]">
            Midnight Chocolate
          </h3>

          <p className="mt-1 text-sm text-[#8f7075]">
            Rich, dark & dreamy
          </p>
        </div>
      </button>


      {/* Strawberry Blush */}
      <button
        type="button"
        onClick={() => setSelectedCake("strawberry")}
        className={`flex w-full items-center gap-5 rounded-3xl border-2 p-5 text-left transition ${
          selectedCake === "strawberry"
            ? "border-[#ff766b] bg-[#fff8f5] shadow-md"
            : "border-[#f3e5df] bg-[#fffdfb] hover:border-pink-200"
        }`}
      >
        <div className="relative flex h-24 w-28 shrink-0 items-center justify-center">

          {/* Candle */}
          <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2">
            <div className="relative">
              <div className="h-10 w-[6px] rounded-full bg-[#f7d5e0]" />

              {/* Flame */}
              <span className="absolute -top-5 left-1/2 h-5 w-3 -translate-x-1/2 animate-pulse rounded-[50%_50%_50%_50%] bg-gradient-to-t from-orange-500 via-yellow-300 to-yellow-100 shadow-[0_0_12px_4px_rgba(255,180,60,0.55)]" />
            </div>
          </div>

          {/* Cake */}
          <div className="absolute bottom-1 h-10 w-28 rounded-xl bg-[#f18aae] shadow-md" />
          <div className="absolute bottom-10 h-8 w-20 rounded-xl bg-[#f7a9c3]" />
        </div>

        <div>
          <h3 className="text-lg font-black text-[#3c2929]">
            Strawberry Blush
          </h3>

          <p className="mt-1 text-sm text-[#8f7075]">
            Soft, sweet & rosy
          </p>
        </div>
      </button>


      {/* Vanilla Gold */}
      <button
        type="button"
        onClick={() => setSelectedCake("vanilla")}
        className={`flex w-full items-center gap-5 rounded-3xl border-2 p-5 text-left transition ${
          selectedCake === "vanilla"
            ? "border-[#ff766b] bg-[#fff8f5] shadow-md"
            : "border-[#f3e5df] bg-[#fffdfb] hover:border-pink-200"
        }`}
      >
        <div className="relative flex h-24 w-28 shrink-0 items-center justify-center">

          {/* Candle */}
          <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2">
            <div className="relative">
              <div className="h-10 w-[6px] rounded-full bg-[#f4dfaa]" />

              {/* Flame */}
              <span className="absolute -top-5 left-1/2 h-5 w-3 -translate-x-1/2 animate-pulse rounded-[50%_50%_50%_50%] bg-gradient-to-t from-orange-500 via-yellow-300 to-yellow-100 shadow-[0_0_12px_4px_rgba(255,180,60,0.55)]" />
            </div>
          </div>

          {/* Cake */}
          <div className="absolute bottom-1 h-10 w-28 rounded-xl bg-[#e9c878] shadow-md" />
          <div className="absolute bottom-10 h-8 w-20 rounded-xl bg-[#f3dda0]" />
        </div>

        <div>
          <h3 className="text-lg font-black text-[#3c2929]">
            Vanilla Gold
          </h3>

          <p className="mt-1 text-sm text-[#8f7075]">
            Classic, warm & glowing
          </p>
        </div>
      </button>

    </div>


   <button
  type="button"
  disabled={isSavingSurprise}
  onClick={async () => {
    // Stop audio before creating the surprise
    audioRef.current?.pause();
    audioRef.current = null;
    setPlayingSong("");

    // Show Processing immediately
    setIsSavingSurprise(true);
    setShowCakeBuild(true);

    try {
      // Upload all photos at the same time
      const uploadedPhotoUrls = await Promise.all(
        memoryPhotoFiles.map(async (file) => {
          const extension = file.name.includes(".")
            ? file.name.split(".").pop()
            : "jpg";

          const fileName = `memory-${crypto.randomUUID()}.${extension}`;

          const { error: uploadError } = await supabase.storage
            .from("memories")
            .upload(fileName, file, {
              contentType: file.type,
              upsert: false,
            });

          if (uploadError) {
            console.error("Photo upload error:", uploadError);
            throw uploadError;
          }

          const { data: publicUrlData } = supabase.storage
            .from("memories")
            .getPublicUrl(fileName);

          return publicUrlData.publicUrl;
        })
      );

      // Save surprise information in Supabase
      const { data, error } = await supabase
        .from("surprises")
        .insert({
          name: name.trim(),
          age: age ? Number(age) : null,
          birthday: birthday || null,
          sender_name: senderName.trim(),
          love_message: loveMessage.trim(),
          selected_song: selectedSong,
          selected_cake: selectedCake,
          photos: uploadedPhotoUrls,
        })
        .select("id")
        .single();

      if (error) {
        console.error("Supabase save error:", error);
        throw error;
      }

      console.log("Surprise created with ID:", data.id);

      // Save the unique surprise ID
      setCreatedSurpriseId(data.id.toString());

      // Use permanent Supabase URLs for the creator preview too
      setMemoryPhotos(uploadedPhotoUrls);

      // Saving is complete
      setIsSavingSurprise(false);
    } catch (error) {
      console.error("Create surprise error:", error);

      setIsSavingSurprise(false);
      setShowCakeBuild(false);

      alert(
        "Something went wrong while creating your surprise. Please try again ❤️"
      );
    }
  }}
  className="mx-auto mt-6 block w-2/3 rounded-2xl bg-gradient-to-r from-[#ff6f70] to-[#ff9b58] px-4 py-4 text-center font-bold text-white shadow-lg transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
>
  {isSavingSurprise ? "Creating your surprise..." : "Create Surprise ✨"}
</button>
        {/* Copyright Footer */}
        <footer className="mt-8 border-t border-[#ead9da] pt-5 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8f656d]">
            Copyright Policy
          </p>
          <p className="mt-2 text-xs text-[#9f858a]">
            © 2026 Anubhav, All Rights Reserved
          </p>
          <p className="mt-1 text-[11px] text-[#b89b9f]">
            This website is designed and developed by Anubhav.
          </p>
        </footer>

      </div>
    )}

    </div>
    </section>
  )}

{showCakeBuild && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#fff4ef] px-4">

    <div className="w-full max-w-md rounded-[32px] border border-[#f0d8cf] bg-white p-7 shadow-[0_25px_80px_rgba(180,90,100,0.18)]">
      <div className="mb-7 text-center">
        <div className="text-5xl">🎂</div>

        <h2 className="mt-5 text-2xl font-black text-[#4b3030]">
          Crafting {name || "your"}'s surprise...
        </h2>

        <p className="mt-2 text-sm text-[#9b7777]">
          Putting every little detail together 💕
        </p>
      </div>

      <div className="space-y-3">
        {[
          `Baking the ${selectedCake === "strawberry" ? "Strawberry Blush" : selectedCake === "chocolate" ? "Midnight Chocolate" : "Vanilla Gold"} 🎂`,
          `Lighting candles for turning ${age || "your special age"} 🕯️`,
          `Filling ${memoryPhotos.length} balloons with your words 🎈`,
          `Hanging ${memoryPhotos.length} memories on fairy lights 📸`,
          `Sealing your letter inside the card 💌`,
          `Signed with love — ${senderName || "you"} ✍️`,
        ].map((text, index) => {
          const done =
            index < 5
              ? craftingStep > index
              : craftingStep >= 5;

          const active = craftingStep === index;

          return (
            <div
              key={index}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-500 ${
                active
                  ? "bg-[#fff4ed] scale-[1.01]"
                  : "bg-[#fffaf8]"
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-500 ${
                  done
                    ? "bg-gradient-to-r from-[#ff9b58] to-[#ff6f70] text-white"
                    : active
                    ? "border-2 border-[#ff9b58] bg-white text-[#ff9b58]"
                    : "border-2 border-[#f0ddd7] bg-white text-[#c9aaa3]"
                }`}
              >
                {done ? "✓" : active ? "✦" : index + 1}
              </div>

              <p
                className={`text-sm font-semibold ${
                  done ? "text-[#5a3b3b]" : "text-[#a88a86]"
                }`}
              >
                {text}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-7">
        <div className="h-3 overflow-hidden rounded-full bg-[#f5e5de]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#ffb347] to-[#ff6f70] transition-all duration-700"
            style={{
              width: `${(craftingStep / 5) * 100}%`,
            }}
          />
        </div>
      </div>

    </div>
  </div>
)}

{showShareScreen && (
  <div className="fixed inset-0 z-[999999] flex min-h-screen items-center justify-center bg-[#120b10] px-5">
    <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-white/[0.06] p-7 text-center shadow-2xl backdrop-blur-xl">
      
      <div className="mb-5 text-5xl">🎁</div>

      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d8a7b5]">
        Your surprise is ready
      </p>

      <h1 className="mt-3 text-3xl font-semibold text-white">
        Share the magic ✨
      </h1>

      <p className="mt-3 text-sm leading-6 text-white/60">
        Your birthday surprise has been created.
        Share this link with someone special.
      </p>

      <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-3">
        <p className="break-all text-xs leading-5 text-white/70">
          {typeof window !== "undefined" && createdSurpriseId
            ? `${window.location.origin}/surprise/${createdSurpriseId}`
            : ""}
        </p>
      </div>

      <button
        onClick={async () => {
          if (!createdSurpriseId) return;

          const link = `${window.location.origin}/surprise/${createdSurpriseId}`;

          try {
            await navigator.clipboard.writeText(link);
            alert("Surprise link copied! ❤️");
          } catch {
            alert("Please copy the link manually ❤️");
          }
        }}
        className="mt-5 w-full rounded-2xl bg-[#d99aaa] px-5 py-3.5 text-sm font-semibold text-white shadow-lg transition active:scale-[0.98]"
      >
        Copy Surprise Link 🔗
      </button>

      <button
        onClick={() => {
          setShowShareScreen(false);
          setShowSurprise(true);
        }}
        className="mt-3 w-full rounded-2xl border border-white/15 px-5 py-3.5 text-sm font-medium text-white/80 transition active:scale-[0.98]"
      >
        Preview Surprise ✨
      </button>

    </div>
  </div>
)}

{showSurprise && !showBirthdayTree && (
  <ArcheryScene
    name={name}
    age={age}
    birthday={birthday}
    onStartMusic={startSelectedSong}
    onComplete={() => {
      setShowSurprise(false);
      setShowBirthdayTree(true);
    }}
  />
)}

{showBirthdayTree && (
  <BirthdayTreeScene
    name={name}
    age={age}
    birthday={birthday}
    onComplete={() => {
      setShowBirthdayTree(false);
      setShowMemoryLane(true);
    }}
  />
)}

{showMemoryLane && (
  <MemoryLaneScene
    photos={memoryPhotos}
    onComplete={() => {
      setShowMemoryLane(false);
      setShowCakeScene(true);
    }}
  />
)}

{showCakeScene && (
  <CakeScene
    cake={selectedCake}
    name={name}
    age={age}
    onComplete={() => {
      setShowCakeScene(false);
      setShowLetterScene(true);
    }}
  />
)}

{showLetterScene && (
  <LetterScene
    name={name}
    note={loveMessage}
    senderName={senderName}
    onComplete={() => {
      setShowLetterScene(false);
      setShowFinalScene(true);
    }}
  />
)}

{showFinalScene && (
  <FinalSurpriseScene
    name={name}
    senderName={senderName}
    age={age}
    birthday={birthday}
  />
)}

</main>

);
}