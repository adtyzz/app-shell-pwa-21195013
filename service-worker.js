// Nama cache Anda
var cacheName = "Uxos-pwa-v1";
// Daftar sumber daya yang ingin Anda cache
var filesToCache = [
  "/",
  "/index.html",
  "/about.html",
  "/contact.html",
  "/feature.html",
  "/service-worker.js",
  "/manifest.json",
  "/css/bootstrap.css",
  "/css/responsive.css",
  "/css/style.css",
  "/css/style.css.map",
  "/css/style.scss",
  "/images/about-bg.jpg",
  "/images/client.png",
  "/images/cloud-download.png",
  "/images/contact-img.png",
  "/images/download-img.png",
  "/images/fb.png",
  "/images/heart.png",
  "/images/instagram.png",
  "/images/instagram1.png",
  "/images/left-arrow.png",
  "/images/linkedin.png",
  "/images/linkedin1.png",
  "/images/playstore.png",
  "/images/quote.png",
  "/images/right-arrow.png",
  "/images/slider-img.png",
  "/images/trophy_.png",
  "/images/twitter.png",
  "/images/icon_144.png",
  "/images/icon_192.png",
  "/images/icon_196.png",
  "/images/icon_512.png",
  "/images/icon_maskable.png",
  "/images/happy.png",
  "/images/sad.png",
  "/js/bootstrap.js",
  "https://fonts.googleapis.com/css?family=Open+Sans:400,700|Poppins:400,700|Raleway:400,700&display=swap",
  "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.1.3/assets/owl.carousel.min.css",
  "https://getbootstrap.com/"
];

// Instalasi Service Worker
self.addEventListener("install", (evt) => {
  evt.waitUntil(
    caches.open(cacheName).then(function (cache) {
      return cache.addAll(filesToCache);
    })
  );
});

// Aktivasi Service Worker
self.addEventListener("activate", (evt) => {});

// Fetching sumber daya dari cache atau jaringan
// self.addEventListener('fetch', evt => {
//     evt.respondWith(
//         caches.match(evt.request).then(cacheRes => {
//             // Menggunakan sumber daya dari cache jika ada
//             return cacheRes || fetch(evt.request);
//         })
//     );
// });

self.addEventListener("fetch", function (event) {
  event.respondWith(
    fetch(event.request)
      .then(function (response) {
        // Data berhasil diambil dari jaringan, cache data tersebut
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open("my-cache").then(function (cache) {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(function () {
        // Jika gagal mengambil data dari jaringan, coba ambil dari cache
        return caches.match(event.request);
      })
  );
});

self.addEventListener("push", function (event) {
  if (self.Notification.permission === "granted") {
    // Izin notifikasi telah diberikan, Anda dapat menampilkan pemberitahuan
    const options = {
      body: 'Apakah bapak mau memberi nilai "A" kepada saya??',
      icon: "/images/icon_144.png",
      actions: [
        { action: "yes", title: "Ya" },
        { action: "no", title: "Tidak" },
      ],
      data: {
        senderId: "12345",
        messageId: "67890",
      },
      silent: true,
      timestamp: Date.now(),
    };

    event.waitUntil(self.registration.showNotification("Notifikasi", options));
  } else {
    // Izin notifikasi tidak diberikan
  }
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  if (event.action === "yes") {
    // Tindakan "Ya" diambil
    // Menampilkan notifikasi dengan ucapan "Anda memilih Ya"
    self.registration.showNotification("Terimakasih", {
      body: "Terimakasih Bapak sudah baik, memberi nilai yang bagus kepada saya",
      icon: "/images/happy.png",
    });
  } else if (event.action === "no") {
    // Tindakan "Tidak" diambil
    // Menampilkan notifikasi dengan ucapan "Anda memilih Tidak"
    self.registration.showNotification("Duhhh pak pak", {
      body: "Gak papa wis...",
      icon: "/images/sad.png",
    });
  } else {
    // Notifikasi di-klik tanpa memilih tindakan apa pun
    // Lakukan sesuatu ketika notifikasi di-klik tanpa memilih "Ya" atau "Tidak"
    console.log("Anda mengklik notifikasi");
  }
});
