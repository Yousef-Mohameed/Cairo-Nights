import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { photoUrl } from '../data/menu'

type Props = {
  // بيجرب الصور بالترتيب: صورة الصنف ثم صورة القسم ثم الأيقونة
  keys: (string | undefined)[]
  alt: string
  Icon: LucideIcon
  className?: string
}

function MenuPhoto({ keys, alt, Icon, className = '' }: Props) {
  const sources = keys.filter((k): k is string => Boolean(k))
  const [index, setIndex] = useState(0)
  const src = sources[index]

  if (!src) {
    return (
      <div className={'flex items-center justify-center bg-night/60 ' + className}>
        <Icon className="size-10 text-gold/80" />
      </div>
    )
  }

  return (
    <img
      src={photoUrl(src)}
      alt={alt}
      loading="lazy"
      onError={() => setIndex((i) => i + 1)}
      className={'object-cover ' + className}
    />
  )
}

export default MenuPhoto