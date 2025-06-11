'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import plausible from 'plausible-tracker';
import CookieConsent from 'react-cookie-consent';

type Inputs = { date: string; time: string; lat: number; lon: number; tz: number };

export default function Home() {
  const { register, handleSubmit } = useForm<Inputs>();
  const [chart, setChart] = useState<any>(null);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN) {
      plausible({ domain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN! }).enableAutoPageviews();
    }
  }, []);

  const onSubmit = async (data: Inputs) => {
    const res = await fetch('/api/chart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (!res.ok) return toast.error('Chart failed 👀');
    setChart(await res.json());
  };

  const buy = async () => {
    const r = await fetch('/api/create-checkout-session', { method: 'POST' });
    window.location.href = (await r.json()).url;
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-6 bg-gradient-to-br from-purple-950 via-indigo-900 to-slate-900 text-white">
      <Toaster />
      <h1 className="text-4xl font-bold drop-shadow-lg">🔮 Instant Birth-Chart</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 w-full max-w-md">
        <input {...register('date')} type="date" className="input" required />
        <input {...register('time')} type="time" step="60" className="input" required />
        <input {...register('lat', { valueAsNumber: true })} placeholder="Latitude" className="input" required />
        <input {...register('lon', { valueAsNumber: true })} placeholder="Longitude" className="input" required />
        <input {...register('tz', { valueAsNumber: true })} placeholder="GMT offset e.g. -5" className="input" required />
        <button type="submit" className="btn">Get Free Reading</button>
      </form>

      {chart && (
        <section className="text-center">
          <pre className="text-left bg-black/60 p-4 rounded-lg shadow-inner overflow-x-auto max-h-72">{JSON.stringify(chart, null, 2)}</pre>
          <button onClick={buy} className="btn mt-4">Unlock 15-page PDF €25</button>
        </section>
      )}

      <CookieConsent
        buttonText="Accept"
        containerClasses="backdrop-blur-sm px-6 py-4 fixed bottom-4 left-1/2 -translate-x-1/2 rounded-xl bg-black/70 text-sm"
        buttonClasses="btn !py-1 !px-3 !text-sm !shadow-none"
      >
        We use cookies for site analytics and checkout functionality.
      </CookieConsent>
    </main>
  );
}
