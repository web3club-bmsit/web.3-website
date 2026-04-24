"use client";

import { useState } from "react";
import Preloader from "./Preloader";

export default function PreloaderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <Preloader onComplete={() => setLoaded(true)} />}
      <div
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      >
        {children}
      </div>
    </>
  );
}
