const CACHE = 'cn-v1'

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.add('/'))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

const putInCache = (request, response) => {
  if (!response.ok) return
  const copy = response.clone()
  caches.open(CACHE).then((cache) => cache.put(request, copy))
}

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return

  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return
  // الماتشات والـ API دايمًا من النت عشان ما نعرضش نتيجة قديمة
  if (url.pathname.startsWith('/api/')) return

  // الصفحات: النسخة الجديدة الأول، ولو النت واقع نعرض المحفوظة
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          putInCache('/', res)
          return res
        })
        .catch(() => caches.match('/')),
    )
    return
  }

  // ملفات الموقع (أسماءها بتتغير مع كل نشر): من المخزّن الأول
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            putInCache(req, res)
            return res
          }),
      ),
    )
    return
  }

  // باقي الحاجات (صور وغيره): النت الأول، ولو واقع المحفوظ
  event.respondWith(
    fetch(req)
      .then((res) => {
        putInCache(req, res)
        return res
      })
      .catch(() => caches.match(req)),
  )
})