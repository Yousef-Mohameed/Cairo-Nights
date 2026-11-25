import { useState } from 'react'

type Props = { name: string; crest?: string; className?: string }

// شعار الفريق، ولو ما اتحمّلش بنعرض أول حرف من الاسم
function TeamCrest({ name, crest, className = 'size-14' }: Props) {
  const [failed, setFailed] = useState(false)

  if (crest && !failed) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center rounded-full bg-cream/95 p-2 shadow-[0_0_18px_rgba(217,164,91,0.25)] ${className}`}
      >
        <img
          src={crest}
          alt=""
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className="size-full object-contain"
        />
      </div>
    )
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full border border-gold/60 bg-night text-2xl font-bold text-gold shadow-[0_0_18px_rgba(217,164,91,0.25)] ${className}`}
    >
      {name.charAt(0)}
    </div>
  )
}

export default TeamCrest