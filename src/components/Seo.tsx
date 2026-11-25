import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { cafe } from '../data/cafe'

const SITE = 'https://cairo-nights.vercel.app'
const OG_IMAGE = `${SITE}/images/og-image.jpg`

type PageMeta = { title: string; description: string; noindex?: boolean }

const pages: Record<string, PageMeta> = {
  '/': {
    title: 'ليالي القاهرة | Cairo Nights 969AD',
    description: 'ليالي القاهرة: كافيه بطابع القاهرة القديمة. شوف المنيو، تابع ماتشات الأسبوع، واحجز طاولتك على واتساب.',
  },
  '/matches': {
    title: 'ماتشات الأسبوع | ليالي القاهرة',
    description: 'مواعيد ماتشات الأسبوع واللي هتتذاع عندنا في ليالي القاهرة. شوف الماتش واحجز طاولتك قبل الزحمة.',
  },
  '/menu': {
    title: 'المنيو | ليالي القاهرة',
    description: 'منيو ليالي القاهرة بالأسعار: قهوة ومشروبات ساخنة وباردة وشيشة وحلويات. اطلب من الموقع وابعت طلبك على واتساب.',
  },
  '/gallery': {
    title: 'معرض الصور | ليالي القاهرة',
    description: 'صور من جو ليالي القاهرة: المشربيات والفوانيس وسهرات القاهرة القديمة.',
  },
  '/about': {
    title: 'حكايتنا | ليالي القاهرة',
    description: 'حكاية ليالي القاهرة 969AD، كافيه مستوحى من القاهرة القديمة وقاهرة المعز.',
  },
  '/contact': {
    title: 'تواصل معانا واحجز طاولتك | ليالي القاهرة',
    description: 'احجز طاولتك في ليالي القاهرة أو كلمنا على واتساب. العنوان ومواعيد العمل وطرق التواصل.',
  },
  '/qr': {
    title: 'باركود المنيو | ليالي القاهرة',
    description: 'باركود منيو ليالي القاهرة.',
    noindex: true,
  },
}

const notFound: PageMeta = {
  title: 'الصفحة مش موجودة | ليالي القاهرة',
  description: 'الصفحة دي مش موجودة.',
  noindex: true,
}

export function pageTitle(pathname: string) {
  return (pages[pathname] ?? notFound).title
}

function setMeta(selector: string, attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.rel = 'canonical'
    document.head.appendChild(el)
  }
  el.href = href
}

// بيانات منظمة لجوجل: بتتحدّث لوحدها لما تملا العنوان والمواعيد في data/cafe.ts
function businessSchema() {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'CafeOrCoffeeShop',
    '@id': `${SITE}/#cafe`,
    name: cafe.name,
    alternateName: 'Cairo Nights 969AD',
    url: `${SITE}/`,
    image: OG_IMAGE,
    logo: `${SITE}/icons/icon-512.png`,
    telephone: '+' + cafe.whatsapp,
    inLanguage: 'ar-EG',
    hasMenu: `${SITE}/menu`,
    sameAs: [cafe.facebook, cafe.instagram],
  }
  if (cafe.address) {
    data.address = {
      '@type': 'PostalAddress',
      streetAddress: cafe.address,
      addressCountry: 'EG',
      addressLocality: 'القاهرة',
    }
    data.hasMap = `https://www.google.com/maps?q=${encodeURIComponent(cafe.mapQuery)}`
    data.geo = { '@type': 'GeoCoordinates', latitude: cafe.lat, longitude: cafe.lng }
  }
  if (cafe.schedule) {
    const pad = (n: number) => (n >= 24 ? '23:59' : String(n).padStart(2, '0') + ':00')
    data.openingHoursSpecification = {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: pad(cafe.schedule.open),
      closes: pad(cafe.schedule.close),
    }
  }
  return data
}

function Seo() {
  const { pathname } = useLocation()

  useEffect(() => {
    const meta = pages[pathname] ?? notFound
    const url = pages[pathname] ? `${SITE}${pathname === '/' ? '/' : pathname}` : `${SITE}/`

    document.title = meta.title
    setMeta('meta[name="description"]', 'name', 'description', meta.description)
    setMeta('meta[name="robots"]', 'name', 'robots', meta.noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large')
    setCanonical(url)
    setMeta('meta[property="og:title"]', 'property', 'og:title', meta.title)
    setMeta('meta[property="og:description"]', 'property', 'og:description', meta.description)
    setMeta('meta[property="og:url"]', 'property', 'og:url', url)
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', meta.title)
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', meta.description)

    let ld = document.getElementById('ld-business')
    if (!ld) {
      ld = document.createElement('script')
      ld.id = 'ld-business'
      ld.setAttribute('type', 'application/ld+json')
      document.head.appendChild(ld)
    }
    ld.textContent = JSON.stringify(businessSchema())
  }, [pathname])

  return null
}

export default Seo
