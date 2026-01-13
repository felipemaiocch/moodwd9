import './style.css'
import * as THREE from 'three'
import Lenis from '@studio-freight/lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Scene from './webgl/Scene.js'

gsap.registerPlugin(ScrollTrigger)

// Smooth Scroll
const lenis = new Lenis()

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

// WebGL Scene
try {
  const canvas = document.querySelector('#webgl')
  if (canvas) {
    const scene = new Scene(canvas)
  }
} catch (e) {
  console.error("WebGL initialization failed:", e)
}

// Animations
const titles = document.querySelectorAll('h1, h2')
titles.forEach(title => {
  gsap.from(title, {
    y: 50,
    opacity: 0,
    duration: 1,
    scrollTrigger: {
      trigger: title,
      start: "top 80%",
    }
  })
})

// Parallax Effects
gsap.utils.toArray('.section').forEach(section => {
  gsap.to(section, {
    backgroundPosition: `0% ${innerHeight / 2}px`,
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      scrub: true
    }
  })
})

const cards = document.querySelectorAll('.card')
cards.forEach((card, i) => {
  gsap.from(card, {
    y: 100,
    opacity: 0,
    duration: 0.8,
    delay: i * 0.1, // Stagger effect
    scrollTrigger: {
      trigger: card,
      start: "top 90%",
    }
  })
})

// Mobile Menu Toggle
const menuToggle = document.querySelector('.nav-toggle')
const navElement = document.querySelector('.nav')
const navLinks = document.querySelector('.nav-links')

if (menuToggle && navElement && navLinks) {
  menuToggle.addEventListener('click', () => {
    navElement.classList.toggle('active')
    navLinks.classList.toggle('active')

    if (navElement.classList.contains('active')) {
      lenis.stop()
      document.body.style.overflow = 'hidden'
    } else {
      lenis.start()
      document.body.style.overflow = ''
    }
  })

  // Close menu when clicking links
  const links = navLinks.querySelectorAll('a')
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active')
      navElement.classList.remove('active')
      lenis.start()
      document.body.style.overflow = ''
    })
  })
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    navElement.classList.add('scrolled')
  } else {
    navElement.classList.remove('scrolled')
  }
})

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item')
faqItems.forEach(item => {
  const question = item.querySelector('.faq-question')
  question.addEventListener('click', () => {
    // Close other items
    faqItems.forEach(otherItem => {
      if (otherItem !== item) {
        otherItem.classList.remove('active')
      }
    })
    // Toggle current item
    item.classList.toggle('active')
  })
})

// Cookie Consent Banner (LGPD)
const cookieBanner = document.getElementById('cookie-banner')
const cookieAccept = document.getElementById('cookie-accept')
const cookieReject = document.getElementById('cookie-reject')

// Check if user has already made a choice
const cookieConsent = localStorage.getItem('cookieConsent')

if (cookieBanner && cookieAccept && cookieReject) {
  if (!cookieConsent) {
    // Show banner after 1 second
    setTimeout(() => {
      cookieBanner.classList.add('show')
    }, 1000)
  }

  // Accept cookies
  cookieAccept.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'accepted')
    cookieBanner.classList.remove('show')
    // Here you can enable Google Analytics, Facebook Pixel, etc.
    console.log('Cookies accepted - Enable tracking')
  })

  // Reject cookies
  cookieReject.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'rejected')
    cookieBanner.classList.remove('show')
    // Only essential cookies
    console.log('Cookies rejected - Only essential cookies')
  })
}
