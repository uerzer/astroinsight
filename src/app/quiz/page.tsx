"use client";
import { useState } from "react";

const questions = [
  {
    question: "What is your zodiac sign?",
    options: [
      "Aries (Mar 21 - Apr 19)", "Taurus (Apr 20 - May 20)", "Gemini (May 21 - Jun 20)", "Cancer (Jun 21 - Jul 22)", "Leo (Jul 23 - Aug 22)", "Virgo (Aug 23 - Sep 22)", "Libra (Sep 23 - Oct 22)", "Scorpio (Oct 23 - Nov 21)", "Sagittarius (Nov 22 - Dec 21)", "Capricorn (Dec 22 - Jan 19)", "Aquarius (Jan 20 - Feb 18)", "Pisces (Feb 19 - Mar 20)"
    ]
  },
  {
    question: "In relationships, which quality do you value most?",
    options: [
      "Passion and excitement", "Stability and loyalty", "Intellectual stimulation", "Emotional connection", "Fun and adventure"
    ]
  },
  {
    question: "How do you typically handle conflict?",
    options: [
      "Face it head-on immediately", "Take time to process before discussing", "Analyze the situation logically", "Focus on how everyone feels", "Try to lighten the mood"
    ]
  },
  {
    question: "What's your ideal date night?",
    options: [
      "Something active and adventurous", "A cozy night in with good food", "Trying something new and interesting", "Deep conversation in a quiet setting", "Something fun and social with friends"
    ]
  },
  {
    question: "How important is alone time to you?",
    options: [
      "I rarely need alone time", "I need regular alone time to recharge", "I like a balance of social time and alone time", "I prefer one-on-one time over large groups", "It depends on my mood"
    ]
  },
  {
    question: "How do you express affection?",
    options: [
      "Physical touch and grand gestures", "Practical help and reliability", "Thoughtful gifts and conversation", "Emotional support and nurturing", "Quality time and words of affirmation"
    ]
  },
  {
    question: "What's your communication style?",
    options: [
      "Direct and straightforward", "Thoughtful and measured", "Quick-witted and talkative", "Intuitive and empathetic", "Enthusiastic and expressive"
    ]
  },
  {
    question: "What quality do you find most challenging in others?",
    options: [
      "Indecisiveness", "Impulsiveness", "Emotional intensity", "Detachment", "Stubbornness"
    ]
  },
  {
    question: "How do you approach planning and organization?",
    options: [
      "I prefer spontaneity over planning", "I like having a detailed plan", "I make flexible plans with room for changes", "I plan around people's needs and feelings", "I focus on the big picture, not the details"
    ]
  },
  {
    question: "What role do you typically play in relationships?",
    options: [
      "The leader or initiator", "The stable, dependable one", "The communicator or connector", "The nurturer or emotional support", "The entertainer or life of the party"
    ]
  }
];

export default function QuizPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOption = (option: string) => {
    const newAnswers = [...answers];
    newAnswers[step] = option;
    setAnswers(newAnswers);
  };

  const next = () => setStep((s) => s + 1);
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const submit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/compatibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");
      setResult(data.result);
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (result)
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-purple-950 via-indigo-900 to-slate-900 text-white">
        <h1 className="text-3xl font-bold mb-6">Your Compatibility Result</h1>
        <div className="bg-black/60 p-6 rounded-xl shadow-lg max-w-xl text-left whitespace-pre-line">
          <p>{result}</p>
        </div>
        <button className="btn mt-8" onClick={() => { setStep(0); setAnswers([]); setResult(null); setError(null); }}>Retake Quiz</button>
      </main>
    );

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-purple-950 via-indigo-900 to-slate-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Zodiac Compatibility Quiz</h1>
      <div className="bg-black/60 p-6 rounded-xl shadow-lg max-w-xl w-full">
        <h2 className="text-xl font-semibold mb-4">Question {step + 1} of {questions.length}</h2>
        <p className="mb-6">{questions[step].question}</p>
        <div className="flex flex-col gap-3">
          {questions[step].options.map((opt) => (
            <button
              key={opt}
              className={`btn ${answers[step] === opt ? "ring-2 ring-yellow-400" : ""}`}
              onClick={() => handleOption(opt)}
              disabled={loading}
            >
              {opt}
            </button>
          ))}
        </div>
        <div className="flex justify-between mt-8">
          <button className="btn btn-secondary" onClick={prev} disabled={step === 0 || loading}>Previous</button>
          {step < questions.length - 1 ? (
            <button className="btn btn-primary" onClick={next} disabled={!answers[step] || loading}>Next</button>
          ) : (
            <button className="btn btn-primary" onClick={submit} disabled={!answers[step] || loading}>{loading ? "Generating..." : "See My Result"}</button>
          )}
        </div>
        {loading && <div className="mt-6 text-center text-yellow-300">Generating your personalized result...</div>}
        {error && <div className="mt-6 text-center text-red-400">{error}</div>}
      </div>
    </main>
  );
} 