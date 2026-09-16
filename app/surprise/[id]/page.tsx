"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

import ArcheryScene from "@/components/ArcheryScene";
import BirthdayTreeScene from "@/components/BirthdayTreeScene";
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

type Surprise = {
  id: number;
  name: string;
  age: number | null;
  birthday: string | null;
  sender_name: string;
  love_message: string;
  selected_song: string;
  selected_cake: string;
  photos: string[];
};

export default function SurprisePage() {
  const params = useParams();
  const id = params.id as string;

  const [surprise, setSurprise] = useState<Surprise | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [showArchery, setShowArchery] = useState(true);
  const [showBirthdayTree, setShowBirthdayTree] = useState(false);
  const [showMemoryLane, setShowMemoryLane] = useState(false);
  const [showCakeScene, setShowCakeScene] = useState(false);
  const [showLetterScene, setShowLetterScene] = useState(false);
  const [showFinalScene, setShowFinalScene] = useState(false);

const startSelectedSong = async () => {
  const src = musicFiles[surprise?.selected_song || ""];

  if (!src) return;

  const audio = new Audio(src);
  audio.loop = true;

  try {
    await audio.play();
  } catch (error) {
    console.error("Music playback error:", error);
  }
};


  useEffect(() => {
    const loadSurprise = async () => {
      const { data, error } = await supabase
        .from("surprises")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error("Surprise load error:", error);
        setErrorMessage("This surprise could not be found 💔");
        setLoading(false);
        return;
      }

     const normalizedPhotos = Array.isArray(data.photos)
  ? data.photos.filter(
      (photo: unknown): photo is string =>
        typeof photo === "string" &&
        photo.trim().length > 0 &&
        !photo.startsWith("blob:")
    )
  : [];

setSurprise({
  ...data,
  photos: normalizedPhotos,
});

setLoading(false);
    };

    if (id) {
      loadSurprise();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fff8f5] px-6 text-center">
        <div>
          <div className="mb-5 text-5xl animate-pulse">💌</div>
          <h1 className="text-2xl font-black text-[#4b3030]">
            Opening your surprise...
          </h1>
          <p className="mt-2 text-sm text-[#9b7777]">
            Just a little magic ✨
          </p>
        </div>
      </main>
    );
  }

  if (errorMessage || !surprise) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fff8f5] px-6 text-center">
        <div>
          <div className="mb-5 text-5xl">💔</div>
          <h1 className="text-2xl font-black text-[#4b3030]">
            Surprise not found
          </h1>
          <p className="mt-2 text-sm text-[#9b7777]">
            The link may be incorrect or unavailable.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {showArchery && (
        <ArcheryScene
          name={surprise.name}
          age={surprise.age?.toString() || ""}
          birthday={surprise.birthday || ""}
          onStartMusic={startSelectedSong}
          onComplete={() => {
            setShowArchery(false);
            setShowBirthdayTree(true);
          }}
        />
      )}

      {showBirthdayTree && (
        <BirthdayTreeScene
          name={surprise.name}
          age={surprise.age?.toString() || ""}
          birthday={surprise.birthday || ""}
          onComplete={() => {
            setShowBirthdayTree(false);
            setShowMemoryLane(true);
          }}
        />
      )}

      {showMemoryLane && (
        <MemoryLaneScene
          photos={surprise.photos || []}
          onComplete={() => {
            setShowMemoryLane(false);
            setShowCakeScene(true);
          }}
        />
      )}

      {showCakeScene && (
        <CakeScene
          cake={surprise.selected_cake}
          name={surprise.name}
          age={surprise.age?.toString() || ""}
          onComplete={() => {
            setShowCakeScene(false);
            setShowLetterScene(true);
          }}
        />
      )}

      {showLetterScene && (
        <LetterScene
          name={surprise.name}
          note={surprise.love_message}
          senderName={surprise.sender_name}
          onComplete={() => {
            setShowLetterScene(false);
            setShowFinalScene(true);
          }}
        />
      )}

      {showFinalScene && (
        <FinalSurpriseScene
          name={surprise.name}
          senderName={surprise.sender_name}
          age={surprise.age?.toString() || ""}
          birthday={surprise.birthday || ""}
        />
      )}
    </main>
  );
}