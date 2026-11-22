// Cloudflare Pages Function: /api/cams
// ดึงข้อมูลกล้องจาก hatyaicityclimate.org แทนเบราว์เซอร์ (เซิร์ฟเวอร์ต้นทางไม่เปิด CORS)
const UPSTREAM = 'https://hatyaicityclimate.org/api/flood/cams';

export async function onRequestGet() {
  try {
    const res = await fetch(UPSTREAM, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'th-TH,th;q=0.9,en;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
        'Referer': 'https://hatyaicityclimate.org/',
        'Origin': 'https://hatyaicityclimate.org',
      },
      // แคชเฉพาะผลสำเร็จ 30 วินาที ไม่แคช error
      cf: { cacheEverything: true, cacheTtlByStatus: { '200-299': 30, '300-599': 0 } },
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
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store' },
    });
  }
}
