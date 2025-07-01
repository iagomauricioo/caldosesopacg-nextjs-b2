"use client"

import { useEffect, useState } from "react"

export function FloatingLeaves() {
  const [leaves, setLeaves] = useState<Array<{ id: number; delay: number; left: number }>>([])

  useEffect(() => {
    const leafArray = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      delay: Math.random() * 8,
      left: Math.random() * 100,
    }))
    setLeaves(leafArray)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="absolute text-cynthia-green-leaf text-2xl animate-leaf-fall"
          style={{
            left: `${leaf.left}%`,
            animationDelay: `${leaf.delay}s`,
            animationDuration: "8s",
          }}
        >
          🍃
        </div>
      ))}
    </div>
  )
}
