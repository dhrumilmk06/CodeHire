# 🚀 Landing Page Redesign — CodeHire

## Overview

This document covers the complete implementation of the **new CodeHire landing page**
redesign. The new landing page has 8 sections — Navbar, Hero, Trusted By, Features,
How It Works, Testimonials, CTA, and Footer — all built with React and Tailwind CSS
matching CodeHire's existing dark theme.

---

## 🎨 Color Palette

```
Main background     → #0a0a0a
Card background     → #111111
Border              → #2a2a2a
Primary green       → #22c55e
Text primary        → #ffffff
Text secondary      → #888888
Text muted          → #555555
```

---

## 👤 Who Does What

```
YOU do yourself    → Step 1 (backup + verify)
ANTIGRAVITY does   → Step 2 (paste full prompt)
YOU do yourself    → Step 3 (test and verify)
```

---

## ✅ Step 1 — YOU — Backup First (5 minutes)

```bash
# Backup your current landing page
cp FrontEnd/src/pages/Landing.jsx FrontEnd/src/pages/Landing.backup.jsx
# OR whatever your current landing page file is called

# Also note your current landing page route in App.jsx
# so you can revert if needed
```

---

## 🤖 Step 2 — ANTIGRAVITY — Paste This Full Prompt

> Copy everything between the START and END markers and paste into Antigravity:

---

### ====== START OF ANTIGRAVITY PROMPT ======

I have an online coding interview platform called **CodeHire** with tagline
"Code Together". Built with **React and Tailwind CSS**.

**Color palette to use:**
```
Main background  → #0a0a0a
Card background  → #111111
Border           → #2a2a2a
Primary green    → #22c55e
Text primary     → #ffffff
Text secondary   → #888888
```

**CRITICAL RULES:**
```
❌ Do NOT use any external UI libraries (no shadcn, no MUI, no Ant Design)
❌ Do NOT use any animation libraries (no Framer Motion)
❌ Do NOT touch any existing pages or components
❌ Do NOT touch backend files
❌ Do NOT touch App.jsx routing
❌ Do NOT modify any existing auth or dashboard files
✅ Use only React + Tailwind CSS
✅ Use only CSS transitions for animations
✅ All components in one folder: FrontEnd/src/components/landing/
✅ Keep existing landing page as backup
```

---

**What to Build — 9 Component Files + 1 Page File:**

---

**FILE 1 — Create** `FrontEnd/src/components/landing/LandingNavbar.jsx`

```jsx
// Navbar with:
// - CodeHire logo (green lightning bolt icon + "CodeHire" text)
// - "Code Together" subtitle under logo
// - Right side: "Sign In" ghost button + "Get Started →" green button
// - Sticky top, dark background with subtle bottom border
// - On mobile: hamburger menu

export default function LandingNavbar() {
  return (
    <nav className="
      fixed top-0 left-0 right-0 z-50
      bg-[#0a0a0a]/95 backdrop-blur-sm
      border-b border-[#2a2a2a]
    ">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="
            w-8 h-8 bg-[#22c55e] rounded-lg
            flex items-center justify-center text-black font-bold text-sm
          ">
            ⚡
          </div>
          <div>
            <div className="text-white font-bold text-lg leading-none">
              CodeHire
            </div>
            <div className="text-[#888888] text-xs">
              Code Together
            </div>
          </div>
        </div>

        {/* Nav Links — desktop */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-[#888888] hover:text-white text-sm transition-colors duration-200">
            Features
          </a>
          <a href="#how-it-works" className="text-[#888888] hover:text-white text-sm transition-colors duration-200">
            How it Works
          </a>
          <a href="#testimonials" className="text-[#888888] hover:text-white text-sm transition-colors duration-200">
            Testimonials
          </a>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <a
            href="/sign-in"
            className="
              hidden md:block
              text-[#888888] hover:text-white text-sm font-medium
              transition-colors duration-200
            "
          >
            Sign In
          </a>
          <a
            href="/sign-up"
            className="
              bg-[#22c55e] text-black text-sm font-bold
              px-5 py-2 rounded-lg
              hover:bg-[#16a34a] transition-colors duration-200
            "
          >
            Get Started →
          </a>
        </div>

      </div>
    </nav>
  )
}
```

