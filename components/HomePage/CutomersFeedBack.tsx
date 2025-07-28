"use client";
import React, { useState, useEffect, useRef } from "react";

const CustomerFeedback = () => {
  const [visibleCards, setVisibleCards] = useState(new Set<number>());
  const [scrollY, setScrollY] = useState(0);
  const [textVisible, setTextVisible] = useState(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textRef = useRef<HTMLDivElement | null>(null);

  const feedbackData = [
    {
      name: "Jim Kring",
      feedback:
        "Great software! Deploying from Docker Compose is a breeze, and the UI is simple yet powerful—I’d give it 6/5 stars if I could.",
    },
    {
      name: "Kamal Panara",
      feedback:
        "Amazing and easy to use! Hawiyat made my app and website deployment effortless.",
    },
    {
      name: "Théo Dulieu",
      feedback:
        "As a PHP developer using Docker, I’m impressed—supports Nixpacks, Buildpacks, custom Dockerfiles, and full Compose out of the box.",
    },
    {
      name: "Moonou Long",
      feedback:
        "Lightweight and intuitive: the UI and deployment process hit the perfect balance—I’ve been running multiple Next.js apps smoothly for months.",
    },
    {
      name: "StuttgarterDotNet",
      feedback:
        "I switched from Coolify—Hawiyat’s UI feels more intuitive and developer‑focused, making container and multi‑server management a joy.",
    },
    {
      name: "benbristow",
      feedback:
        "Similar to Vercel but with a slick web UI and built‑in Let’s Encrypt support—makes deploying Docker solutions so much easier.",
    },
  ];

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const textObserver = new IntersectionObserver(
      ([entry]) => setTextVisible(entry.isIntersecting),
      { threshold: 0.001, rootMargin: "0px 0px -100px 0px" }
    );
    if (textRef.current) textObserver.observe(textRef.current);

    const observers = cardRefs.current.map((ref, index) => {
      if (!ref) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          setVisibleCards((prev) => {
            const newSet = new Set(prev);
            entry.isIntersecting ? newSet.add(index) : newSet.delete(index);
            return newSet;
          });
        },
        { threshold: 0.001, rootMargin: "-50px 0px -50px 0px" }
      );
      obs.observe(ref);
      return obs;
    });

    return () => {
      textObserver.disconnect();
      observers.forEach((o) => o?.disconnect());
    };
  }, []);

  return (
    <div className="relative bg-black min-h-screen py-20 overflow-hidden">
      {/* Parallax blobs */}
      <div
        className="absolute inset-0 opacity-10 transform transition-transform duration-700 ease-out"
        style={{ transform: `translateY(${scrollY * 0.2}px)` }}
      >
        <div className="absolute top-32 left-16 w-72 h-72 bg-gradient-to-br from-blue-500/15 to-purple-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-32 right-24 w-80 h-80 bg-gradient-to-br from-purple-500/15 to-pink-500/15 rounded-full blur-3xl" />
      </div>

      <main className="relative z-10 flex flex-col items-center justify-start min-h-[90vh] px-6 text-center">
        <div className="max-w-6xl mx-auto space-y-8 md:space-y-12">
          {/* Heading */}
          <div
            ref={textRef}
            className={`space-y-6 text-start transition-all duration-700 ease-out ${
              textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
            style={{ transform: `translateY(${Math.min(scrollY * 0.03, 40)}px)` }}
          >
            <h1
              className={`text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight transition-all duration-1000 ease-out ${
                textVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              {["Our", "customer", "feedback"].map((word, idx) => (
                <span
                  key={idx}
                  className={`inline-block mr-4 transition-all duration-800 ease-out ${
                    textVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                  }`}
                  style={{ transitionDelay: textVisible ? `${idx * 200}ms` : "0ms" }}
                >
                  <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                    {word}
                  </span>
                </span>
              ))}
            </h1>
          </div>

          {/* Feedback cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-32">
            {feedbackData.map((item, index) => (
              <div
                key={index}
                ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                className={`relative rounded-lg p-6 text-left cursor-default
                  transform transition-all duration-200 ease-out
                  ${
                    visibleCards.has(index)
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-12"
                  }`}
                style={{
                  transitionDelay: `${visibleCards.has(index) ? index * 150 : 0}ms`,
                  transform: visibleCards.has(index)
                    ? `translateY(${-Math.min(scrollY * 0.01 * (index + 1), 20)}px)`
                    : "translateY(12px)",
                }}
              >
                <div className="relative z-10">
                  <div
                    className={`text-white/70 text-lg font-medium mb-4 transition-all duration-700 ease-out ${
                      visibleCards.has(index)
                        ? "translate-x-0 opacity-100"
                        : "translate-x-4 opacity-0"
                    }`}
                    style={{
                      transitionDelay: `${visibleCards.has(index) ? index * 150 + 200 : 0}ms`,
                    }}
                  >
                    {item.name}
                  </div>
                  <p
                    className={`text-white font-extrabold text-2xl leading-relaxed transition-all duration-800 ease-out ${
                      visibleCards.has(index)
                        ? "translate-x-0 opacity-100"
                        : "translate-x-6 opacity-0"
                    }`}
                    style={{
                      transitionDelay: `${visibleCards.has(index) ? index * 150 + 400 : 0}ms`,
                    }}
                  >
                    {item.feedback}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerFeedback;
