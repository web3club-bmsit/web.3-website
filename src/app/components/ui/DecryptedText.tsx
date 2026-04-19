"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";

type Props = {
  text: string;
  speed?: number;
  maxIterations?: number;
  characters?: string;
  className?: string;
  encryptedClassName?: string;
  parentClassName?: string;
};

export default function DecryptedText({
  text,
  speed = 50,
  maxIterations = 10,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+",
  className = "",
  encryptedClassName = "",
  parentClassName = "",
}: Props) {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const availableChars = useMemo(() => characters.split(""), [characters]);

  const scramble = useCallback(
    (original: string) =>
      original
        .split("")
        .map((c) =>
          c === " "
            ? " "
            : availableChars[Math.floor(Math.random() * availableChars.length)]
        )
        .join(""),
    [availableChars]
  );

  // Trigger on viewport entry
  useEffect(() => {
    if (hasAnimated) return;
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setIsAnimating(true);
            setHasAnimated(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasAnimated]);

  // Scramble loop
  useEffect(() => {
    if (!isAnimating) return;
    let iteration = 0;

    intervalRef.current = setInterval(() => {
      setDisplayText(scramble(text));
      iteration++;
      if (iteration >= maxIterations) {
        clearInterval(intervalRef.current!);
        setIsAnimating(false);
        setDisplayText(text);
      }
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAnimating, text, speed, maxIterations, scramble]);

  return (
    <span
      ref={containerRef}
      className={parentClassName}
      style={{ display: "inline-block", whiteSpace: "pre-wrap" }}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {displayText.split("").map((char, i) => (
          <span
            key={i}
            className={!isAnimating ? className : encryptedClassName || className}
          >
            {char}
          </span>
        ))}
      </span>
    </span>
  );
}
