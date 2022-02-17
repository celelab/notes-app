const NAME_CACHE = 'firenotes-v1'
const CACHE_WHITE_LIST = [NAME_CACHE]
const ASSETS_CACHE = [
  '/',
  '/logo.png',
  '/css/main.css',
  '/css/icons.css',
  '/fonts/icomoon.woff?5b99o9',
  '/fonts/Poppins.ttf',
  '/main.js',
]

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(NAME_CACHE).then((cache) => {
      return cache.addAll(ASSETS_CACHE)
    })
  )
})

self.addEventListener('fetch', (evt) => {
  evt.respondWith(
    caches.match(evt.request).then((data) => {
      return data || fetch(evt.request)
    })
  )
})

caches.keys().then((cacheNames) => {
  return Promise.all(
    cacheNames.map((cacheName) => {
      if (CACHE_WHITE_LIST.indexOf(cacheName) === -1) {
        return caches.delete(cacheName)
      }
    })
  )
})

caches.keys().then((cacheKeys) => {
  console.info('sw version:', cacheKeys)
})
