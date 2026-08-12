function Navbar() {
  return (
    <nav className="w-full border-b border-white/10 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
            <span className="text-xl">⚡</span>
          </div>

          {/* Text */}
          <div>
            <h1 className="text-sm font-semibold">AI Expense Tracker</h1>

            <p className="text-xs text-gray-500">Powered by AI</p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400"></span>

          <span className="text-xs text-green-400">Online</span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
