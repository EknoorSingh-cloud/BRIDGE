function Footer() {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-6 text-center text-gray-400">
        <p className="text-sm">
          © {new Date().getFullYear()} BRIDGE. Built for smarter placements.
        </p>

        <p className="text-xs mt-2">
          Made with ❤️ you better select me.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
