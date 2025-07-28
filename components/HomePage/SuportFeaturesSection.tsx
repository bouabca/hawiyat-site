"use client"
import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, BarChart3, RefreshCw, Database, Code, Settings, Eye, Shield, Box, Bot } from 'lucide-react';

export default function UnifiedSupportFeatures() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [supportVisible, setSupportVisible] = useState(false);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [windowWidth, setWindowWidth] = useState(0);
  
  const supportRef = useRef(null);
  const featuresRef = useRef(null);

  const features = [
    {
      icon: <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7" />,
      title: "Global Edge Network",
      description: "Deploy your applications to our global edge network for fast performance worldwide."
    },
    {
      icon: <RefreshCw className="w-6 h-6 sm:w-7 sm:h-7" />,
      title: "Continuous Deployment",
      description: "Automatically deploy your latest code with every push to your connected repository."
    },
    {
      icon: <Database className="w-6 h-6 sm:w-7 sm:h-7" />,
      title: "Managed Databases",
      description: "Easily provision and securely manage scalable databases for your applications."
    },
    {
      icon: <Code className="w-6 h-6 sm:w-7 sm:h-7" />,
      title: "Serverless Functions",
      description: "Build and deploy serverless functions that scale automatically with your traffic."
    },
    {
      icon: <Settings className="w-6 h-6 sm:w-7 sm:h-7" />,
      title: "Environment Variables",
      description: "Securely manage environment variables and secrets for your applications."
    },
    {
      icon: <Eye className="w-6 h-6 sm:w-7 sm:h-7" />,
      title: "Preview Deployments",
      description: "Automatically generate preview environments for every pull request efficiently and reliably."
    },
    {
      icon: <Shield className="w-6 h-6 sm:w-7 sm:h-7" />,
      title: "DDoS Protection",
      description: "Enterprise-grade security with advanced DDoS mitigation to keep your applications safe and running."
    },
    {
      icon: <Box className="w-6 h-6 sm:w-7 sm:h-7" />,
      title: "Containerization",
      description: "Deploy your applications in isolated containers for better resource utilization and security."
    },
    {
      icon: <Bot className="w-6 h-6 sm:w-7 sm:h-7" />,
      title: "AI Deployment Agent",
      description: "Intelligent AI assistant that helps optimize deployments and troubleshoot issues automatically."
    }
  ];

  useEffect(() => {
    setMounted(true);
    setWindowWidth(window.innerWidth);
    
    const handleMouseMove = (e: MouseEvent) => {
      // Only track mouse on desktop/tablet
      if (window.innerWidth >= 768) {
        setMousePosition({ 
          x: (e.clientX / window.innerWidth) * 100,
          y: (e.clientY / window.innerHeight) * 100
        });
      }
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const supportObserver = new IntersectionObserver(
      ([entry]) => {
        setSupportVisible(entry.isIntersecting);
      },
      { threshold: 0.2, rootMargin: '0px 0px -20px 0px' }
    );

    const featuresObserver = new IntersectionObserver(
      ([entry]) => {
        setFeaturesVisible(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (supportRef.current) supportObserver.observe(supportRef.current);
    if (featuresRef.current) featuresObserver.observe(featuresRef.current);

    return () => {
      supportObserver.disconnect();
      featuresObserver.disconnect();
    };
  }, [mounted]);

  const getParallaxOffset = (speed = 1) => {
    // Reduce parallax effect on mobile
    const multiplier = windowWidth < 768 ? 0.2 : 0.5;
    return scrollY * speed * multiplier;
  };

  const isMobile = windowWidth < 768;

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="bg-black relative overflow-visible min-h-screen">
      {/* Unified Background Elements */}
      <div className="absolute inset-0 overflow-visible pointer-events-none">
        {/* Floating Elements - Hidden on mobile for performance */}
        {!isMobile && (
          <>
            <div 
              className="absolute top-20 left-4 sm:left-20 w-12 h-12 sm:w-16 sm:h-16 border-2 border-cyan-400/40 rounded-full"
              style={{
                transform: `translate(${getParallaxOffset(0.3)}px, ${getParallaxOffset(-0.2)}px) rotate(${scrollY * 0.5}deg)`,
              }}
            />
            
            <div 
              className="absolute top-32 right-4 sm:right-32 w-8 h-8 sm:w-12 sm:h-12 border-2 border-teal-500/40"
              style={{
                transform: `translate(${getParallaxOffset(-0.2)}px, ${getParallaxOffset(0.3)}px) rotate(${45 + scrollY * -0.3}deg)`,
              }}
            />
          </>
        )}
      </div>

      {/* Support Section */}
      <section 
        ref={supportRef}
        className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 py-16 sm:py-20"
      >
        <div className="max-w-5xl mx-auto space-y-8 sm:space-y-12 text-center">
          <div className="space-y-6 sm:space-y-8">
            <h2 
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white transition-all duration-700 ease-out leading-tight"
              style={{
                transform: supportVisible ? 'translateY(0px)' : 'translateY(30px)',
                opacity: supportVisible ? 1 : 0,
              }}
            >
              <span 
                className="block mb-2 sm:mb-4 transition-all duration-700 ease-out"
                style={{
                  transform: supportVisible ? 'translateX(0px)' : 'translateX(-20px)',
                  transitionDelay: '0.1s'
                }}
              >
                Out-of-the-box
              </span>
              <span 
                className="support-gradient-text inline-block transition-all duration-700 ease-out"
                style={{
                  transform: supportVisible ? 'translateX(0px) scale(1)' : 'translateX(20px) scale(0.95)',
                  transitionDelay: '0.2s'
                }}
              >
                support.
              </span>
            </h2>

            <p 
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/70 max-w-4xl mx-auto leading-relaxed px-2 transition-all duration-700 ease-out"
              style={{
                transform: supportVisible ? 'translateY(0px)' : 'translateY(20px)',
                opacity: supportVisible ? 1 : 0,
                transitionDelay: '0.3s'
              }}
            >
              No company in the world is more integrated with the creators of both Docker and Kubernetes 
              than Hawiyat. Understanding the challenges of high-performance teams and 
              applications is our primary role.
            </p>
          </div>
                      
          <div 
            className="flex flex-col gap-4 sm:flex-row sm:gap-6 justify-center transition-all duration-700 ease-out px-2"
            style={{
              transform: supportVisible ? 'translateY(0px) scale(1)' : 'translateY(25px) scale(0.98)',
              opacity: supportVisible ? 1 : 0,
              transitionDelay: '0.4s'
            }}
          >
            <button 
              className="group w-full sm:w-auto h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg font-medium bg-gradient-to-r from-cyan-400 to-teal-500 hover:from-cyan-300 hover:to-teal-400 text-slate-900 rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                Get Started
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </button>
            <button 
              className="group w-full sm:w-auto h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg border-2 border-white/30 hover:border-white/50 text-white hover:bg-white/5 bg-transparent backdrop-blur-sm rounded-2xl transition-all duration-300 hover:scale-105"
            >
              Contact Support
            </button>
          </div>
        </div>
      </section>

      {/* Decorative Background Between Sections */}
      <div className="relative bottom-[200px] sm:bottom-[300px] z-0 w-full h-0 pointer-events-none">
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-full h-auto max-w-[2000px] aspect-[3/2]"
            style={{
              opacity: 0,
              transform: 'translateY(30px) scale(0.95)',
              filter: 'drop-shadow(0 0 0px rgba(6,182,212,0))',
              animation: 'ellipse-opacity-reveal 3s ease-out 0.2s both, ellipse-gentle-float 6s ease-in-out infinite 3.2s',
              background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 3000 2000\'%3E%3Cpath d=\'M0,1000 Q750,400 1500,1000 T3000,1000\' fill=\'none\' stroke=\'%2306b6d4\' stroke-width=\'2\' opacity=\'0.3\'/%3E%3C/svg%3E") center/contain no-repeat'
            }}
          />
        </div>
      </div>

      {/* Features Section */}
      <section 
        ref={featuresRef}
        className="relative overflow-hidden w-full z-10 py-16 sm:py-20 px-4"
      >
        <div className="absolute z-[0] mx-auto top-0 h-full w-full">
          <div
            className="w-full h-full opacity-30 sm:opacity-50"
            style={{
              background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Cdefs%3E%3Cpattern id=\'grid\' width=\'10\' height=\'10\' patternUnits=\'userSpaceOnUse\'%3E%3Cpath d=\'M 10 0 L 0 0 0 10\' fill=\'none\' stroke=\'%23374151\' stroke-width=\'0.5\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'100\' height=\'100\' fill=\'url(%23grid)\'/%3E%3C/svg%3E") repeat'
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative p-6 sm:p-8 transition-all duration-700 cursor-pointer overflow-hidden rounded-2xl ${
                  featuresVisible ? 'animate-slide-in-up' : 'opacity-0 translate-y-10'
                }`}
                style={{
                  animationDelay: featuresVisible ? `${0.1 * index}s` : '0s',
                  transform: !isMobile && hoveredCard === index 
                    ? `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px) scale(1.02)` 
                    : 'translate(0, 0) scale(1)',
                }}
                onMouseEnter={() => !isMobile && setHoveredCard(index)}
                onMouseLeave={() => !isMobile && setHoveredCard(null)}
              >
                {/* Enhanced hover background */}
                <div 
                  className={`absolute inset-0 rounded-2xl transition-all duration-700 ${
                    hoveredCard === index 
                      ? 'bg-gradient-to-br from-white/10 via-cyan-400/5 to-teal-500/10 backdrop-blur-sm' 
                      : 'bg-transparent'
                  }`}
                />
                
                {/* Animated border */}
                <div 
                  className={`absolute inset-0 rounded-2xl transition-all duration-700 border ${
                    hoveredCard === index 
                      ? 'border-cyan-400/30 shadow-lg shadow-cyan-400/10' 
                      : 'border-transparent'
                  }`}
                />

                {/* Icon Container */}
                <div className="relative z-10 mb-4 sm:mb-6 p-3 sm:p-4 w-fit rounded-2xl bg-black/40 border border-gray-800/50 backdrop-blur-sm group-hover:border-cyan-400/30 group-hover:bg-black/60 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-cyan-400/10">
                  <div className="text-gray-300 group-hover:text-cyan-400 transition-colors duration-300">
                    {feature.icon}
                  </div>
                </div>

                {/* Title */}
                <h3 className="relative z-10 text-lg sm:text-xl font-medium text-white mb-2 sm:mb-3 group-hover:text-white transition-colors duration-300 leading-tight">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="relative z-10 text-gray-400 leading-relaxed text-sm sm:text-base group-hover:text-gray-300 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CSS Styles */}
      <style jsx>{`
        @keyframes ellipse-opacity-reveal {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
            filter: drop-shadow(0 0 0px rgba(6,182,212,0));
          }
          100% {
            opacity: 1;
            transform: translateY(0px) scale(1);
            filter: drop-shadow(0 0 60px rgba(6,182,212,0.2));
          }
        }

        @keyframes ellipse-gentle-float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .support-gradient-text {
          background: linear-gradient(135deg, #22d3ee, #06b6d4, #10b981);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: gradient-flow 3s ease-in-out infinite;
        }

        @keyframes gradient-flow {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes slide-in-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-in-up {
          animation: slide-in-up 0.7s ease-out both;
        }

        * {
          transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        /* Mobile-specific optimizations */
        @media (max-width: 767px) {
          .support-gradient-text {
            background-size: 100% 100%;
            animation-duration: 4s;
          }
          
          .animate-slide-in-up {
            animation-duration: 0.5s;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.1s !important;
            transition-duration: 0.1s !important;
          }
          
          .support-gradient-text {
            animation: none;
            background: linear-gradient(135deg, #22d3ee, #10b981);
            -webkit-background-clip: text;
            background-clip: text;
          }
        }

        /* Custom breakpoint for extra small screens */
        @media (min-width: 475px) {
          .xs\:text-4xl {
            font-size: 2.25rem;
            line-height: 2.5rem;
          }
        }
      `}</style>
    </div>
  );
}