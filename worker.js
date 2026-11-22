// ตัวกลางดึงข้อมูลกล้องจาก hatyaicityclimate.org (เซิร์ฟเวอร์ต้นทางไม่เปิด CORS)
// ไฟล์อื่นทั้งหมดให้ระบบ assets ให้บริการตามปกติ
const UPSTREAM = 'https://hatyaicityclimate.org/api/flood/cams';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/cams') {
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
    return env.ASSETS.fetch(request);
  },
};
