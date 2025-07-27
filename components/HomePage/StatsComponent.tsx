import { useRef } from "react"

interface StatsComponentProps {
  isVisible: boolean
  scrollY: number
}

export default function StatsComponent({ isVisible, scrollY }: StatsComponentProps) {
  const statsRef = useRef<HTMLDivElement>(null)

  const stats = [
    {
      percentage: "80%",
      description: "time saved during reviews.",
      company: "Estin",
      delay: 0.1,
    },
    {
      percentage: "91%",
      description: "decrease in build times.",
      company: "Esi alger",
      delay: 0.2,
    },
    {
      percentage: "77%",
      description: "increase in page speed.",
      company: "Itihad group",
      delay: 0.3,
    },
    {
      percentage: "87%",
      description: "decrease in build times.",
      company: "It soulution",
      delay: 0.4,
    },
  ]

  return (
    <>
      {/* Stats Grid with Parallax */}
      <div 
        ref={statsRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0"
        style={{
          transform: `translateY(${scrollY * 20}px)`
        }}
      >
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`stat-card ${isVisible ? "stat-visible" : ""}`}
            style={{ animationDelay: `${stat.delay}s` }}
          >
            <div className="stat-content group">
              <div className="stat-number">
                {stat.percentage}
              </div>
              <div className="stat-description">
                {stat.description}
              </div>
              <div className="stat-company">
                {stat.company}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        /* Stats Card Animations */
        .stat-card {
          opacity: 0;
          transform: translateY(40px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .stat-card.stat-visible {
          opacity: 1;
          transform: translateY(0px);
        }

        .stat-content {
          padding: 3rem 2rem;
          
          border: 1px solid #1a1a1a;
          border-top : none ;
          border-right: 1px solid #333;
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
          min-height: 200px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .stat-content:last-child {
          border-right: 1px solid #1a1a1a;
        }

        .stat-content::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.02), transparent);
          transition: left 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .stat-content:hover::before {
          left: 100%;
        }

        .stat-content:hover {
          background: #111111;
          border-color: #333;
        }

        .stat-number {
          font-size: 3.5rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 0.5rem;
          transition: all 0.4s ease;
          line-height: 1;
        }

        .stat-content:hover .stat-number {
          color: #f0f0f0;
        }

        .stat-description {
          color: #888888;
          font-size: 1rem;
          line-height: 1.5;
          margin-bottom: 1.5rem;
          transition: color 0.4s ease;
          font-weight: 400;
        }

        .stat-content:hover .stat-description {
          color: #aaaaaa;
        }

        .stat-company {
          color: #666666;
          font-size: 0.9rem;
          font-weight: 500;
          letter-spacing: 0.025em;
          transition: color 0.4s ease;
          text-transform: capitalize;
        }

        .stat-content:hover .stat-company {
          color: #888888;
        }

        /* Mobile Optimizations */
        @media (max-width: 1024px) {
          .stat-content {
            border-right: 1px solid #1a1a1a;
            border-bottom: 1px solid #333;
          }
          
          .stat-content:last-child {
            border-bottom: 1px solid #1a1a1a;
          }
        }

        @media (max-width: 768px) {
          .stat-number {
            font-size: 2.8rem;
          }
          
          .stat-content {
            padding: 2rem 1.5rem;
            min-height: 160px;
            border-bottom: 1px solid #333;
            border-right: 1px solid #1a1a1a;
          }

          .stat-content:last-child {
            border-bottom: 1px solid #1a1a1a;
          }
        }

        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          .stat-card,
          .stat-content {
            transition-duration: 0.2s;
            animation: none;
          }
        }

        /* Performance - Smooth parallax */
        @media (prefers-reduced-motion: no-preference) {
          .stat-card,
          .stat-content {
            will-change: transform, opacity;
          }
        }
      `}</style>
    </>
  )
}