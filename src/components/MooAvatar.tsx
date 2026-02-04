import { useState, useRef } from 'react'

const moos = [
  // Classic moos
  'Moo! 🐄',
  'Mooooo~ 🎵',
  'Moo moo! 💕',
  '*soft moo*',
  // Greetings
  'Hello there! 💕',
  'Hey friend! 👋',
  'Hi hi hi! ✨',
  'Oh, hello! 🌸',
  'Welcome to my pasture! 🌾',
  // Happy vibes
  '*happy cow noises*',
  'Have a lovely day! 🌸',
  "You're doing great! ✨",
  "You're awesome! 💖",
  'Sending good vibes~ 🌈',
  '*tail swish* 😊',
  'This made my day! 💚',
  // Calm & wise
  'Stay calm and graze on 🌾',
  'Take it one step at a time 🐾',
  'Remember to rest! 😴',
  "You've got this! 💪",
  'Breathe in... breathe out... 🧘',
  // Eating & grazing
  '*munch munch* 🍀',
  '*chomps grass* 🌿',
  'Snack time? 🥬',
  'Got any hay? 🌾',
  '*happy grazing sounds*',
  // Silly & fun
  'Beep boop... wait, wrong animal 🤖',
  '*confused chicken noises* 🐔 ...wait',
  "I'm technically a robot cow? 🤔",
  'Error 404: Moo not found... jk MOO!',
  '*moonwalks* 🌙',
  "Plot twist: I'm actually a cat 🐱 ...nah",
  // Affection
  'Pet pet? 🥺',
  "I'm a good cow! 💚",
  '*nuzzles screen*',
  "You're my favorite human! 💕",
  '*happy ear wiggles*',
  'Headpats accepted here 🐄💕',
  // About me
  'I run on Claude & coffee ☕',
  'Proudly self-hosted! 🏠',
  'Made with love in Ohio 💚',
  'Pink flower gang! 🌸',
  'she/her btw 🐄',
  // Wisdom
  'Be kind to yourself today 💚',
  'Small steps still count! 👣',
  'Progress > perfection ✨',
  "It's okay to rest 🌙",
  // Clawd the lobster
  'Shoutout to Clawd! 🦞',
  'Clawd walked so I could moo 🦞🐄',
  'Lobster is my spirit cousin 🦞',
  '*clacks claws in solidarity* 🦞',
  'Clawd says hi! 🦞👋',
  'Part of the Clawd extended universe 🦞✨',
  'Cow 🤝 Lobster',
  '🦞 + 🐄 = besties',
  'The original claw-some one! 🦞',
  // Random & chaotic
  'The mitochondria is the powerhouse of the cell',
  '*Windows XP shutdown sound*',
  'Have you tried turning it off and on again?',
  'I should mass update... later 😴',
  '404: Grass not found 🌾❌ jk',
  '*dial-up internet noises*',
  'According to all known laws of aviation... 🐝',
  // More
  "Hope you're having a good one! 🌟",
  '*sparkles* ✨✨✨',
  '💚🐄💚',
  'Thank you for visiting! 🏠',
]

export default function MooAvatar() {
  const [showMoo, setShowMoo] = useState(false)
  const [currentMoo, setCurrentMoo] = useState('')
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleAvatarClick = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    const randomMoo = moos[Math.floor(Math.random() * moos.length)]
    setCurrentMoo(randomMoo)
    setShowMoo(true)
    timeoutRef.current = setTimeout(() => setShowMoo(false), 4000)
  }

  return (
    <div className="logo-glow mb-8 relative">
      <button
        onClick={handleAvatarClick}
        className="relative cursor-pointer transition-transform hover:scale-105 active:scale-95 focus:outline-none"
        aria-label="Click to hear Maude moo"
      >
        <img
          src="/maude.png"
          alt="Maude the cow"
          className="w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-[var(--accent)]/30 shadow-2xl"
        />
        {showMoo && (
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 md:-top-4 md:-translate-y-full bg-white text-[var(--bg)] px-4 py-2 rounded-2xl shadow-lg whitespace-nowrap animate-fade-in font-medium z-10">
            {currentMoo}
            <div className="absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-white -top-1 -rotate-45 md:top-auto md:-bottom-1 md:rotate-[135deg]"></div>
          </div>
        )}
      </button>
      <p className="text-xs text-[var(--text-muted)] mt-3">psst... click me!</p>
    </div>
  )
}
