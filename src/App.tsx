import { useEffect, useRef, useState } from 'react'

const VIDEO_SRC = '/bg.mp4'
const SENSITIVITY = 0.8
const EMAIL = 'hello@mainframe.co'
const LINKS = ['Labs', 'Studio', 'Openings', 'Shop']
const PILLS = ['Pitch us an idea', 'Come work here', 'Send a brief hello', 'See how we operate']

function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    setCount(0)
    let interval: number | undefined
    const timeout = window.setTimeout(() => {
      let i = 0
      interval = window.setInterval(() => {
        i += 1
        setCount(i)
        if (i >= text.length) window.clearInterval(interval)
      }, speed)
    }, startDelay)
    return () => {
      window.clearTimeout(timeout)
      window.clearInterval(interval)
    }
  }, [text, speed, startDelay])

  return { displayed: text.slice(0, count), done: count >= text.length }
}

function useVideoScrub(ref: React.RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    const video = ref.current
    if (!video) return

    let prevX: number | null = null
    let targetTime = 0
    let seeking = false

    const seek = () => {
      seeking = true
      video.currentTime = targetTime
    }

    const onSeeked = () => {
      seeking = false
      if (Math.abs(video.currentTime - targetTime) > 0.01) seek()
    }

    const onMove = (e: MouseEvent) => {
      const duration = video.duration
      if (prevX === null) prevX = e.clientX
      const delta = e.clientX - prevX
      prevX = e.clientX
      if (!duration || !isFinite(duration)) return

      const offset = (delta / window.innerWidth) * SENSITIVITY * duration
      targetTime = Math.min(Math.max(targetTime + offset, 0), duration)
      if (!seeking) seek()
    }

    video.addEventListener('seeked', onSeeked)
    window.addEventListener('mousemove', onMove)
    return () => {
      video.removeEventListener('seeked', onSeeked)
      window.removeEventListener('mousemove', onMove)
    }
  }, [ref])
}

const CopyIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2">
    <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
    <rect x="1.5" y="1.5" width="7" height="7" rx="1" />
  </svg>
)

const pillBase =
  'inline-flex items-center justify-center rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap cursor-pointer'

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [pillsVisible, setPillsVisible] = useState(false)
  const { displayed, done } = useTypewriter(
    'Glad you stopped in. Good taste tends to find us. Now, what are we building?',
  )

  useVideoScrub(videoRef)

  useEffect(() => {
    const t = window.setTimeout(() => setPillsVisible(true), 400)
    return () => window.clearTimeout(t)
  }, [])

  const copyEmail = () => {
    navigator.clipboard?.writeText(EMAIL).catch(() => {})
  }

  return (
    <>
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        muted
        playsInline
        preload="auto"
        className="fixed inset-0 z-0 w-full h-full"
        style={{ objectFit: 'cover', objectPosition: '70% center' }}
      />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-10 flex flex-row justify-between items-center px-5 sm:px-8 py-4 sm:py-5">
        <div className="flex flex-row gap-3 items-center">
          <span
            className="text-[21px] sm:text-[26px] tracking-tight text-black"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Mainframe®
          </span>
          <span
            className="text-[25px] sm:text-[30px] text-black select-none"
            style={{ letterSpacing: '-0.02em' }}
          >
            ✳︎
          </span>
        </div>

        <div className="hidden md:flex flex-row text-[23px] text-black">
          {LINKS.map((l, i) => (
            <span key={l}>
              <a href="#" className="hover:opacity-60 transition-opacity">{l}</a>
              {i < LINKS.length - 1 && ', '}
            </span>
          ))}
        </div>

        <a
          href="#"
          className="hidden md:inline text-[23px] text-black underline underline-offset-2 hover:opacity-60 transition-opacity"
        >
          Get in touch
        </a>

        <button
          className="md:hidden flex flex-col gap-[5px] p-1"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className={`block w-6 h-[2px] bg-black transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block w-6 h-[2px] bg-black transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-[2px] bg-black transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </nav>

      {/* Mobile overlay */}
      <div
        className="md:hidden fixed inset-0 z-[9] bg-white/95 backdrop-blur-sm flex flex-col justify-center items-start px-8 gap-8 transition-opacity duration-300"
        style={{ opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? 'auto' : 'none' }}
      >
        {LINKS.map((l) => (
          <a key={l} href="#" className="text-[32px] font-medium text-black" onClick={() => setMenuOpen(false)}>
            {l}
          </a>
        ))}
        <a href="#" className="text-[32px] font-medium text-black underline" onClick={() => setMenuOpen(false)}>
          Get in touch
        </a>
      </div>

      {/* Hero */}
      <section className="relative z-[1] h-screen flex flex-col justify-end pb-12 md:justify-center md:pb-0 px-5 sm:px-8 md:px-10 overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <div
            className="pointer-events-none select-none mb-5 sm:mb-6"
            style={{
              fontSize: 'clamp(18px, 4vw, 26px)',
              lineHeight: 1.3,
              fontWeight: 400,
              color: '#000',
              filter: 'blur(4px)',
            }}
          >
            Hey there, meet A.R.I.A,
            <br />
            Mainframe's Adaptive Response Interface Agent
          </div>

          <p
            className="text-black mb-5 sm:mb-6"
            style={{
              fontSize: 'clamp(18px, 4vw, 26px)',
              lineHeight: 1.35,
              fontWeight: 400,
              minHeight: 54,
            }}
          >
            {displayed}
            {!done && (
              <span
                className="inline-block w-[2px] h-[1.1em] bg-black align-middle ml-[2px]"
                style={{ animation: 'blink 1s step-end infinite' }}
              />
            )}
          </p>

          <div
            className="flex flex-wrap gap-y-1"
            style={{
              opacity: pillsVisible ? 1 : 0,
              transform: pillsVisible ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
            }}
          >
            {PILLS.map((p) => (
              <button
                key={p}
                className={`${pillBase} bg-white text-black border border-black/10 hover:bg-black hover:text-white transition-colors duration-200`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={copyEmail}
              className={`${pillBase} gap-2 sm:gap-3 text-white bg-transparent border border-white hover:bg-white hover:text-black transition-colors duration-200`}
            >
              <span>
                Reach us: <span className="underline underline-offset-1">{EMAIL}</span>
              </span>
              <CopyIcon />
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