---

**FILE 2 — Create** `FrontEnd/src/components/landing/HeroSection.jsx`

```jsx
// Hero section with:
// - "Real-time Collaboration" pill badge at top
// - Large heading: "Code Together," "Learn Together"
// - Subtext about platform
// - Two buttons: "Start Coding Now →" and "Watch Demo ▶"
// - Stats: 10K+ Active Users, 50K+ Sessions, 99.9% Uptime
// - Right side: animated code editor mockup
// - Green particle dots in background

export default function HeroSection() {
  return (
    <section className="
      min-h-screen bg-[#0a0a0a]
      flex items-center pt-20
      relative overflow-hidden
    ">

      {/* Background green glow */}
      <div className="
        absolute top-1/4 left-1/4 w-96 h-96
        bg-[#22c55e]/5 rounded-full blur-3xl
        pointer-events-none
      " />

      <div className="max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left content */}
          <div>
            {/* Badge */}
            <div className="
              inline-flex items-center gap-2 mb-6
              bg-[#22c55e]/10 border border-[#22c55e]/30
              text-[#22c55e] text-sm font-medium
              px-4 py-2 rounded-full
            ">
              <span>⚡</span>
              <span>Real-time Collaboration</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Code Together,
              <br />
              <span className="text-[#22c55e]">Learn Together</span>
            </h1>

            {/* Subtext */}
            <p className="text-[#888888] text-lg leading-relaxed mb-8 max-w-lg">
              The ultimate platform for collaborative coding interviews
              and pair programming. Connect face-to-face, code in real-time,
              and ace your technical interviews.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-3 mb-8">
              {['✓ Live Video Chat', '✓ Code Editor', '✓ Multi-Language'].map(f => (
                <span key={f} className="
                  text-[#888888] text-sm
                  border border-[#2a2a2a] rounded-full
                  px-4 py-1.5
                ">
                  {f}
                </span>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mb-12">
              <a
                href="/sign-up"
                className="
                  bg-[#22c55e] text-black font-bold
                  px-8 py-3.5 rounded-xl text-base
                  hover:bg-[#16a34a] transition-colors duration-200
                "
              >
                Start Coding Now →
              </a>
              <button className="
                flex items-center gap-2
                border border-[#2a2a2a] text-white font-medium
                px-8 py-3.5 rounded-xl text-base
                hover:border-[#22c55e] hover:text-[#22c55e]
                transition-all duration-200
              ">
                <span>▶</span>
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-8">
              {[
                { value: '10K+',  label: 'Active Users' },
                { value: '50K+',  label: 'Sessions' },
                { value: '99.9%', label: 'Uptime' }
              ].map(stat => (
                <div key={stat.label}>
                  <div className="text-2xl font-black text-[#22c55e]">
                    {stat.value}
                  </div>
                  <div className="text-[#888888] text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Code Editor Mockup */}
          <div className="hidden lg:block">
            <div className="
              bg-[#111111] border border-[#2a2a2a]
              rounded-2xl overflow-hidden
              shadow-[0_0_60px_rgba(34,197,94,0.1)]
            ">
              {/* Editor header */}
              <div className="
                bg-[#0a0a0a] border-b border-[#2a2a2a]
                px-4 py-3 flex items-center gap-2
              ">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-[#888888] text-xs ml-4 font-mono">
                  twoSum.js — CodeHire Session
                </span>
              </div>

              {/* Code content */}
              <div className="p-6 font-mono text-sm leading-relaxed">
                <div className="text-[#888888]">
                  <span className="text-purple-400">function </span>
                  <span className="text-yellow-300">twoSum</span>
                  <span className="text-white">(nums, target) {'{'}</span>
                </div>
                <div className="text-[#888888] pl-6">
                  <span className="text-purple-400">const </span>
                  <span className="text-blue-300">map</span>
                  <span className="text-white"> = {'{'}{'}'};</span>
                </div>
                <div className="text-[#888888] pl-6">
                  <span className="text-purple-400">for </span>
                  <span className="text-white">(</span>
                  <span className="text-purple-400">let </span>
                  <span className="text-blue-300">i</span>
                  <span className="text-white"> = 0; i {'<'} nums.length; i++) {'{'}</span>
                </div>
                <div className="text-[#888888] pl-12">
                  <span className="text-purple-400">const </span>
                  <span className="text-blue-300">comp</span>
                  <span className="text-white"> = target - nums[i];</span>
                </div>
                <div className="text-[#888888] pl-12">
                  <span className="text-purple-400">if </span>
                  <span className="text-white">(map[comp] !== </span>
                  <span className="text-purple-400">undefined</span>
                  <span className="text-white">) {'{'}</span>
                </div>
                <div className="text-[#888888] pl-16">
                  <span className="text-purple-400">return </span>
                  <span className="text-white">[map[comp], i];</span>
                </div>
                <div className="text-[#888888] pl-12">{'}'}</div>
                <div className="text-[#888888] pl-12">
                  <span className="text-white">map[nums[i]] = i;</span>
                </div>
                <div className="text-[#888888] pl-6">{'}'}</div>
                <div className="text-[#888888]">{'}'}</div>

                {/* Live indicator */}
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#22c55e] rounded-full animate-pulse" />
                  <span className="text-[#22c55e] text-xs">
                    2 developers coding live
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
```

