"use client";

import { useState } from "react";
import Image from "next/image";

function Placeholder() {
  return (
    <div className="flex items-center justify-center bg-muted text-muted-foreground text-xs text-center p-2 w-full h-full">
      No poster
    </div>
  );
}

export default function PosterImage({ src, alt }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) return <Placeholder />;

  return (
    <Image
      src={src}
      alt={alt}
      width={300}
      height={450}
      onError={() => setFailed(true)}
    />
  );
}
