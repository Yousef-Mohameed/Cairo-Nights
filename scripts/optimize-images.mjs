import sharp from 'sharp'
import { readdir, stat, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

sharp.cache(false) // عشان ويندوز ما يقفلش الملف وقت الكتابة عليه

const TARGETS = [
  { dir: 'public/images/menu', max: 800 }, // صور المنيو والأقسام
  { dir: 'public/images', max: 1200 }, // المعرض وباقي الصور
]
const SKIP_BELOW = 150 * 1024 // الصور الصغيرة بالفعل مابتتلمسش (فتقدر تشغله أكتر من مرة)

let before = 0
let after = 0

for (const { dir, max } of TARGETS) {
  for (const f of await readdir(dir)) {
    if (!/\.jpe?g$/i.test(f)) continue
    const path = join(dir, f)
    const size = (await stat(path)).size
    const meta = await sharp(path).metadata()
    before += size

    const fits = (meta.width ?? 0) <= max && (meta.height ?? 0) <= max
    if (fits && size <= SKIP_BELOW) {
      after += size
      console.log('skip  ', f)
      continue
    }

    const out = await sharp(path)
      .rotate()
      .resize({ width: max, height: max, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 78, mozjpeg: true })
      .toBuffer()

    if (out.length >= size) {
      after += size
      console.log('keep  ', f)
      continue
    }
    await writeFile(path, out)
    after += out.length
    console.log('ok    ', f, `${Math.round(size / 1024)}KB -> ${Math.round(out.length / 1024)}KB`)
  }
}

const mb = (n) => (n / 1024 / 1024).toFixed(1)
console.log(`خلصنا: ${mb(before)}MB -> ${mb(after)}MB`)