---

**FILE 3 — Create** `FrontEnd/src/components/landing/TrustedBySection.jsx`

```jsx
// Trusted by section with:
// - "Trusted by developers at" heading
// - Row of company logos as text (Google, Amazon, Microsoft, Meta, Apple, Netflix)
// - Subtle separator lines

export default function TrustedBySection() {
  const companies = [
    'Google', 'Amazon', 'Microsoft', 'Meta', 'Apple', 'Netflix', 'Uber', 'Stripe'
  ]

  return (
    <section className="bg-[#0a0a0a] py-16 border-y border-[#2a2a2a]">
      <div className="max-w-7xl mx-auto px-6">

        <p className="text-center text-[#555555] text-sm mb-8 uppercase tracking-widest">
          Trusted by developers at
        </p>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {companies.map(company => (
            <span
              key={company}
              className="
                text-[#555555] text-lg font-bold
                hover:text-[#888888] transition-colors duration-200
                cursor-default
              "
            >
              {company}
            </span>
          ))}
        </div>

      </div>
    </section>
  )
}
```

---

**FILE 4 — Create** `FrontEnd/src/components/landing/FeaturesSection.jsx`

```jsx
// Features section with:
// - Section heading "Everything You Need to Succeed"
// - 6 feature cards in 3x2 grid
// - Each card: icon, title, description
// - Cards have hover animation

export default function FeaturesSection() {
  const features = [
    {
      icon: '📹',
      title: 'HD Video Call',
      description: 'Crystal clear video and audio for seamless communication during interviews'
    },
    {
      icon: '💻',
      title: 'Live Code Editor',
      description: 'Collaborate in real-time with syntax highlighting and multiple language support'
    },
    {
      icon: '👥',
      title: 'Easy Collaboration',
      description: 'Share your screen, discuss solutions, and learn from each other in real-time'
    },
    {
      icon: '🤖',
      title: 'AI Code Hints',
      description: 'Get intelligent hints powered by AI to guide candidates without giving away answers'
    },
    {
      icon: '📊',
      title: 'Auto Scoring',
      description: 'Automatically evaluate solutions against hidden test cases for objective assessment'
    },
    {
      icon: '📄',
      title: 'Report Card',
      description: 'Generate beautiful PDF reports with AI code review and interview summary'
    }
  ]

  return (
    <section id="features" className="bg-[#0a0a0a] py-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section header */}
        <div className="text-center mb-16">
          <div className="
            inline-flex items-center gap-2 mb-4
            bg-[#22c55e]/10 border border-[#22c55e]/30
            text-[#22c55e] text-sm font-medium
            px-4 py-2 rounded-full
          ">
            ✨ Features
          </div>
          <h2 className="text-4xl font-black text-white mb-4">
            Everything You Need to{' '}
            <span className="text-[#22c55e]">Succeed</span>
          </h2>
          <p className="text-[#888888] text-lg max-w-2xl mx-auto">
            Powerful features designed to make your coding interviews
            seamless and productive
          </p>
        </div>

        {/* Feature cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="
                bg-[#111111] border border-[#2a2a2a]
                rounded-2xl p-6
                hover:-translate-y-1 hover:scale-[1.02]
                hover:border-[#22c55e]
                hover:shadow-[0_0_20px_rgba(34,197,94,0.1)]
                transition-all duration-300
                group cursor-default
              "
            >
              <div className="
                w-12 h-12 rounded-xl mb-4
                bg-[#22c55e]/10 border border-[#22c55e]/20
                flex items-center justify-center text-2xl
                group-hover:bg-[#22c55e]/20
                transition-colors duration-300
              ">
                {feature.icon}
              </div>
              <h3 className="
                text-white font-bold text-lg mb-2
                group-hover:text-[#22c55e]
                transition-colors duration-300
              ">
                {feature.title}
              </h3>
              <p className="text-[#888888] text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
```

