import { playMotion } from './motion'

export function initNavigation() {
  const nav = document.querySelector<HTMLElement>('.nav-links')
  const marker = nav?.querySelector<HTMLElement>('.nav-marker')
  if (nav && marker) {
    const links = [...nav.querySelectorAll<HTMLAnchorElement>('a')]
    const current = links.find(link => link.hasAttribute('aria-current'))
    let hovered: HTMLAnchorElement | undefined
    let selected: HTMLAnchorElement | undefined
    const moveTo = (link?: HTMLAnchorElement, flourish = true) => {
      const changed = selected !== link
      if (!changed && flourish) return
      selected = link
      links.forEach(item => item.toggleAttribute('data-nav-highlight', item === link))
      if (!link || !nav.offsetWidth) {
        marker.dataset.visible = 'false'
        return
      }
      // Sample the rendered pose before cancelling, including an interrupted move.
      const pose = getComputedStyle(marker)
      const visible = Number(pose.opacity) > .05
      const fromX = pose.transform === 'none' ? link.offsetLeft : new DOMMatrixReadOnly(pose.transform).m41
      const fromWidth = parseFloat(pose.width)
      const blossom = marker.querySelector('.nav-blossom')
      const blossomPose = blossom ? getComputedStyle(blossom).transform : 'none'
      const x = link.offsetLeft
      const width = link.offsetWidth
      const travel = x - fromX
      const overshoot = Math.sign(travel) * Math.min(Math.abs(travel) * .035, 6)
      const stretch = Math.min(Math.abs(travel) * .05, 12)
      marker.getAnimations().forEach(animation => animation.cancel())
      marker.style.setProperty('--marker-x', `${x}px`)
      marker.style.setProperty('--marker-width', `${width}px`)
      marker.dataset.visible = 'true'
      if (changed && flourish) {
        if (visible) {
          playMotion(marker, [
            { transform: `translateX(${fromX}px)`, width: `${fromWidth}px`, easing: 'cubic-bezier(.16,.8,.25,1)' },
            { transform: `translateX(${x + overshoot}px)`, width: `${width + stretch}px`, offset: .65, easing: 'ease-in-out' },
            { transform: `translateX(${x}px)`, width: `${width}px` },
          ], { duration: 460 })
        } else {
          playMotion(marker, [
            { opacity: 0, transform: `translateX(${x}px) translateY(3px) scale(.94)` },
            { opacity: 1, transform: `translateX(${x}px) translateY(0) scale(1)` },
          ], { duration: 220, easing: 'cubic-bezier(.16,1,.3,1)' })
          // Draw once on entry, not on every crossing between destinations.
          playMotion(marker.querySelector('path'), [
            { strokeDashoffset: '1' }, { strokeDashoffset: '0' },
          ], { duration: 260, easing: 'ease-out' })
        }
        playMotion(blossom, [
          { transform: blossomPose, easing: 'cubic-bezier(.2,.8,.3,1)' },
          { transform: `translateY(-3px) rotate(${Math.sign(travel) * 40}deg)`, offset: .55, easing: 'ease-in-out' },
          { transform: 'translateY(0) rotate(0)' },
        ], { duration: 460 })
      }
    }
    const focused = () => links.find(link => link === document.activeElement)
    nav.dataset.markerReady = 'true'
    moveTo(current, false)
    links.forEach(link => {
      link.addEventListener('pointerenter', event => {
        if (event.pointerType === 'touch') return
        hovered = link
        moveTo(link)
      })
      link.addEventListener('focus', () => moveTo(link))
    })
    nav.addEventListener('pointerleave', () => { hovered = undefined; moveTo(focused() ?? current) })
    nav.addEventListener('focusout', () => requestAnimationFrame(() => moveTo(focused() ?? hovered ?? current)))
    const refresh = () => moveTo(focused() ?? hovered ?? current, false)
    if ('ResizeObserver' in window) new ResizeObserver(refresh).observe(nav)
    document.fonts.ready.then(refresh)
  }

  const menu = document.querySelector<HTMLDetailsElement>('.mobile-menu')
  menu?.addEventListener('toggle', () => {
    const panel = menu.querySelector('.mobile-nav-links')
    if (!menu.open) {
      panel?.getAnimations({ subtree: true }).forEach(animation => animation.cancel())
      return
    }
    playMotion(panel, [
      { opacity: .4, transform: 'translateY(-7px) rotate(-1deg)' },
      { opacity: 1, transform: 'translateY(0) rotate(0)' },
    ], { duration: 240, easing: 'cubic-bezier(.22,1,.36,1)' })
    menu.querySelectorAll('.mobile-nav-links>a').forEach((link,index) => playMotion(link, [
      { opacity: .4, transform: 'translateX(-5px)' },
      { opacity: 1, transform: 'translateX(0)' },
    ], { duration: 180, delay: index * 25, easing: 'ease-out' }))
  })
  // Focusing a destination should never leave it midway through an entrance.
  menu?.addEventListener('focusin', () => menu.getAnimations({ subtree: true }).forEach(animation => animation.finish()))
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu?.open) {
      menu.open = false
      menu.querySelector('summary')?.focus()
    }
  })
  document.addEventListener('click', event => {
    if (menu?.open && event.target instanceof Node && !menu.contains(event.target)) menu.open = false
  })
}
