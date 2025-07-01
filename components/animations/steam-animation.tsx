"use client"

export function SteamAnimation({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-gray-300 rounded-full opacity-70"
          style={{
            left: `${20 + i * 15}%`,
            animationDelay: `${i * 0.5}s`,
          }}
        >
          <div className="w-full h-full bg-gray-300 rounded-full animate-steam" />
        </div>
      ))}
    </div>
  )
}
