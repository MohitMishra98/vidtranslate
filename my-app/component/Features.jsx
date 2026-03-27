import FeatureCard from "./FeatureCard";

const Features = () => {
  return (
    <section id="features" className="py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base text-[#00F0FF] font-semibold tracking-wide uppercase">
            Features
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
            Everything you need to go global
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <FeatureCard
            colorClass="bg-slate-800 text-[#00F0FF] border border-white/10"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                />
              </svg>
            }
            title="AI Voice Dubbing"
            description="Preserve the original speaker's tone and emotion while switching languages seamlessly."
          />
          <FeatureCard
            colorClass="bg-slate-800 text-[#FF46A2] border border-white/10"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            }
            title="Auto-Subtitles"
            description="Generate perfectly synced subtitles in SRT or VTT formats with 99% accuracy."
          />
          <FeatureCard
            colorClass="bg-slate-800 text-[#FFFF00] border border-white/10"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            }
            title="Lightning Fast"
            description="Process hours of video footage in minutes. Optimized for speed without quality loss."
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
