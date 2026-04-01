import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Animate a batch of elements (NodeList / Array) with stagger
 * when they enter the viewport.
 */
export function animateFadeUp(targets, options = {}) {
  const {
    y = 50,
    duration = 0.8,
    stagger = 0.1,
    delay = 0,
    start = 'top 85%',
    ease = 'power3.out',
    scrub = false,
  } = options

  return gsap.fromTo(
    targets,
    { opacity: 0, y, force3D: true },
    {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      delay,
      ease,
      scrollTrigger: {
        trigger: targets[0] || targets,
        start,
        toggleActions: scrub ? undefined : 'play none none none',
        scrub,
        once: true,
      },
    }
  )
}

export function animateFadeLeft(target, options = {}) {
  const { x = -60, duration = 0.9, delay = 0, start = 'top 80%', ease = 'power3.out' } = options
  return gsap.fromTo(
    target,
    { opacity: 0, x, force3D: true },
    {
      opacity: 1,
      x: 0,
      duration,
      delay,
      ease,
      scrollTrigger: { trigger: target, start, toggleActions: 'play none none none', once: true },
    }
  )
}

export function animateFadeRight(target, options = {}) {
  const { x = 60, duration = 0.9, delay = 0, start = 'top 80%', ease = 'power3.out' } = options
  return gsap.fromTo(
    target,
    { opacity: 0, x, force3D: true },
    {
      opacity: 1,
      x: 0,
      duration,
      delay,
      ease,
      scrollTrigger: { trigger: target, start, toggleActions: 'play none none none', once: true },
    }
  )
}

export function animateScaleIn(targets, options = {}) {
  const { scale = 0.88, duration = 0.7, stagger = 0.12, start = 'top 85%', ease = 'back.out(1.4)' } = options
  return gsap.fromTo(
    targets,
    { opacity: 0, scale, force3D: true },
    {
      opacity: 1,
      scale: 1,
      duration,
      stagger,
      ease,
      scrollTrigger: { trigger: targets[0] || targets, start, toggleActions: 'play none none none', once: true },
    }
  )
}

export function animateCountUp(el, target, duration = 2) {
  const obj = { val: 0 }
  const isFraction = String(target).includes('.')
  const suffix = String(target).replace(/[\d.]/g, '')
  const num = parseFloat(String(target).replace(/[^\d.]/g, ''))
  gsap.to(obj, {
    val: num,
    duration,
    ease: 'power2.out',
    scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    onUpdate() {
      el.textContent = isFraction
        ? obj.val.toFixed(1) + suffix
        : Math.round(obj.val) + suffix
    },
  })
}

export { gsap, ScrollTrigger }