---

**FILE 5 — Create** `FrontEnd/src/components/landing/HowItWorksSection.jsx`

```jsx
// How it works section with:
// - 4 steps in a horizontal timeline
// - Step number, title, description
// - Connecting line between steps

export default function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Sign Up',
      description: 'Create your account as a host or candidate in under a minute'
    },
    {
      number: '02',
      title: 'Create Session',
      description: 'Host creates an interview session and shares the invite code'
    },
    {
      number: '03',
      title: 'Code Together',
      description: 'Collaborate in real-time with live video, code editor and AI hints'
    },
    {
      number: '04',
      title: 'Get Report',
      description: 'Receive an AI-powered report card with scores and feedback'
    }
  ]

  return (
    <section id="how-it-works" className="bg-[#050505] py-24 border-y border-[#2a2a2a]">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section header */}
        <div className="text-center mb-16">
          <div className="
            inline-flex items-center gap-2 mb-4
            bg-[#22c55e]/10 border border-[#22c55e]/30
            text-[#22c55e] text-sm font-medium
            px-4 py-2 rounded-full
          ">
            🔄 How It Works
          </div>
          <h2 className="text-4xl font-black text-white mb-4">
            Get Started in{' '}
            <span className="text-[#22c55e]">4 Simple Steps</span>
          </h2>
          <p className="text-[#888888] text-lg max-w-xl mx-auto">
            From signup to your first interview in minutes
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">

          {/* Connecting line — desktop only */}
          <div className="
            hidden lg:block
            absolute top-8 left-[12.5%] right-[12.5%] h-px
            bg-gradient-to-r from-transparent via-[#22c55e]/30 to-transparent
          " />

          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center relative">

              {/* Step number circle */}
              <div className="
                w-16 h-16 rounded-full mb-6
                bg-[#22c55e] text-black
                flex items-center justify-center
                text-xl font-black
                shadow-[0_0_20px_rgba(34,197,94,0.3)]
                relative z-10
              ">
                {step.number}
              </div>

              <h3 className="text-white font-bold text-lg mb-2">
                {step.title}
              </h3>
              <p className="text-[#888888] text-sm leading-relaxed">
                {step.description}
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  )
}
```

