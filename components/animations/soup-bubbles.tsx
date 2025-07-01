"use client"

export function SoupBubbles({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-cynthia-orange rounded-full animate-bubble"
          style={{
            left: `${10 + i * 15}%`,
            bottom: "0px",
            animationDelay: `${i * 0.8}s`,
            animationDuration: "3s",
          }}
        />
      ))}
    </div>
  )
}
