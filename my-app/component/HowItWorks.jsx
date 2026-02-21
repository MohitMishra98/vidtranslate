import Step from "./Step";

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900">
            How it works
          </h2>
        </div>
        <div className="relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Step
              number="1"
              title="Upload Video"
              description="Drag and drop your video file or paste a YouTube link."
              colorClass="bg-slate-900"
            />
            <Step
              number="2"
              title="Select Language"
              description="Choose from over 50+ languages for audio and subtitles."
              colorClass="bg-indigo-600"
            />
            <Step
              number="3"
              title="Download"
              description="Get your translated video or subtitle files instantly."
              colorClass="bg-slate-900"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;