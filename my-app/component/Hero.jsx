const Hero = () => {
  return (
    <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <span className="inline-block py-1 px-3 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/35 text-[#00F0FF] text-sm font-semibold mb-6">
          Now supporting 50+ languages
        </span>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-8">
          Make your videos <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-[#00F0FF] via-[#FF46A2] to-[#FFFF00]">
            speak every language.
          </span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-400 mb-10">
          Automatically translate video content, caption accurately, and dub
          voices in minutes using advanced AI. Reach a global audience
          effortlessly.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl text-white bg-linear-to-r from-[#FF46A2] to-[#EE4B2B] shadow-[0_0_30px_rgba(255,70,162,0.4)] transition transform hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(255,70,162,0.62)]">
            Try for Free
          </button>
          <button className="flex items-center justify-center px-8 py-4 border border-white/10 text-lg font-medium rounded-xl text-white bg-white/5 hover:bg-white/10 transition">
            <svg
              className="w-5 h-5 mr-2 text-slate-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            View Demo
          </button>
        </div>

        {/* Hero Visual */}
        <div className="mt-16 relative mx-auto w-full max-w-4xl rounded-2xl shadow-2xl border border-white/10 bg-slate-900/50 overflow-hidden p-2">
          <div className="bg-slate-900 rounded-xl overflow-hidden aspect-video relative flex items-center justify-center border border-white/10">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center border border-white/10 shadow-md mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-[#00F0FF] ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-slate-300 font-medium">
                Upload a video to see the magic
              </p>
            </div>
            {/* UI Element Overlay */}
            <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur p-4 rounded-lg border border-white/10 flex items-center gap-4 shadow-sm">
              <div className="h-2 bg-[#00F0FF]/40 rounded w-1/3"></div>
              <div className="h-2 bg-slate-700 rounded w-1/4"></div>
              <div className="ml-auto text-xs font-bold text-[#FF46A2]">
                Translating...
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Blobs */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full z-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#FF46A2]/30 rounded-full mix-blend-screen filter blur-3xl opacity-60 animate-blob"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#00F0FF]/20 rounded-full mix-blend-screen filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
      </div>
    </section>
  );
};

export default Hero;