---

**FILE 6 — Create** `FrontEnd/src/components/landing/TestimonialsSection.jsx`

```jsx
// Testimonials section with:
// - 3 testimonial cards
// - Each: quote, name, role, company, avatar initial

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote: "CodeHire completely changed how we conduct technical interviews. The real-time collaboration and AI hints make the process so much more effective.",
      name: "Sarah Chen",
      role: "Engineering Manager",
      company: "Google",
      initial: "S"
    },
    {
      quote: "I landed my dream job after practicing on CodeHire. The solution tab and AI feedback helped me improve my problem-solving approach significantly.",
      name: "Marcus Johnson",
      role: "Software Engineer",
      company: "Meta",
      initial: "M"
    },
    {
      quote: "The auto-scoring and report cards save us hours every week. We can evaluate 10x more candidates with better objectivity than before.",
      name: "Priya Patel",
      role: "Tech Lead",
      company: "Amazon",
      initial: "P"
    }
  ]

  return (
    <section id="testimonials" className="bg-[#0a0a0a] py-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section header */}
        <div className="text-center mb-16">
          <div className="
            inline-flex items-center gap-2 mb-4
            bg-[#22c55e]/10 border border-[#22c55e]/30
            text-[#22c55e] text-sm font-medium
            px-4 py-2 rounded-full
          ">
            ⭐ Testimonials
          </div>
          <h2 className="text-4xl font-black text-white mb-4">
            Loved by{' '}
            <span className="text-[#22c55e]">Developers</span>
          </h2>
          <p className="text-[#888888] text-lg max-w-xl mx-auto">
            Join thousands of developers who trust CodeHire
          </p>
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="
                bg-[#111111] border border-[#2a2a2a]
                rounded-2xl p-6
                hover:border-[#22c55e]/50
                hover:shadow-[0_0_20px_rgba(34,197,94,0.05)]
                transition-all duration-300
              "
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <span key={j} className="text-[#22c55e] text-sm">★</span>
                ))}
              </div>

              {/* Quote */}
              <p className="text-[#888888] text-sm leading-relaxed mb-6">
                "{t.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="
                  w-10 h-10 rounded-full
                  bg-[#22c55e] text-black
                  flex items-center justify-center
                  font-bold text-sm flex-shrink-0
                ">
                  {t.initial}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">
                    {t.name}
                  </div>
                  <div className="text-[#555555] text-xs">
                    {t.role} at {t.company}
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
```

---

**FILE 7 — Create** `FrontEnd/src/components/landing/CTASection.jsx`

```jsx
// CTA section with:
// - Large heading "Ready to Ace Your Next Interview?"
// - Subtext
// - Two buttons: Get Started Free + Watch Demo
// - Green glow background effect

export default function CTASection() {
  return (
    <section className="bg-[#050505] py-24 border-t border-[#2a2a2a]">
      <div className="max-w-4xl mx-auto px-6 text-center relative">

        {/* Background glow */}
        <div className="
          absolute inset-0 flex items-center justify-center
          pointer-events-none
        ">
          <div className="
            w-96 h-96 bg-[#22c55e]/5
            rounded-full blur-3xl
          " />
        </div>

        <div className="relative z-10">
          <div className="
            inline-flex items-center gap-2 mb-6
            bg-[#22c55e]/10 border border-[#22c55e]/30
            text-[#22c55e] text-sm font-medium
            px-4 py-2 rounded-full
          ">
            🚀 Get Started Today
          </div>

          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
            Ready to Ace Your
            <br />
            <span className="text-[#22c55e]">Next Interview?</span>
          </h2>

          <p className="text-[#888888] text-lg mb-10 max-w-xl mx-auto">
            Join thousands of developers and companies using CodeHire
            for better technical interviews.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/sign-up"
              className="
                bg-[#22c55e] text-black font-bold
                px-10 py-4 rounded-xl text-base
                hover:bg-[#16a34a] transition-colors duration-200
                shadow-[0_0_30px_rgba(34,197,94,0.3)]
              "
            >
              Get Started Free →
            </a>
            <a
              href="#how-it-works"
              className="
                border border-[#2a2a2a] text-white font-medium
                px-10 py-4 rounded-xl text-base
                hover:border-[#22c55e] hover:text-[#22c55e]
                transition-all duration-200
              "
            >
              Learn More
            </a>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-6 mt-10">
            {[
              '✓ Free to start',
              '✓ No credit card required',
              '✓ 10K+ developers'
            ].map(item => (
              <span key={item} className="text-[#555555] text-sm">
                {item}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
```

