const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-white/10 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-linear-to-br from-[#FFFF00] to-[#FF46A2] rounded flex items-center justify-center text-slate-950 text-xs font-bold shadow-[0_0_16px_rgba(255,70,162,0.45)]">
            V
          </div>
          <span className="font-semibold text-white">VideoTranslate</span>
        </div>
        <div className="text-sm">
          &copy; {new Date().getFullYear()} VideoTranslate. All rights reserved.
        </div>
        <div className="flex gap-6 text-sm">
          <a href="#" className="hover:text-[#00F0FF] transition">
            Privacy
          </a>
          <a href="#" className="hover:text-[#00F0FF] transition">
            Terms
          </a>
          <a href="#" className="hover:text-[#FF46A2] transition">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
