const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
const active = new Set<Animation>()

/** Keep the page usable without animation, and stop motion if preferences change. */
export function playMotion(element: Element | null, frames: Keyframe[], options: KeyframeAnimationOptions) {
  if (!element || reducedMotion.matches || typeof element.animate !== 'function') return
  element.getAnimations().forEach(animation => animation.cancel())
  const animation = element.animate(frames, options)
  active.add(animation)
  const release = () => active.delete(animation)
  animation.addEventListener('finish', release, { once: true })
  animation.addEventListener('cancel', release, { once: true })
  return animation
}

reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) active.forEach(animation => animation.cancel())
})

export function initEntrances() {
  if (!('IntersectionObserver' in window)) return
  const ease = 'cubic-bezier(.22,1,.36,1)'
  const observer = new IntersectionObserver(entries => {
    let stagger = 0
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      observer.unobserve(entry.target)
      if (entry.target.contains(document.activeElement)) continue
      const isCopy = entry.target.matches('.hero-copy')
      const isPortrait = entry.target.matches('.portrait-garden')
      const isRow = entry.target.matches('.work-row,.note-row,.project-row')
      const elements = isRow ? [...entry.target.children] : [entry.target]
      const delay = isPortrait && window.matchMedia('(min-width: 761px)').matches ? 80 : isCopy || isPortrait ? 0 : Math.min(stagger++, 3) * 40
      elements.forEach(element => playMotion(element, [
        { opacity: 0, transform: 'translateY(8px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ], { duration: isCopy ? 420 : isPortrait ? 520 : 360, delay, easing: ease, fill: 'backwards' }))
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' })
  document.querySelectorAll('.hero-copy,.portrait-garden,.section-heading,.work-row,.note-row,.project-row').forEach(element => observer.observe(element))
  // Keyboard navigation should never wait for an entrance to finish.
  document.addEventListener('focusin', event => {
    const target = event.target instanceof Element ? event.target : null
    const section = target?.closest('.hero-copy,.portrait-garden,.section-heading,.work-row,.note-row,.project-row')
    if (section) {
      observer.unobserve(section)
      section.getAnimations({ subtree: true }).forEach(animation => animation.finish())
    }
  })
}
