const FeatureCard = ({ icon, title, description, colorClass }) => (
  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition">
    <div
      className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${colorClass}`}
    >
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-600">{description}</p>
  </div>
);

export default FeatureCard;