---

**FILE 8 — Create** `FrontEnd/src/components/landing/LandingFooter.jsx`

```jsx
// Footer with:
// - Logo and tagline
// - 3 link columns: Product, Company, Legal
// - Bottom bar: copyright + social links

export default function LandingFooter() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-[#2a2a2a] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Logo column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="
                w-8 h-8 bg-[#22c55e] rounded-lg
                flex items-center justify-center
                text-black font-bold text-sm
              ">
                ⚡
              </div>
              <span className="text-white font-bold text-lg">CodeHire</span>
            </div>
            <p className="text-[#555555] text-sm leading-relaxed">
              The ultimate platform for collaborative coding interviews
              and pair programming.
            </p>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Product</h4>
            <ul className="space-y-3">
              {['Features', 'How it Works', 'Problem Bank', 'Pricing'].map(link => (
                <li key={link}>
                  <a href="#" className="text-[#555555] hover:text-white text-sm transition-colors duration-200">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-3">
              {['About', 'Blog', 'Careers', 'Contact'].map(link => (
                <li key={link}>
                  <a href="#" className="text-[#555555] hover:text-white text-sm transition-colors duration-200">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Legal</h4>
            <ul className="space-y-3">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(link => (
                <li key={link}>
                  <a href="#" className="text-[#555555] hover:text-white text-sm transition-colors duration-200">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="
          border-t border-[#2a2a2a] pt-8
          flex flex-col md:flex-row
          items-center justify-between gap-4
        ">
          <p className="text-[#555555] text-sm">
            © 2026 CodeHire. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {['Twitter', 'GitHub', 'LinkedIn'].map(social => (
              <a
                key={social}
                href="#"
                className="text-[#555555] hover:text-white text-sm transition-colors duration-200"
              >
                {social}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  )
}
```

---

**FILE 9 — Create** `FrontEnd/src/pages/LandingPage.jsx`

This is the main landing page that combines all sections:

```jsx
import LandingNavbar      from '../components/landing/LandingNavbar'
import HeroSection        from '../components/landing/HeroSection'
import TrustedBySection   from '../components/landing/TrustedBySection'
import FeaturesSection    from '../components/landing/FeaturesSection'
import HowItWorksSection  from '../components/landing/HowItWorksSection'
import TestimonialsSection from '../components/landing/TestimonialsSection'
import CTASection         from '../components/landing/CTASection'
import LandingFooter      from '../components/landing/LandingFooter'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <LandingNavbar />
      <HeroSection />
      <TrustedBySection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
      <LandingFooter />
    </div>
  )
}
```

---

**FILE 10 — Update** `FrontEnd/src/App.jsx`

Find the existing landing page route and UPDATE it to use the new LandingPage:

```jsx
// Add import at top
import LandingPage from './pages/LandingPage'

// Find the existing route for "/" and change it to:
<Route path="/" element={<LandingPage />} />

// Do NOT change any other routes
// Do NOT remove sign-in, sign-up, dashboard, or session routes
```

---

