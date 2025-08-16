const Logo = ({ className = "h-8 w-auto", textClassName = "text-2xl font-bold" }) => {
  return (
    <div className="flex items-center space-x-2">
      <svg
        className={className}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="20" cy="20" r="18" fill="url(#gradient1)" stroke="currentColor" strokeWidth="2"/>
        <path
          d="M14 18h4v8h-4v-8zM22 14h4v12h-4v-12z"
          fill="white"
        />
        <path
          d="M12 22c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2s-.9-2-2-2H14c-1.1 0-2 .9-2 2z"
          fill="white"
          opacity="0.8"
        />
        <circle cx="16" cy="12" r="2" fill="white"/>
        <circle cx="24" cy="10" r="2" fill="white"/>
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6"/>
            <stop offset="50%" stopColor="#8B5CF6"/>
            <stop offset="100%" stopColor="#06B6D4"/>
          </linearGradient>
        </defs>
      </svg>
      <span className={textClassName}>
        HELP<span className="text-blue-400">WISE</span>
      </span>
    </div>
  );
};

export default Logo;