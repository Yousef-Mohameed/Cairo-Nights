type Review = { name: string; text: string };
type Hours = { days: string; time: string };
// مواعيد للحساب التلقائي بتوقيت القاهرة (24 ساعة). لو بيقفل بعد نص الليل اكتب ساعة القفل أصغر من الفتح
type Schedule = { open: number; close: number };

export const cafe = {
  name: "ليالي القاهرة",
  phone: "01000220404",
  // رقم الواتساب بالصيغة الدولية من غير + أو أصفار (مصر = 20). غيّره لو مختلف عن رقم التليفون
  whatsapp: "201000220404",

  // العنوان اللي بيظهر للزباين. زوّد عليه اسم الشارع ومعلم قريب لما تعرفهم
  address: "بنها، القليوبية، مصر",
  // إحداثيات الكافيه على خرائط جوجل (بنستخدمها للخريطة وزرار الاتجاهات)
  location: { lat: 30.466157913208008, lng: 31.179309844970703 },
  // مثال: [{ days: 'كل يوم', time: 'من 4 العصر لـ 2 بعد نص الليل' }]
  hours: [] as Hours[],
  // مثال: { open: 16, close: 2 } = من 4 العصر لـ 2 بعد نص الليل. سيبه null لو مش عايز علامة "مفتوح دلوقتي"
  schedule: null as Schedule | null,
  // صاحب المكان: حط صورته في public/images واكتب اسم الملف في photo (مثال: "owner.jpg") عشان الكارت يظهر. سيبه "" لو مفيش صورة
  owner: { name: "", title: "صاحب ليالي القاهرة", photo: "" },
  facebook: "https://www.facebook.com/profile.php?id=61567415765880",
  instagram: "https://www.instagram.com/layalyelqahera969/",

  // أسماء ملفات الصور اللي في public/images، مثال: ['place1.jpg', 'tea.jpg']
  gallery: ['gallery-1.jpg', 'gallery-2.jpg', 'gallery-3.jpg', 'gallery-4.jpg', 'gallery-5.jpg', 'gallery-6.jpg'],
  // آراء حقيقية من الزباين بس. مثال: [{ name: 'أحمد', text: 'مكان جميل جدًا' }]
  reviews: [] as Review[],

  // رسالة عرض أو إعلان بتظهر في الرئيسية. سيبها فاضية لو مفيش
  announcement: "",
};