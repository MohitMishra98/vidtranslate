const CTA = () => {
  return (
    <section className="py-20 bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to expand your reach?
        </h2>
        <p className="text-indigo-200 text-lg mb-10">
          Join 10,000+ creators and businesses localizing their content today.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="px-8 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition">
            Get Started Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTA;