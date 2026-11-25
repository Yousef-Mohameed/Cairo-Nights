import Lantern from './Lantern'

// مؤشر تحميل صغير بنفس شكل شاشة التحميل، بيتحط مكان المحتوى لحد ما يوصل
function LoadingBlock({ text = 'لحظة من فضلك...' }: { text?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-4 py-16 text-center"
    >
      <Lantern className="w-12 animate-float motion-reduce:animate-none" />
      <p className="text-gold-light">{text}</p>
      <div dir="ltr" className="h-0.5 w-40 overflow-hidden rounded-full bg-gold/20">
        <div className="h-full w-1/3 animate-loadbar rounded-full bg-gold motion-reduce:animate-none" />
      </div>
    </div>
  )
}

export default LoadingBlock