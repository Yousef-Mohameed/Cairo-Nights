import { useEffect } from 'react'
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
import Matches from './components/Matches'
import Menu from './components/Menu'
import Gallery from './components/Gallery'
import About from './components/About'
import Contact from './components/Contact'
import NotFound from './components/NotFound'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import ScrollToTop from './components/ScrollToTop'
import Loader from './components/Loader'

const titles: Record<string, string> = {
  '/': 'ليالي القاهرة | Cairo Nights 969AD',
  '/matches': 'ماتشات الأسبوع | ليالي القاهرة',
  '/menu': 'المنيو | ليالي القاهرة',
  '/gallery': 'معرض الصور | ليالي القاهرة',
  '/about': 'حكايتنا | ليالي القاهرة',
  '/contact': 'تواصل معانا واحجز طاولتك | ليالي القاهرة',
}

function App() {
  const location = useLocation()

  // عنوان التبويب بيتغير مع كل صفحة
  useEffect(() => {
    document.title = titles[location.pathname] ?? 'الصفحة مش موجودة | ليالي القاهرة'
  }, [location.pathname])

  // لو الرابط فيه #حاجة (زي /contact#booking) نروح للجزء ده، غير كده نطلع لأول الصفحة
  useEffect(() => {
    if (location.hash) {
      const id = decodeURIComponent(location.hash.slice(1))
      const t = setTimeout(
        () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
        150,
      )
      return () => clearTimeout(t)
    }
    window.scrollTo(0, 0)
  }, [location.pathname, location.hash])

  return (
    <>
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.main>
      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
    </>
  )
}

export default App