import { cn } from '@/lib/utils'

export function TrinityLogo({
  scale = 1,
  showTagline = true,
  onClick,
  isSelected,
}: {
  scale?: number
  showTagline?: boolean
  onClick?: () => void
  isSelected?: boolean
}) {
  return (
    <div
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation()
          onClick()
        }
      }}
      className={cn(
        'group relative my-2 flex flex-col items-center justify-center transition-all',
        onClick && 'cursor-pointer hover:ring-2 hover:ring-indigo-400 hover:ring-offset-2 rounded-xl p-1',
        isSelected && 'ring-2 ring-indigo-600 ring-offset-2 bg-indigo-50/50 rounded-xl'
      )}
      style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
    >
      {/* Floating badge for visibility */}
      <span className="pointer-events-none absolute -top-2.5 right-2 hidden rounded bg-indigo-600 px-1.5 py-0.5 text-[9px] font-semibold text-white shadow group-hover:block">
        🏛️ Logo · Click to Edit
      </span>

      {/* Official styled Trinity Academy / KJEI Emblem SVG */}
      <svg width="120" height="95" viewBox="0 0 120 95" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Curved upper arch text: KJS EDUCATIONAL INSTITUTE */}
        <path id="archPath" d="M 12 36 A 50 24 0 0 1 108 36" fill="none" stroke="transparent" />
        <text fontSize="5.5" fontWeight="bold" fill="#7f1d1d" letterSpacing="0.8">
          <textPath href="#archPath" startOffset="50%" textAnchor="middle">
            KJEI EDUCATIONAL INSTITUTE
          </textPath>
        </text>

        {/* Golden Wings left and right */}
        <g fill="#d97706" opacity="0.9">
          {/* Left Wing feathers */}
          <path d="M 22 40 C 15 34 8 28 5 22 C 12 25 22 30 30 36 Z" />
          <path d="M 25 43 C 16 38 10 32 7 26 C 14 29 25 35 32 40 Z" />
          <path d="M 28 47 C 19 44 14 39 10 33 C 18 36 27 41 33 45 Z" />

          {/* Right Wing feathers */}
          <path d="M 98 40 C 105 34 112 28 115 22 C 108 25 98 30 90 36 Z" />
          <path d="M 95 43 C 104 38 110 32 113 26 C 106 29 95 35 88 40 Z" />
          <path d="M 92 47 C 101 44 106 39 110 33 C 102 36 93 41 87 45 Z" />
        </g>

        {/* Central Shield Crest */}
        <path
          d="M 44 26 L 76 26 L 76 54 C 76 66 60 74 60 74 C 60 74 44 66 44 54 Z"
          fill="#991b1b"
          stroke="#b45309"
          strokeWidth="1.8"
        />

        {/* Shield inner border */}
        <path
          d="M 47 29 L 73 29 L 73 53 C 73 62 60 69 60 69 C 60 69 47 62 47 53 Z"
          fill="#7f1d1d"
          stroke="#f59e0b"
          strokeWidth="0.8"
        />

        {/* Inner symbols: Torch / Book of Knowledge & KJEI monogram */}
        <circle cx="60" cy="40" r="7" fill="#fbbf24" stroke="#78350f" strokeWidth="0.8" />
        <path d="M 56 42 Q 60 36 64 42 Q 60 39 56 42 Z" fill="#991b1b" />
        <rect x="58.5" y="42" width="3" height="5" fill="#f59e0b" rx="0.5" />

        {/* Monogram letters */}
        <text x="60" y="55" fontSize="6.5" fontWeight="bold" fill="#fef3c7" textAnchor="middle" letterSpacing="0.5">
          KJEI
        </text>

        {/* Lower Banner Ribbon: TRINITY */}
        <path
          d="M 26 76 L 36 71 L 84 71 L 94 76 L 86 83 L 34 83 Z"
          fill="#b45309"
          stroke="#78350f"
          strokeWidth="1"
        />
        <path
          d="M 32 72.5 L 88 72.5 L 83 81.5 L 37 81.5 Z"
          fill="#d97706"
        />
        <text x="60" y="79" fontSize="8.5" fontWeight="900" fill="#ffffff" textAnchor="middle" letterSpacing="2">
          TRINITY
        </text>
      </svg>

      {showTagline && (
        <span className="text-[12px] font-extrabold tracking-[0.25em] text-amber-900 mt-[-2px]">
          TRINITY
        </span>
      )}
    </div>
  )
}
