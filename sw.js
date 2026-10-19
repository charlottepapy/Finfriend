const V='finfriend-v6';
const CORE=['./','./index.html','./config.js','./manifest.json','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
const keep=(r,res)=>{if(res&&(res.ok||res.type==='opaque')){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res};
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.hostname.endsWith('supabase.co'))return; // never cache API or auth
  const page=r.mode==='navigate'||(u.origin===location.origin&&/\/(index\.html|config\.js)?$|\.js$|\.json$/.test(u.pathname));
  if(page){ // app code: network first so a new version shows on the next open, cache when offline
    e.respondWith(fetch(r,{cache:'no-cache'}).then(res=>keep(r,res)).catch(()=>caches.match(r,{ignoreSearch:true}).then(hit=>hit||caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>keep(r,res))));
});
