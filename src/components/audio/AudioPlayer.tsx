"use client";
import { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="absolute top-2 right-2 flex items-center">
      <audio ref={audioRef} loop>
        <source
          src="/assets/audio/battleship-ost-funut.mp3"
          type="audio/mpeg"
        />
      </audio>
      <i className="text-sm">
        music by{" "}
        <a
          href="https://scratch.mit.edu/users/funut/"
          className="underline"
          target="_blank"
        >
          @funut
        </a>
      </i>
      <button onClick={togglePlay} className="p-2">
        {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>
    </div>
  );
}