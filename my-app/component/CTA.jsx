const CTA = () => {
  return (
    <section className="py-20 bg-linear-to-r from-[#EE4B2B]/20 via-[#FF46A2]/20 to-slate-900 border-y border-white/10">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to expand your reach?
        </h2>
        <p className="text-slate-300 text-lg mb-10">
          Join 10,000+ creators and businesses localizing their content today.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="px-8 py-3 rounded-lg bg-linear-to-r from-[#FF46A2] to-[#EE4B2B] text-white font-bold transition shadow-[0_0_30px_rgba(255,70,162,0.45)] hover:shadow-[0_0_40px_rgba(255,70,162,0.62)]">
            Get Started Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
