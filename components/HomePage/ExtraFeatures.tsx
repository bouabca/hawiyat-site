"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

export default function ExtraFeatures() {
  const [visibleCards, setVisibleCards] = useState(new Set());
  const [scrollY, setScrollY] = useState(0);
  const [textVisible, setTextVisible] = useState(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const textObserver = new IntersectionObserver(
      ([entry]) => {
        setTextVisible(entry.isIntersecting);
      },
      { threshold: 0.0001, rootMargin: "0px 0px -100px 0px" }
    );

    if (textRef.current) textObserver.observe(textRef.current);

    const observers = cardRefs.current.map((ref, index) => {
      if (!ref) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          setVisibleCards(prev => {
            const newSet = new Set(prev);
            if (entry.isIntersecting) newSet.add(index);
            else newSet.delete(index);
            return newSet;
          });
        },
        { threshold: 0.3, rootMargin: "-50px 0px -50px 0px" }
      );
      observer.observe(ref);
      return observer;
    });

    return () => {
      textObserver.disconnect();
      observers.forEach(obs => obs?.disconnect());
    };
  }, []);

  return (
    <div className=" bg-black text-white relative overflow-hidden">
      {/* Parallax background elements */}
      <div
        className="absolute inset-0 opacity-10"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      >
        <div className="absolute top-20 left-10 w-58 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-96 right-20 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10 py-12 lg:py-20">
       

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div
            ref={el => {
                cardRefs.current[0] = el;
            }}
              className={`bg-transparent  rounded-xl p-6 h-[600px] flex flex-col transition-all duration-700 ease-out hover:bg-zinc-900/20 hover:border-zinc-700/50 ${
              visibleCards.has(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              transitionDelay: visibleCards.has(0) ? '0ms' : '0ms',
              transform: `translateY(${visibleCards.has(0) ? -Math.min(scrollY * 0.02, 30) : 8}px)`
            }}
          >
            <div className="flex justify-center mb-18">
              <div className="w-58 h-58" style={{ transform: `translateY(${Math.min(scrollY * 0.015, 20)}px)` }}>
                <Image src="/suport.png" alt="Deploy your AI agent" width={192} height={192} className="rounded-xl w-full h-full object-cover" priority />
              </div>
            </div>
            <div className="flex flex-col flex-grow justify-center text-start mt-auto">
              <h3 className="text-xl  sm:text-3xl font-semibold mb-4 text-white leading-tight">
               247 customer support
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
              Share your work like it's already in
                production and test changes
                without leaving the browser. Edit
                content directly inside Preview
                Deployments.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div
           ref={el => {
            cardRefs.current[1] = el;
          }}
          
            className={`bg-transparent border-r border-l  lg:border-zinc-700/50 rounded-xl p-6 h-[600px] flex flex-col transition-all duration-700 ease-out hover:bg-zinc-900/20 hover:border-zinc-700/50 ${
              visibleCards.has(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              transitionDelay: visibleCards.has(1) ? '150ms' : '0ms',
              transform: `translateY(${visibleCards.has(1) ? -Math.min(scrollY * 0.03, 30) : 8}px)`
            }}
          >
            <div className="flex justify-center mb-20">
              <div className="w-58 h-62" style={{ transform: `translateY(${Math.min(scrollY * 0.025, 20)}px)` }}>
                <Image src="/collab.png" alt="Compatible with any framework" width={192} height={192} className="rounded-xl w-full h-full object-cover" priority />
              </div>
            </div>
            <div className="flex flex-col flex-grow justify-center text-start mt-auto">
              <h3 className="text-xl  sm:text-3xl font-semibold mb-4 text-white leading-tight">
              Collaboration
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
              Deliver expert work faster by
                bringing collaborators together
                from anywhere in the organization.
                Comment directly on copy and
                designs as you review from your
                user's point of view.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div
            ref={el => {
                cardRefs.current[2] = el;
            }}
          
            className={`bg-transparent  rounded-xl p-6 h-[600px] flex flex-col transition-all duration-700 ease-out hover:bg-zinc-900/20 hover:border-zinc-700/50 ${
              visibleCards.has(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              transitionDelay: visibleCards.has(2) ? '300ms' : '0ms',
              transform: `translateY(${visibleCards.has(2) ? -Math.min(scrollY * 0.04, 30) : 8}px)`
            }}
          >
            <div className="flex justify-center mb-10">
              <div className="w-60 h-65" style={{ transform: `translateY(${Math.min(scrollY * 0.035, 20)}px)` }}>
                <Image src="/migrate.png" alt="Deploy any complex app" width={192} height={192} className="rounded-xl w-full h-full object-cover" priority />
              </div>
            </div>
            <div className="flex flex-col flex-grow justify-center text-start mt-auto">
              <h3 className="text-xl  sm:text-3xl font-semibold mb-4 text-white leading-tight">
              Easy to migrate
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
              Fast builds mean anyone can
                iterate at any time. Instant
                rollbacks keep breaking changes a
                click away from being fixed. Go
                ahead, deploy on Fridays.
              </p>
            </div>
          </div>
     {/* Left grid mesh */}
<div className="absolute left-[1000px] -top-[200px]  z-[0] opacity-30 md:opacity-100 w-[1000px] h-[1000px]">
  <img
    className="w-full h-full object-cover"
    src="/grid-mesh.svg"
    width={1000}
    height={1000}
    alt="Grid mesh left"
  />
</div>

{/* Right grid mesh */}
<div className="absolute right-[1000px] -top-[200px]  z-[0] opacity-30 md:opacity-100 w-[1000px] h-[1000px]">
  <img
    className="w-full h-full object-cover"
    src="/grid-mesh.svg"
    width={1000}
    height={1000}
    alt="Grid mesh right"
  />
</div>

        </section>
      </div>
    </div>
  );
}