export function Logo() {
  return (
    <div className="flex items-center gap-3">
      {/* Animated icon - same as before */}
      <div className="relative h-12 w-12 flex-shrink-0">
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <defs>
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="1">
                <animate
                  attributeName="stop-color"
                  values="#3b82f6;#6366f1;#3b82f6"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="1">
                <animate
                  attributeName="stop-color"
                  values="#8b5cf6;#a855f7;#8b5cf6"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>

            <linearGradient
              id="chartGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#10b981" stopOpacity="1" />
              <stop offset="100%" stopColor="#059669" stopOpacity="1" />
            </linearGradient>

            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <circle
            cx="100"
            cy="100"
            r="95"
            fill="url(#bgGradient)"
            opacity="0.95"
          >
            <animate
              attributeName="r"
              values="95;97;95"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>

          <path
            d="M 100 40 A 45 45 0 1 0 100 160"
            fill="none"
            stroke="white"
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.9"
          />

          <path
            d="M 100 50 A 35 35 0 1 0 100 150"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.6"
          />

          <g filter="url(#glow)">
            <rect
              x="65"
              y="120"
              width="8"
              height="20"
              fill="url(#chartGradient)"
              rx="2"
            />
            <rect
              x="78"
              y="110"
              width="8"
              height="30"
              fill="url(#chartGradient)"
              rx="2"
            />
            <rect
              x="91"
              y="95"
              width="8"
              height="45"
              fill="url(#chartGradient)"
              rx="2"
            />
            <rect
              x="104"
              y="85"
              width="8"
              height="55"
              fill="url(#chartGradient)"
              rx="2"
            />
            <rect
              x="117"
              y="75"
              width="8"
              height="65"
              fill="url(#chartGradient)"
              rx="2"
            />
          </g>

          <path
            d="M 65 125 L 78 115 L 91 100 L 104 90 L 117 80 L 130 75"
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.8"
          />

          <circle cx="130" cy="75" r="4" fill="#10b981">
            <animate
              attributeName="r"
              values="4;6;4"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="1;0.5;1"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-logo-text text-2xl leading-none font-bold">
          CryptoDash
        </span>
        <span className="text-logo-text-muted text-[9px] tracking-wider">
          LIVE MARKET DATA
        </span>
      </div>
    </div>
  );
}
