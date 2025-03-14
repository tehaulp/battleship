"use client";

import { useEffect, useRef } from "react";
import { StageManager } from "@/lib/StageManager";
import Image from "next/image";

export default function Stage() {
  const navyElementRef = useRef<HTMLDivElement>(null);
  const pirateElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    StageManager.init(navyElementRef, pirateElementRef);
  }, []);

  return (
    <div className="absolute w-full h-full overflow-hidden pointer-events-none">
      <div ref={navyElementRef} className="absolute bottom-0 left-10 flex opacity-0">
        <Image src="/img/navy-idle.png" alt="navy character idling" width={935} height={1400} className="h-[30rem] w-fit"/>
        <p className="mt-[5rem] text-2xl h-fit p-2"></p>
      </div>

      <div ref={pirateElementRef} className="absolute bottom-0 right-10 flex opacity-0">
        <p className="mt-[5rem] text-2xl h-fit p-2"></p>
        <Image src="/img/pirate-idle.png" alt="pirate character idling" width={1012} height={1450}className="h-[30rem] w-fit" />
      </div>
    </div>
  );
}