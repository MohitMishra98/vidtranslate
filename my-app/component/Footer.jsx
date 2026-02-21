const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center text-white text-xs font-bold">
            V
          </div>
          <span className="font-semibold text-white">VideoTranslate</span>
        </div>
        <div className="text-sm">
          &copy; {new Date().getFullYear()} VideoTranslate. All rights reserved.
        </div>
        <div className="flex gap-6 text-sm">
          <a href="#" className="hover:text-white transition">
            Privacy
          </a>
          <a href="#" className="hover:text-white transition">
            Terms
          </a>
          <a href="#" className="hover:text-white transition">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;