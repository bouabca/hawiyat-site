import React from 'react';

export default function HawiyatLanding() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large Ellipse Background - Only bottom half visible */}
        <div className="absolute -top-1/2 left-1/2 transform -translate-x-1/2">
          <div className="w-[200vw] h-[200vh] border-4 border-cyan-400/20 rounded-full"></div>
        </div>

        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.1)_1px,transparent_1px)] bg-[size:60px_60px] opacity-100"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-cyan-400/40 rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-32 w-6 h-6 bg-teal-500/40 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-32 w-3 h-3 bg-emerald-500/40 rounded-full animate-bounce delay-2000"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.1)_1px,transparent_1px)] bg-[size:100px_100px] opacity-30"></div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] px-6 text-center py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Badge */}
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 backdrop-blur-sm">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Bring your business to the best scale
          </div>

          {/* Main Heading */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                Hawiyat Platform
              </span>
              <br />
              <div className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl mt-4 space-x-4">
                <span className="bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">Build</span>
                <span className="bg-gradient-to-r from-white/80 to-white/70 bg-clip-text text-transparent">Deploy</span>
                <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
                  Scale
                </span>
              </div>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Hawiyat is the first AI-powered PaaS in the region that unifies DevOps, Cloud, Security and automation in
              one seamless platform
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <button className="w-full sm:w-auto h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg font-medium bg-gradient-to-r from-cyan-400 to-teal-500 hover:from-cyan-300 hover:to-teal-400 text-slate-900 rounded-lg shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center">
              Get Started
              <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button className="w-full sm:w-auto h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg border-2 border-white/30 hover:border-white/50 text-white hover:bg-white/5 bg-transparent rounded-lg backdrop-blur-sm transition-all duration-300 hover:scale-105">
              Go to Support
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}