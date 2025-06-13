'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import plausible from 'plausible-tracker';
import CookieConsent from 'react-cookie-consent';

// Types for the birth-chart form
type Inputs = {
  date: string;
  time: string;
  lat: number;
  lon: number;
  tz: number;
};

export default function Home() {
  const { register, handleSubmit } = useForm<Inputs>();
  const [chart, setChart] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  // set up Plausible analytics (if env var present)
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN) {
      plausible({ domain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN! }).enableAutoPageviews();
    }
  }, []);

  // submit birth-chart form
  const onSubmit = async (data: Inputs) => {
    const res = await fetch('/api/chart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) return toast.error('Chart failed 👀');
    setChart(await res.json());
  };

  // start Stripe checkout
  const buy = async () => {
    const r = await fetch('/api/create-checkout-session', { method: 'POST' });
    window.location.href = (await r.json()).url;
  };

  return (
    <div className="bg-[#1A2530] text-[#ECF0F1] font-sans min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed w-full z-20 bg-[#1A2530]/95 shadow">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold tracking-tight">Astro<span className="text-[#F1C40F]">Insight</span></h1>
          </div>
          <nav>
            <ul className="flex gap-8 font-semibold">
              <li><a href="#features" className="hover:text-[#F1C40F]">Features</a></li>
              <li><a href="#testimonials" className="hover:text-[#F1C40F]">Testimonials</a></li>
              <li><button onClick={() => setShowModal(true)} className="hover:text-[#F1C40F]">Sign In</button></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero flex items-center justify-center h-screen bg-cover bg-center relative" style={{backgroundImage: "linear-gradient(rgba(26,37,48,0.7),rgba(26,37,48,0.7)),url('https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')"}}>
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">UNLOCK YOUR COSMIC POTENTIAL</h1>
          <p className="mb-8 text-lg md:text-xl">Discover how the stars can guide your path to clarity, purpose, and fulfillment with personalized astrological insights.</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center hero-buttons">
            <a href="/quiz" className="btn btn-primary">Take the Quiz</a>
            <a href="#mercury-guide" className="btn btn-secondary">Get Free Guide</a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features py-20 bg-[#1E2A38]" id="features">
        <div className="container mx-auto">
          <div className="section-title text-center mb-16">
            <h2 className="text-3xl font-bold inline-block relative after:block after:w-20 after:h-1 after:bg-[#F1C40F] after:mx-auto after:mt-2">DISCOVER YOUR COSMIC CONNECTIONS</h2>
          </div>
          <div className="flex flex-wrap gap-8 justify-between features-container">
            <div className="feature-card flex-1 min-w-[300px] bg-[#2C3E50] rounded-xl p-8 text-center transition-transform hover:-translate-y-2 hover:shadow-xl">
              <div className="zodiac-icon text-5xl mb-4 text-[#F1C40F]">♊</div>
              <h3 className="text-xl font-bold mb-2">ZODIAC COMPATIBILITY</h3>
              <p className="mb-4">Find your perfect match with our in-depth compatibility analysis based on your zodiac sign.</p>
              <a href="/quiz" className="btn btn-primary">Take Quiz</a>
            </div>
            <div className="feature-card flex-1 min-w-[300px] bg-[#2C3E50] rounded-xl p-8 text-center transition-transform hover:-translate-y-2 hover:shadow-xl">
              <div className="zodiac-icon text-5xl mb-4 text-[#F1C40F]">☿</div>
              <h3 className="text-xl font-bold mb-2">MERCURY RETROGRADE GUIDE</h3>
              <p className="mb-4">Navigate communication chaos with confidence using our comprehensive survival guide.</p>
              <a href="#mercury-guide" className="btn btn-secondary">Get Guide</a>
            </div>
            <div className="feature-card flex-1 min-w-[300px] bg-[#2C3E50] rounded-xl p-8 text-center transition-transform hover:-translate-y-2 hover:shadow-xl">
              <div className="zodiac-icon text-5xl mb-4 text-[#F1C40F]">⚹</div>
              <h3 className="text-xl font-bold mb-2">BIRTH CHART ANALYSIS</h3>
              <p className="mb-4">Unlock the secrets of your personal cosmic blueprint with our detailed birth chart reading.</p>
              <a href="#" className="btn btn-secondary">Learn More</a>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Magnet Section - Compatibility Quiz */}
      <section className="lead-magnet py-20 bg-[#8E44AD] text-center" id="compatibility-quiz">
        <div className="container mx-auto max-w-xl">
          <h2 className="text-2xl font-bold mb-4">FIND YOUR COSMIC MATCH</h2>
          <p className="mb-6">Discover which zodiac signs you're most compatible with for love, friendship, and work relationships.</p>
          <a href="/quiz" className="btn btn-primary">Get My Compatibility Results</a>
        </div>
      </section>

      {/* Lead Magnet Section - Mercury Retrograde Guide */}
      <section className="lead-magnet py-20 bg-[#2C3E50] text-center" id="mercury-guide">
        <div className="container mx-auto max-w-xl">
          <h2 className="text-2xl font-bold mb-4">MERCURY RETROGRADE SURVIVAL GUIDE</h2>
          <p className="mb-6">Get your free guide to navigating Mercury Retrograde periods with ease. Learn how to avoid communication mishaps, technology failures, and travel delays.</p>
          <a href="#" className="btn btn-primary">Send Me The Free Guide</a>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials py-20 bg-[#1E2A38]" id="testimonials">
        <div className="container mx-auto">
          <div className="section-title text-center mb-16">
            <h2 className="text-3xl font-bold inline-block relative after:block after:w-20 after:h-1 after:bg-[#F1C40F] after:mx-auto after:mt-2">WHAT PEOPLE ARE SAYING</h2>
          </div>
          <div className="flex flex-wrap gap-8 justify-between testimonials-container">
            <div className="testimonial-card flex-1 min-w-[300px] bg-[#2C3E50] rounded-xl p-8 relative">
              <p className="italic mb-6">"AstroInsight changed my perspective on life. The birth chart analysis was incredibly accurate and gave me clarity on my path forward."</p>
              <p className="font-bold text-[#F1C40F]">- Sarah K.</p>
            </div>
            <div className="testimonial-card flex-1 min-w-[300px] bg-[#2C3E50] rounded-xl p-8 relative">
              <p className="italic mb-6">"The most accurate readings I've ever experienced. The compatibility quiz helped me understand my relationship dynamics in a whole new way."</p>
              <p className="font-bold text-[#F1C40F]">- Michael T.</p>
            </div>
            <div className="testimonial-card flex-1 min-w-[300px] bg-[#2C3E50] rounded-xl p-8 relative">
              <p className="italic mb-6">"Finally an astrology resource that makes sense! The Mercury Retrograde Guide has been my lifesaver during chaotic communication periods."</p>
              <p className="font-bold text-[#F1C40F]">- Jamie L.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A2530] py-12 text-center mt-auto">
        <div className="container mx-auto">
          <div className="footer-links mb-8 flex flex-wrap justify-center gap-6">
            <a href="#" className="hover:text-[#F1C40F]">Home</a>
            <a href="#" className="hover:text-[#F1C40F]">About</a>
            <a href="#" className="hover:text-[#F1C40F]">Services</a>
            <a href="#" className="hover:text-[#F1C40F]">Blog</a>
            <a href="#" className="hover:text-[#F1C40F]">Contact</a>
          </div>
          <div className="social-links mb-8 flex justify-center gap-6 text-2xl">
            <a href="#" className="hover:text-[#F1C40F]"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="hover:text-[#F1C40F]"><i className="fab fa-twitter"></i></a>
            <a href="#" className="hover:text-[#F1C40F]"><i className="fab fa-instagram"></i></a>
            <a href="#" className="hover:text-[#F1C40F]"><i className="fab fa-pinterest-p"></i></a>
            <a href="#" className="hover:text-[#F1C40F]"><i className="fab fa-tiktok"></i></a>
          </div>
          <p className="text-[#7F8C8D] text-sm">© 2025 AstroInsight. All rights reserved.</p>
        </div>
      </footer>

      {/* Modal - Sign In */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="bg-[#2C3E50] rounded-xl p-8 max-w-md w-full relative">
            <button className="absolute top-4 right-6 text-3xl text-[#ECF0F1] hover:text-[#F1C40F]" onClick={() => setShowModal(false)}>&times;</button>
            <h2 className="text-2xl font-bold mb-6">Sign In</h2>
            <form>
              <div className="mb-4">
                <input type="email" className="form-control input w-full" placeholder="Your Email" required />
              </div>
              <div className="mb-4">
                <input type="password" className="form-control input w-full" placeholder="Your Password" required />
              </div>
              <button type="submit" className="btn btn-primary w-full">Sign In</button>
            </form>
            <p className="mt-4 text-center">Don't have an account? <a href="#" className="text-[#F1C40F]">Sign Up</a></p>
          </div>
        </div>
      )}

      {/* Results + upsell */}
      {chart && (
        <section className="text-center">
          <pre className="text-left bg-black/60 p-4 rounded-lg shadow-inner overflow-x-auto max-h-72">
            {JSON.stringify(chart, null, 2)}
          </pre>
          <button onClick={buy} className="btn mt-4">
            Unlock 15-page PDF €25
          </button>
        </section>
      )}

      {/* GDPR cookie consent */}
      <CookieConsent
        buttonText="Accept"
        containerClasses="backdrop-blur-sm px-6 py-4 fixed bottom-4 left-1/2 -translate-x-1/2 rounded-xl bg-black/70 text-sm"
        buttonClasses="btn !py-1 !px-3 !text-sm !shadow-none"
      >
        We use cookies for site analytics and checkout functionality.
      </CookieConsent>
    </div>
  );
}

// Tailwind utility classes for .btn, .btn-primary, .btn-secondary, .input are already in globals.css
