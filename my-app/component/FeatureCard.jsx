const FeatureCard = ({ icon, title, description, colorClass }) => (
  <div className="group p-6 bg-slate-900/50 rounded-2xl border border-white/5 hover:bg-slate-800/60 hover:shadow-[0_0_30px_rgba(255,70,162,0.15)] hover:-translate-y-1 transition">
    <div
      className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${colorClass}`}
    >
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-400">{description}</p>
  </div>
);

export default FeatureCard;
