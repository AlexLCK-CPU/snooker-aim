/* 桌球角度瞄準練習 — 離線快取（App Shell）。
   加到主畫面後，就算冇網絡都開得返。改版時把 VERSION 加一就會更新。 */
var VERSION = 'billiards-aim-v1';
var FILES = [
  './index.html',
  './site.webmanifest',
  './icon-180.png',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(VERSION).then(function(c){
      // 逐個加入：任何一個失敗都不會拖垮整個安裝
      return Promise.all(FILES.map(function(f){ return c.add(f)['catch'](function(){}); }));
    }).then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){ return k === VERSION ? null : caches['delete'](k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e){
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(function(hit){
      if (hit) return hit;
      return fetch(e.request)['catch'](function(){
        return caches.match('./index.html');
      });
    })
  );
});
