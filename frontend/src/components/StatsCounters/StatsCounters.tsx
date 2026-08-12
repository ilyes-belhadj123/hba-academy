import { useEffect, useRef, useState } from 'react'
import type { Realisation } from '../../types/realisation'
import './StatsCounters.css'

interface StatsCountersProps {
  chiffresCles: Realisation[]
}

function Counter({ target }: { target: number }) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()

        const durationMs = 1200
        const startTime = performance.now()

        function animate(now: number) {
          const progress = Math.min((now - startTime) / durationMs, 1)
          setValue(Math.round(target * progress))
          if (progress < 1) requestAnimationFrame(animate)
        }

        requestAnimationFrame(animate)
      },
      { threshold: 0.4 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [target])

  return <span ref={ref}>{value}</span>
}

export function StatsCounters({ chiffresCles }: StatsCountersProps) {
  if (chiffresCles.length === 0) return null

  return (
    <div className="stats-counters">
      {chiffresCles.map((chiffre) => (
        <div key={chiffre._id} className="stats-counters__item">
          <div className="stats-counters__value">
            {chiffre.valeur !== null ? <Counter target={chiffre.valeur} /> : chiffre.titre}
          </div>
          <div className="stats-counters__label">{chiffre.description || chiffre.titre}</div>
        </div>
      ))}
    </div>
  )
}
