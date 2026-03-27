const Step = ({ number, title, description, colorClass }) => (
  <div className="bg-slate-900 p-8 rounded-xl shadow-sm border border-white/5 text-center relative z-10">
    <div
      className={`w-12 h-12 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 ${colorClass}`}
    >
      {number}
    </div>
    <h3 className="font-bold text-lg mb-2 text-white">{title}</h3>
    <p className="text-slate-400 text-sm">{description}</p>
  </div>
);

export default Step;
