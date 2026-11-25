import {
  Apple,
  Blend,
  CakeSlice,
  Citrus,
  Coffee,
  CupSoda,
  Flame,
  GlassWater,
  Leaf,
  Martini,
  Milk,
  Snowflake,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'

// كل صنف ليه photo = اسم ملف في public/images/menu/  (مثال: 'latte-art' -> latte-art.jpg)
// لو الصورة مش موجودة بيجرب صورة القسم، ولو برضو مش موجودة بيعرض أيقونة.
export const MENU_IMAGES_DIR = '/images/menu'
export const photoUrl = (key: string) => `${MENU_IMAGES_DIR}/${key}.jpg`

export type MenuItem = {
  id: string
  name: string
  price: number
  photo?: string
  note?: string
  options?: string[]
  popular?: boolean
}

export type MenuCategory = {
  id: string
  label: string
  icon: LucideIcon
  photo?: string
  items: MenuItem[]
}

type Extra = { note?: string; options?: string[]; popular?: boolean }
let counter = 0
// لو أكتر من صنف استخدموا نفس المفتاح، كل صنف ياخد اسم صورة مختلف: espresso ثم espresso-2 ثم espresso-3
const photoCount: Record<string, number> = {}
const it = (name: string, price: number, photo?: string, extra: Extra = {}): MenuItem => {
  let key = photo
  if (photo) {
    photoCount[photo] = (photoCount[photo] ?? 0) + 1
    key = photoCount[photo] === 1 ? photo : `${photo}-${photoCount[photo]}`
  }
  return { id: `item-${++counter}`, name, price, photo: key, ...extra }
}

export const menu: MenuCategory[] = [
  {
    id: 'classic',
    label: 'القهوة الكلاسيكية والإسبريسو',
    icon: Coffee,
    photo: 'cat-classic',
    items: [
      it('إسبريسو', 45, 'espresso'),
      it('إسبريسو دبل', 55, 'espresso'),
      it('أمريكانو', 45, 'americano'),
      it('ماكياتو', 50, 'macchiato'),
      it('كابتشينو', 70, 'cappuccino'),
      it('لاتيه', 70, 'latte-art'),
      it('كورتادو', 70, 'latte-art'),
      it('فلات وايت', 75, 'latte-art'),
      it('موكا', 80, 'mocha'),
      it('سبانش لاتيه', 80, 'spanish-latte', { popular: true }),
      it('قهوة تركية', 45, 'turkish-coffee'),
      it('قهوة تركية دبل', 55, 'turkish-coffee'),
      it('قهوة بالبندق', 50, 'turkish-coffee'),
      it('قهوة فرنسية', 55, 'french-coffee'),
      it('نسكافيه كلاسيك', 40, 'nescafe'),
      it('نسكافيه بالحليب', 70, 'nescafe'),
      it('هوت شوكليت', 70, 'hot-chocolate'),
    ],
  },
  {
    id: 'iced-coffee',
    label: 'القهوة المثلجة والباردة',
    icon: Snowflake,
    photo: 'cat-iced-coffee',
    items: [
      it('أيس أمريكانو', 60, 'iced-americano'),
      it('أيس لاتيه', 80, 'iced-latte'),
      it('أيس موكا', 95, 'iced-mocha'),
      it('أيس سبانش لاتيه', 95, 'iced-spanish-latte'),
      it('أيس كراميل ميكاتو', 95, 'iced-caramel-macchiato'),
      it('أيس لاتيه بجوز الهند', 100, 'iced-latte'),
      it('قهوة كولد برو', 110, 'cold-brew'),
      it('V60 (ساخنة وباردة)', 110, 'pour-over'),
      it('كيميكس (ساخنة وباردة)', 110, 'pour-over'),
      it('قهوة أفوجاتو', 70, 'affogato', { note: 'اسبريسو بالفانيليا آيس كريم' }),
    ],
  },
  {
    id: 'matcha',
    label: 'ركن الماتشا',
    icon: Leaf,
    photo: 'cat-matcha',
    items: [
      it('ماتشا لاتيه كلاسيك', 90, 'matcha-latte', { note: 'ساخن وبارد' }),
      it('مانجو ماتشا', 95, 'fruit-matcha'),
      it('ماتشا الفراولة', 95, 'fruit-matcha'),
      it('ماتشا باشون فروت', 100, 'fruit-matcha'),
      it('ماتشا ليالي القاهرة', 110, 'matcha-latte', { popular: true }),
    ],
  },
  {
    id: 'frappe',
    label: 'فرابيه وقهوة مخلوطة',
    icon: Blend,
    photo: 'cat-frappe',
    items: [
      it('فرابيه كلاسيكي', 80, 'frappe'),
      it('فرابيه كراميل', 90, 'frappe'),
      it('فرابيه فانيليا', 90, 'frappe'),
      it('فرابيه موكا', 100, 'frappe-chocolate'),
      it('فرابيه الشوكليت', 90, 'frappe-chocolate'),
      it('فرابيه بندق', 90, 'frappe'),
    ],
  },
  {
    id: 'specialty',
    label: 'مشروبات قهوة مميزة',
    icon: Sparkles,
    photo: 'cat-specialty',
    items: [
      it('أيس موكا استوائية', 110, 'iced-mocha'),
      it('قهوة ليالي القاهرة الاسبيشيال', 110, 'signature-coffee', { popular: true }),
      it('قهوة الخان', 110, 'signature-coffee'),
      it('بلو أيس لاتيه', 90, 'blue-iced-latte'),
      it('قهوة السلطان', 110, 'sparkling-coffee', { note: 'قهوة فوارة صافية' }),
      it('لاتيه عثماني مثلج', 110, 'iced-latte'),
    ],
  },
  {
    id: 'tea',
    label: 'الشاي والمشروبات العشبية',
    icon: Flame,
    photo: 'cat-tea',
    items: [
      it('كوب شاي أحمد تي', 30, 'tea-cup'),
      it('كوب شاي نكهات', 40, 'tea-cup'),
      it('براد شاي أحمد تي', 45, 'tea-pot', { note: 'لفردين' }),
      it('براد شاي أحمد تي', 90, 'tea-pot', { note: 'لأربعة أفراد' }),
      it('براد زجاج شاي حليب بالورد والفانيليا', 100, 'glass-teapot', { note: '3 أفراد' }),
      it('براد زجاج شاي تفاح متبّل بالأعشاب', 90, 'glass-teapot', { note: '3 أفراد' }),
      it('براد زجاج شاي الكرك الأصلي', 120, 'glass-teapot', {
        note: 'بمزج من التوابل الفاخرة واللبن - 3 أفراد',
        popular: true,
      }),
      it('كركديه', 30, 'hibiscus'),
      it('ينسون', 30, 'herbal-tea'),
      it('بابونج', 30, 'herbal-tea'),
      it('هوت سيدر', 60, 'hot-cider'),
      it('سحلب', 95, 'sahlab', { popular: true }),
      it('مشروب الصيدلية العشبي', 60, 'herbal-tea'),
    ],
  },
  {
    id: 'fresh-juice',
    label: 'بار العصائر الفريش',
    icon: Citrus,
    photo: 'cat-juice',
    items: [
      it('مانجو', 75, 'mango-juice'),
      it('برتقال', 75, 'orange-juice'),
      it('فراولة', 75, 'strawberry-juice'),
      it('جوافة', 75, 'guava-juice'),
      it('جوافة باللبن', 90, 'guava-juice'),
      it('جوافة بالنعناع', 90, 'guava-juice'),
      it('ليمون نعناع', 75, 'lemon-mint'),
    ],
  },
  {
    id: 'mixes',
    label: 'ميكسات العصير والصودا',
    icon: GlassWater,
    photo: 'cat-mixes',
    items: [
      it('تروبيكال', 85, 'fruit-mix'),
      it('صن سيت', 85, 'fruit-mix'),
      it('بامبو الموز', 95, 'banana-mix'),
      it('كايرو نايت باور', 90, 'energy-mix'),
      it('مانجو باشون فروت', 90, 'fruit-mix', { note: 'عصير المانجو مع بيوريه الباشون فروت' }),
    ],
  },
  {
    id: 'smoothie',
    label: 'ركن السموزي',
    icon: Apple,
    photo: 'cat-smoothie',
    items: [
      it('سموزي بطيخ', 75, 'smoothie-watermelon'),
      it('سموزي ليمون نعناع', 75, 'lemon-mint'),
      it('سموزي مانجو', 75, 'smoothie-mango'),
      it('سموزي فراولة', 75, 'smoothie-strawberry'),
    ],
  },
  {
    id: 'mojito',
    label: 'موهيتو ومشروبات باردة',
    icon: Martini,
    photo: 'cat-mojito',
    items: [
      it('موهيتو أزرق', 90, 'mojito'),
      it('موهيتو باشون فروت', 90, 'mojito'),
      it('موهيتو صن سيت', 90, 'mojito'),
      it('آيس تي الليمون', 85, 'iced-tea'),
      it('آيس تي الخوخ', 90, 'iced-tea'),
    ],
  },
  {
    id: 'milkshake',
    label: 'ميلك شيك',
    icon: Milk,
    photo: 'cat-milkshake',
    items: [
      it('ميلك شيك', 95, 'milkshake', {
        note: 'اسأل عن النكهات المتاحة واختار بين',
        options: ['فانيليا', 'مانجو', 'شوكولاتة', 'كراميل', 'أوريو', 'فراولة', 'توت أزرق', 'ميكس توت'],
      }),
    ],
  },
  {
    id: 'soft-drinks',
    label: 'المشروبات الغازية والمياه',
    icon: CupSoda,
    photo: 'cat-soft-drinks',
    items: [
      it('بيبسي كانز', 35, 'pepsi'),
      it('سفن أب كانز', 35, 'seven-up'),
      it('ماونتن ديو', 35, 'mountain-dew'),
      it('ميرندا كانز', 35, 'mirinda'),
      it('فيروز كانز', 45, 'fayrouz'),
      it('بيريل', 45, 'birell'),
      it('مياه صغيرة', 15, 'water'),
      it('ريد بول', 85, 'redbull'),
      it('كوكتيل ريد بول', 100, 'redbull-cocktail'),
    ],
  },
  {
    id: 'desserts',
    label: 'الحلويات والفاكهة',
    icon: CakeSlice,
    photo: 'cat-desserts',
    items: [
      it('تشيز كيك', 100, 'cheesecake', {
        note: 'اختار النكهة',
        options: ['توت', 'لوتس', 'كراميل', 'شوكولاتة'],
      }),
      it('تيراميسو', 100, 'tiramisu'),
      it('مولتن كيك', 110, 'molten-cake', { popular: true }),
      it('مولتن كيك آيس', 125, 'molten-cake-ice'),
      it('ديسباسيتو', 125, 'dispasito', { options: ['لوتس', 'شوكولاتة'] }),
      it('طبق فاكهة الموسم (وسط)', 100, 'fruit-plate'),
      it('طبق فاكهة الموسم (كبير)', 135, 'fruit-plate'),
    ],
  },
]

export const popularItems = menu.flatMap((cat) =>
  cat.items.filter((i) => i.popular).map((i) => ({ ...i, category: cat })),
)