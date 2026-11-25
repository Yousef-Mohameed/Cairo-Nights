type Props = { className?: string }

function Lantern({ className = '' }: Props) {
  return (
    <svg
      viewBox="0 0 40 80"
      className={`text-gold drop-shadow-[0_0_14px_rgba(240,201,135,0.8)] ${className}`}
      aria-hidden="true"
    >
      <line x1="20" y1="0" x2="20" y2="12" stroke="currentColor" strokeWidth="2" />
      <rect x="10" y="12" width="20" height="6" rx="2" fill="currentColor" />
      <path
        d="M12 18 Q2 40 12 62 H28 Q38 40 28 18 Z"
        fill="currentColor"
        fillOpacity="0.85"
      />
      <path d="M20 18 V62 M12 40 H28" stroke="#4a3222" strokeWidth="1.5" />
      {/* نور الشمعة جوه الفانوس بيرتعش */}
      <ellipse
        cx="20"
        cy="42"
        rx="7"
        ry="15"
        fill="#fff3c4"
        className="animate-flicker motion-reduce:animate-none"
        opacity="0.4"
      />
      <rect x="10" y="62" width="20" height="6" rx="2" fill="currentColor" />
      <path d="M20 68 V76" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

export default Lantern