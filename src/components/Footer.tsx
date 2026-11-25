import { Link } from 'react-router-dom'
import { cafe } from '../data/cafe'
import InstallButton from './InstallButton'

function Footer() {
  return (
    <footer className="border-t border-gold/40 bg-night px-5 py-10 text-center">
      <p className="font-ruqaa mb-3 text-3xl text-gold">{cafe.name}</p>
      <nav className="mb-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
        <Link to="/" className="hover:text-gold">الرئيسية</Link>
        <Link to="/matches" className="hover:text-gold">الماتشات</Link>
        <Link to="/menu" className="hover:text-gold">المنيو</Link>
        <Link to="/gallery" className="hover:text-gold">المعرض</Link>
        <Link to="/about" className="hover:text-gold">حكايتنا</Link>
        <Link to="/contact" className="hover:text-gold">تواصل معانا</Link>
      </nav>
      <div className="mb-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gold-light">
        {cafe.facebook && <a href={cafe.facebook} target="_blank" rel="noreferrer" className="hover:text-gold">فيسبوك</a>}
        {cafe.instagram && <a href={cafe.instagram} target="_blank" rel="noreferrer" className="hover:text-gold">إنستجرام</a>}
        <a href={`tel:${cafe.phone}`} dir="ltr" className="hover:text-gold">{cafe.phone}</a>
      </div>
      <InstallButton />
      <p className="text-xs opacity-60">
        © {new Date().getFullYear()} {cafe.name}. كل الحقوق محفوظة.
      </p>
    </footer>
  )
}

export default Footer