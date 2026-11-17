/* ختمات المباركة: خدمة تشغيل بلا اتصال.
   تُجلب الصفحة من الشبكة أولًا، فيصل كل إصدار جديد فور نشره،
   ولا تُستخدم النسخة المحفوظة إلا عند انقطاع الإنترنت.
   تحذف ذاكرتها القديمة فقط (أسماؤها تبدأ بـ khatma-)، ولا تمسّ ذاكرة أي موقع آخر على النطاق نفسه. */
const CACHE='khatma-shell-v1';
self.addEventListener('install',e=>{e.waitUntil((async()=>{
  try{const r=await fetch('./',{cache:'reload'});if(r&&r.ok){const c=await caches.open(CACHE);await c.put('./shell',r)}}catch(x){}
  await self.skipWaiting();
})())});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{
  try{const ks=await caches.keys();await Promise.all(ks.filter(k=>k.indexOf('khatma-')===0&&k!==CACHE).map(k=>caches.delete(k)))}catch(x){}
  await self.clients.claim();
})())});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET'||r.mode!=='navigate')return;
  e.respondWith((async()=>{
    try{
      const res=await fetch(r);
      if(res&&res.ok&&res.type==='basic'){try{const c=await caches.open(CACHE);await c.put('./shell',res.clone())}catch(x){}}
      return res;
    }catch(err){
      const c=await caches.open(CACHE);
      const hit=await c.match('./shell');
      if(hit)return hit;
      throw err;
    }
  })());
});
