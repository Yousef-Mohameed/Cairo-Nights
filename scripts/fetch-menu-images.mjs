// بينزّل صورة مختلفة لكل صنف من Pixabay (مجاني) ويحطها في public/images/menu
// التشغيل:
//   node scripts/fetch-menu-images.mjs مفتاح_PIXABAY
//   node scripts/fetch-menu-images.mjs مفتاح_PIXABAY --fix-dups          (يكشف الصور المتكررة ويستبدلها)
//   node scripts/fetch-menu-images.mjs مفتاح_PIXABAY --redo=mocha,pepsi  (يعيد تنزيل أصناف معينة)
//
// - بيتخطى أي صورة موجودة بالفعل (فتقدر تحط صورك بنفسك)
// - مش بيختار نفس الصورة لصنفين: بيحفظ أرقام الصور + أرقام المصورين في used-ids.json
// - بيفضّل مصور مختلف لكل صنف (لأن التكرار غالباً بيجي من نفس جلسة التصوير)
// - بيقارن محتوى الملفات (hash) فيمسك أي صورتين متطابقتين حتى لو بأسماء مختلفة
import { mkdir, writeFile, readFile, access, readdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'

const args = process.argv.slice(2)
const KEY = args.find((a) => !a.startsWith('--')) || process.env.PIXABAY_KEY
if (!KEY) {
  console.error('اكتب مفتاح Pixabay:  node scripts/fetch-menu-images.mjs YOUR_KEY')
  process.exit(1)
}
const FIX_DUPS = args.includes('--fix-dups')
const redoArg = args.find((a) => a.startsWith('--redo='))
const REDO = new Set(
  redoArg ? redoArg.slice('--redo='.length).split(',').map((s) => s.trim()).filter(Boolean) : [],
)

const OUT = 'public/images/menu'
const USED_FILE = `${OUT}/used-ids.json`

// المفتاح : كلمة بحث، أو قايمة كلمات لو أكتر من صنف بيشاركوا نفس المفتاح.
// الأول بيتسمى key.jpg والتاني key-2.jpg والتالت key-3.jpg ... (نفس ترتيب menu.ts)
// نصيحة: لو عندك أصناف في menu.ts أكتر من كلمات البحث هنا، الزيادة هتعيد نفس الصورة -- زوّد كلمات مختلفة.
const queries = {
  espresso: ['espresso shot', 'double espresso cups'],
  americano: 'americano coffee cup',
  macchiato: 'macchiato coffee',
  cappuccino: 'cappuccino',
  'latte-art': ['latte art', 'cortado coffee glass', 'flat white coffee'],
  mocha: 'mocha coffee',
  'spanish-latte': 'latte coffee glass',
  'turkish-coffee': ['turkish coffee', 'turkish coffee cezve', 'hazelnut coffee'],
  'french-coffee': 'coffee with milk cup',
  nescafe: ['instant coffee mug', 'coffee with milk mug'],
  'hot-chocolate': 'hot chocolate',
  'iced-americano': 'iced americano',
  'iced-latte': ['iced latte', 'iced coconut coffee', 'iced coffee cream glass'],
  'iced-mocha': ['iced mocha', 'tropical iced coffee'],
  'iced-spanish-latte': 'iced coffee glass milk',
  'iced-caramel-macchiato': 'iced caramel macchiato',
  'cold-brew': 'cold brew coffee',
  'pour-over': ['v60 pour over', 'chemex coffee'],
  affogato: 'affogato',
  'matcha-latte': ['matcha latte', 'green tea latte cup'],
  'fruit-matcha': ['mango matcha latte', 'strawberry matcha', 'iced matcha drink'],
  frappe: ['frappe coffee', 'caramel frappuccino', 'vanilla frappe', 'hazelnut coffee frappe'],
  'frappe-chocolate': ['mocha frappe', 'chocolate milkshake'],
  'signature-coffee': ['specialty coffee cup', 'arabic coffee cup'],
  'blue-iced-latte': 'blue drink glass',
  'sparkling-coffee': 'coffee tonic',
  'tea-cup': ['tea glass', 'flavored tea cup'],
  'tea-pot': ['tea pot glasses', 'tea pot tray'],
  'glass-teapot': ['glass teapot tea', 'rose tea pot', 'spiced tea pot'],
  hibiscus: 'hibiscus tea',
  'herbal-tea': ['anise tea', 'chamomile tea', 'herbal tea'],
  'hot-cider': 'hot apple cider',
  sahlab: 'hot milk cinnamon drink',
  'mango-juice': 'mango juice',
  'orange-juice': 'orange juice',
  'strawberry-juice': 'strawberry juice',
  'guava-juice': ['guava juice', 'guava smoothie', 'guava mint drink'],
  'lemon-mint': ['lemon mint drink', 'lemon mint smoothie'],
  'fruit-mix': ['tropical juice cocktail', 'sunset drink layered', 'passion fruit mango drink'],
  'banana-mix': 'banana smoothie',
  'energy-mix': 'colorful fruit drink',
  'smoothie-watermelon': 'watermelon smoothie',
  'smoothie-mango': 'mango smoothie',
  'smoothie-strawberry': 'strawberry smoothie',
  mojito: ['blue mojito', 'passion fruit mojito', 'sunset mojito'],
  'iced-tea': ['iced lemon tea', 'peach iced tea'],
  milkshake: 'milkshake',
  pepsi: 'pepsi can',
  'seven-up': '7up can',
  'mountain-dew': 'mountain dew',
  mirinda: 'orange soda can',
  fayrouz: 'apple soda can',
  birell: 'malt drink bottle',
  water: 'water bottle',
  redbull: 'energy drink can',
  'redbull-cocktail': 'energy drink glass',
  cheesecake: 'cheesecake',
  tiramisu: 'tiramisu',
  'molten-cake': 'chocolate lava cake',
  'molten-cake-ice': 'lava cake ice cream',
  dispasito: 'chocolate dessert cup',
  'fruit-plate': ['fruit platter', 'large fruit platter'],
  // صور الأقسام (غيّرت كلماتها شوية عشان ماتشبهش صور الأصناف)
  'cat-classic': 'coffee cups table',
  'cat-iced-coffee': 'iced coffee',
  'cat-matcha': 'matcha powder whisk',
  'cat-frappe': 'frappuccino',
  'cat-specialty': 'barista coffee',
  'cat-tea': 'tea tray',
  'cat-juice': 'fresh juice',
  'cat-mixes': 'fruit soda drink',
  'cat-smoothie': 'smoothie bowl',
  'cat-mojito': 'mojito cocktail',
  'cat-milkshake': 'milkshake diner',
  'cat-soft-drinks': 'soda cans',
  'cat-desserts': 'desserts',
}

const jobs = []
for (const [base, q] of Object.entries(queries)) {
  const list = Array.isArray(q) ? q : [q]
  list.forEach((query, i) => jobs.push({ key: i === 0 ? base : `${base}-${i + 1}`, query }))
}

const exists = (p) => access(p).then(() => true, () => false)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const sha = (buf) => createHash('sha1').update(buf).digest('hex')

await mkdir(OUT, { recursive: true })

// ---- الحالة المحفوظة (أرقام الصور + المصورين) ----
let usedIds = new Set()
let usedUsers = new Set()
try {
  const raw = JSON.parse(await readFile(USED_FILE, 'utf8'))
  // الشكل القديم كان مصفوفة أرقام بس
  usedIds = new Set(Array.isArray(raw) ? raw : (raw.ids ?? []))
  usedUsers = new Set(Array.isArray(raw) ? [] : (raw.users ?? []))
} catch {
  // أول مرة
}
const saveState = () =>
  writeFile(USED_FILE, JSON.stringify({ ids: [...usedIds], users: [...usedUsers] }))

// ---- كشف الصور المتطابقة في الملفات الموجودة ----
const hashes = new Map() // hash -> key
const dupKeys = []
for (const f of (await readdir(OUT)).filter((f) => f.endsWith('.jpg')).sort()) {
  const key = f.slice(0, -4)
  const h = sha(await readFile(`${OUT}/${f}`))
  if (hashes.has(h)) {
    console.log('DUP    ', key, '= نفس صورة', hashes.get(h))
    dupKeys.push(key)
  } else {
    hashes.set(h, key)
  }
}
if (dupKeys.length && !FIX_DUPS) {
  console.log(`لقيت ${dupKeys.length} صورة متطابقة. شغّل تاني مع --fix-dups عشان تتبدل.`)
}
if (FIX_DUPS) dupKeys.forEach((k) => REDO.add(k))

const credits = []

for (const { key, query } of jobs) {
  const file = `${OUT}/${key}.jpg`
  const redo = REDO.has(key)
  if (!redo && (await exists(file))) {
    console.log('skip   ', key)
    continue
  }
  try {
    const url =
      `https://pixabay.com/api/?key=${encodeURIComponent(KEY)}` +
      `&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal` +
      `&safesearch=true&order=popular&per_page=50`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()

    // صور ماتستخدمتش قبل كده، ومصورها جديد الأول، وبعدين الباقي
    const fresh = (data.hits ?? []).filter((h) => !usedIds.has(h.id))
    const ordered = [
      ...fresh.filter((h) => !usedUsers.has(h.user_id)),
      ...fresh.filter((h) => usedUsers.has(h.user_id)),
    ]

    const oldHash = [...hashes].find(([, k]) => k === key)?.[0]
    let saved = false
    for (const hit of ordered.slice(0, 10)) {
      const img = await fetch(hit.largeImageURL || hit.webformatURL)
      if (!img.ok) continue
      const buf = Buffer.from(await img.arrayBuffer())
      const h = sha(buf)
      if (hashes.has(h)) continue // نفس الملف بالظبط موجود عندنا
      await writeFile(file, buf)
      if (oldHash) hashes.delete(oldHash)
      hashes.set(h, key)
      const sameAuthor = usedUsers.has(hit.user_id)
      usedIds.add(hit.id)
      usedUsers.add(hit.user_id)
      await saveState()
      credits.push(`${key}: ${hit.user} - ${hit.pageURL}`)
      console.log(redo ? 'redo   ' : 'ok     ', key, sameAuthor ? '(نفس المصور - راجعها)' : '')
      saved = true
      break
    }
    if (!saved) console.log('no result', key, `(${query}) - جرّب كلمة بحث تانية`)
  } catch (e) {
    console.log('FAILED ', key, e.message)
  }
  await sleep(1000)
}

if (credits.length) {
  await writeFile(`${OUT}/CREDITS.txt`, credits.join('\n') + '\n', { flag: 'a' })
}
console.log('خلصنا. راجع الصور بعينك واستبدل اللي مش مظبوط.')
