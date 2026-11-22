// Cloudflare Pages Function: /api/cams
// ดึงข้อมูลกล้องจาก hatyaicityclimate.org แทนเบราว์เซอร์ (เซิร์ฟเวอร์ต้นทางไม่เปิด CORS)
const UPSTREAM = 'https://hatyaicityclimate.org/api/flood/cams';

export async function onRequestGet() {
  try {
    const res = await fetch(UPSTREAM, {
      headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0 (compatible; HY-CCTV/1.0)' },
      cf: { cacheTtl: 30, cacheEverything: true },
    });
    if (!res.ok) throw new Error('upstream ' + res.status);
    return new Response(res.body, {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=30',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e.message || e) }), {
      status: 502,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
