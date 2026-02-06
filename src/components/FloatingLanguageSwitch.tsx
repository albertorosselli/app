interface FloatingLanguageSwitchProps {
  active: 'no' | 'en'
  onChange: (value: 'no' | 'en') => void
}

export default function FloatingLanguageSwitch({ active, onChange }: FloatingLanguageSwitchProps) {
  return (
    <div className="fixed bottom-4 right-4 z-[120] flex flex-col gap-2 text-xs font-semibold text-white/80">
      <button
        onClick={() => onChange('no')}
        className={`px-3 py-1 rounded-full border border-white/20 backdrop-blur bg-black/60 hover:bg-white/10 transition ${active === 'no' ? 'opacity-100' : 'opacity-80'}`}
      >
        🇳🇴 NO
      </button>
      <button
        onClick={() => onChange('en')}
        className={`px-3 py-1 rounded-full border border-white/20 backdrop-blur bg-black/60 hover:bg-white/10 transition ${active === 'en' ? 'opacity-100' : 'opacity-80'}`}
      >
        🇺🇸 US
      </button>
    </div>
  )
}