**Summary of files to create or modify:**
```
CREATE → FrontEnd/src/components/landing/LandingNavbar.jsx
CREATE → FrontEnd/src/components/landing/HeroSection.jsx
CREATE → FrontEnd/src/components/landing/TrustedBySection.jsx
CREATE → FrontEnd/src/components/landing/FeaturesSection.jsx
CREATE → FrontEnd/src/components/landing/HowItWorksSection.jsx
CREATE → FrontEnd/src/components/landing/TestimonialsSection.jsx
CREATE → FrontEnd/src/components/landing/CTASection.jsx
CREATE → FrontEnd/src/components/landing/LandingFooter.jsx
CREATE → FrontEnd/src/pages/LandingPage.jsx
MODIFY → FrontEnd/src/App.jsx (update "/" route only)

Everything else → DO NOT TOUCH
```

### ====== END OF ANTIGRAVITY PROMPT ======

---

## 🧪 Step 3 — YOU — Test Everything (10 minutes)

### Test 1 — Landing page loads
```
Open http://localhost:5173
Expected → New landing page shows ✅
Expected → Dark background #0a0a0a ✅
Expected → Green CodeHire logo visible ✅
```

### Test 2 — All sections visible
```
Scroll down the page:
✅ Navbar fixed at top
✅ Hero with code editor mockup
✅ Trusted By companies row
✅ Features 6-card grid
✅ How It Works 4 steps
✅ Testimonials 3 cards
✅ CTA section with green glow
✅ Footer with links
```

### Test 3 — Navigation works
```
✅ Get Started button → goes to /sign-up
✅ Sign In link → goes to /sign-in
✅ Anchor links scroll to sections
✅ All other routes unchanged (dashboard, session, etc)
```

### Test 4 — Responsive
```
Test on mobile width (375px):
✅ Navbar collapses correctly
✅ Hero stacks vertically
✅ Feature cards stack
✅ Steps stack vertically
✅ Footer stacks
```

### Test 5 — Hover effects
```
✅ Feature cards lift on hover
✅ Testimonial cards get green border
✅ Buttons change color on hover
✅ Nav links change color on hover
```

---

## ✅ Complete Checklist

```
Components Created
  □ LandingNavbar.jsx
  □ HeroSection.jsx
  □ TrustedBySection.jsx
  □ FeaturesSection.jsx
  □ HowItWorksSection.jsx
  □ TestimonialsSection.jsx
  □ CTASection.jsx
  □ LandingFooter.jsx
  □ LandingPage.jsx

App.jsx Updated
  □ "/" route uses new LandingPage
  □ All other routes unchanged

Visual Checks
  □ Dark theme matches existing app
  □ Green #22c55e used consistently
  □ Navbar is sticky/fixed
  □ Hero code mockup visible on desktop
  □ All 6 feature cards show
  □ All 4 steps show
  □ All 3 testimonials show
  □ CTA buttons work
  □ Footer links render

Existing Pages Untouched
  □ Dashboard still works
  □ Problem Bank still works
  □ Interview session still works
  □ Sign in/up still works
  □ Practice problems still works
```

---

## ⚠️ Common Issues and Fixes

### Issue 1 — Old landing page still showing
```
Check App.jsx — make sure "/" route
points to LandingPage not the old component
```

### Issue 2 — Sections not found error
```
Check all import paths in LandingPage.jsx
All components must be in:
FrontEnd/src/components/landing/
```

### Issue 3 — Tailwind classes not working
```
Make sure tailwind.config.js content includes:
"./src/**/*.{js,jsx,ts,tsx}"
```

### Issue 4 — Sign in/up buttons go to wrong route
```
Check your existing auth routes in App.jsx
Update href in LandingNavbar and CTASection
to match your exact route paths
```

---

## ❌ Do NOT Do These

```
❌ Do not delete the old landing page file (keep as backup)
❌ Do not change auth routes
❌ Do not change dashboard routes
❌ Do not modify any backend files
❌ Do not add any external libraries
```
