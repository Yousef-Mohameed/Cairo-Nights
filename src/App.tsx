import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { motion } from 'motion/react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import NextMatch from './components/NextMatch'
import Features from './components/Features'
import MenuHighlights from './components/MenuHighlights'
import MatchesTeaser from './components/MatchesTeaser'
import Reviews from './components/Reviews'
import GalleryPreview from './components/GalleryPreview'
import VisitCTA from './components/VisitCTA'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import Loader from './components/Loader'
import CartBar from './components/CartBar'
import Seo from './components/Seo'
import { Analytics } from '@vercel/analytics/react'

// الصفحات الجانبية بتتحمّل لما الزائر يفتحها بس، عشان الصفحة الرئيسية تفتح أسرع
const Matches = lazy(() => import('./components/Matches'))
const Menu = lazy(() => import('./components/Menu'))
const Gallery = lazy(() => import('./components/Gallery'))
const About = lazy(() => import('./components/About'))
const Contact = lazy(() => import('./components/Contact'))
const NotFound = lazy(() => import('./components/NotFound'))
const QrPage = lazy(() => import('./components/QrPage'))

function App() {
  const location = useLocation()

  // لو الرابط فيه #حاجة (زي /contact#booking) نروح للجزء ده، غير كده نطلع لأول الصفحة
  useEffect(() => {
    if (location.hash) {
      const id = decodeURIComponent(location.hash.slice(1))
      // الصفحة بتتحمّل بالتدريج، فبنحاول لحد ما الجزء يظهر (لحد 3 ثواني)
      let tries = 0
      const t = setInterval(() => {
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          clearInterval(t)
        } else if (++tries > 20) {
          clearInterval(t)
        }
      }, 150)
      return () => clearInterval(t)
    }
    window.scrollTo(0, 0)
  }, [location.pathname, location.hash])

  return (
    <>
      <Seo />
      <Loader />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:start-3 focus:top-3 focus:z-[200] focus:rounded-full focus:bg-gold focus:px-5 focus:py-2 focus:font-bold focus:text-night"
      >
        تخطّى للمحتوى
      </a>
      <Navbar />
      <motion.main
        id="main"
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <Suspense fallback={<div className="min-h-[60vh]" />}>
        <Routes location={location}>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <NextMatch />
                <Features />
                <MenuHighlights />
                <MatchesTeaser />
                <Reviews />
                <GalleryPreview />
                <VisitCTA />
              </>
            }
          />
          <Route path="/matches" element={<Matches />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/qr" element={<QrPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </motion.main>
      <Footer />
      <WhatsAppButton />
      <CartBar />
      <Analytics />
    </>
  )
}

export default App