import type { NextApiRequest, NextApiResponse } from 'next';

const authHeader =
  'Basic ' +
  Buffer.from(`${process.env.ASTRO_USER_ID}:${process.env.ASTRO_API_KEY}`).toString('base64');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');
  try {
    const { date, time, lat, lon, tz } = req.body;
    const apiRes = await fetch('https://json.astrologyapi.com/v1/planets', {
      method: 'POST',
      headers: { Authorization: authHeader, 'Content-Type': 'application/json' },
      body: JSON.stringify({ datetime: `${date} ${time}`, latitude: lat, longitude: lon, timezone: tz }),
    });
    if (!apiRes.ok) throw new Error(`Astro API ${apiRes.status}`);
    res.status(200).json(await apiRes.json());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
