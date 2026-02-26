const CACHE_NAME = "vn-game-v1";

// Daftar file yang ingin disimpan agar bisa dimainkan offline
const urlsToCache = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  // Masukkan juga nama file gambar background dan karaktermu di sini nanti
  // contoh: "./assets/bg-hutan.png"
];

// Saat Service Worker diinstal, simpan semua file ke Cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Membuka cache dan menyimpan file...");
      return cache.addAll(urlsToCache);
    })
  );
});

// Saat game dijalankan, minta file dari Cache dulu (agar bisa offline)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Jika file ada di cache, gunakan itu. Jika tidak, ambil dari internet.
      return response || fetch(event.request);
    })
  );
});
