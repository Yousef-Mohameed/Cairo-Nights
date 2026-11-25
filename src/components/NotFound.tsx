import { Link } from 'react-router-dom'
import Lantern from './Lantern'

function NotFound() {
  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden bg-night-soft bg-arabesque px-5 py-20 text-center">
      <Lantern className="absolute top-0 left-[12%] w-8 animate-float motion-reduce:animate-none sm:w-11" />
      <Lantern className="absolute top-0 right-[14%] w-7 animate-float motion-reduce:animate-none [animation-delay:2s] sm:w-10" />

      <p className="font-ruqaa text-[5rem] leading-none text-gold md:text-[7rem]">404</p>
      <h1 className="font-ruqaa mb-3 text-[2rem] text-gold-light md:text-[2.6rem]">الصفحة دي مش موجودة</h1>
      <p className="mb-8 max-w-md">يمكن اللينك غلط أو الصفحة اتنقلت. تعالى نرجعلك للرئيسية.</p>

      <div className="flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="rounded-full bg-gold px-8 py-3 font-bold text-night transition duration-300 hover:scale-105 hover:bg-gold-light"
        >
          الرئيسية
        </Link>
        <Link
          to="/menu"
          className="rounded-full border border-gold px-8 py-3 font-bold text-gold transition duration-300 hover:scale-105 hover:bg-gold/15"
        >
          المنيو
        </Link>
      </div>
    </section>
  )
}

export default NotFound