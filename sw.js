const C="hs-v17",SHELL=["./","index.html","manifest.webmanifest","icon.svg","icon-192.png","fonts/AdapterHebrewVF.woff2","icons/icons.css","icons/Phosphor.woff2","icons/Phosphor-Fill.woff2","version.json"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener("fetch",e=>{const u=new URL(e.request.url);if(e.request.method!=="GET"||u.hostname.includes("googleapis.com")&&!u.hostname.startsWith("fonts"))return;
 e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request)))});
