const Logo = ({ className = "h-8 w-auto", textClassName = "text-2xl font-bold" }) => {
  return (
    <div className="flex items-center space-x-2">
      <svg
        className={className}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="20" cy="20" r="18" fill="#3B82F6" stroke="white" strokeWidth="2"/>
        <path
          d="M15 12v16M25 12v16M12 20h16"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="15" cy="12" r="2" fill="white"/>
        <circle cx="25" cy="12" r="2" fill="white"/>
      </svg>
      <span className={textClassName}>
        HELPWISE
      </span>
    </div>
  );
};

export default Logo;