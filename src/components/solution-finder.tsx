"use client";
import { useId, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import {
  finderIndustries,
  goals,
  recommend,
  contactLink,
} from "@/lib/recommendations";
import { services } from "@/data/services";
import { ButtonLink } from "./ui";
export function SolutionFinder() {
  const [step, setStep] = useState(0);
  const [industry, setIndustry] = useState<string>("");
  const [goal, setGoal] = useState("");
  const [challenge, setChallenge] = useState("");
  const [other, setOther] = useState("");
  const id = useId();
  const heading = useRef<HTMLHeadingElement>(null);
  const selected = goals.find((g) => g.id === goal);
  const recommendation = recommend(
    industry,
    goal,
    challenge === "Other" ? other : challenge,
  );
  const move = (next: number) => {
    setStep(next);
    requestAnimationFrame(() => heading.current?.focus());
  };
  const valid =
    step === 0
      ? !!industry
      : step === 1
        ? !!goal
        : !!challenge && (challenge !== "Other" || !!other.trim());
  return (
    <div className="finder">
      <aside className="finder-aside">
        <span className="finder-symbol">✳</span>
        <p>
          YOUR BUSINESS.
          <br />
          YOUR CHALLENGE.
          <br />
          <span>YOUR STACK.</span>
        </p>
        <span>
          A few questions.
          <br />A more connected starting point.
        </span>
        <ol>
          {["Your industry", "Your goal", "The roadblock", "Your stack"].map(
            (t, i) => (
              <li
                className={step === i ? "active" : step > i ? "complete" : ""}
                key={t}
              >
                <span>{step > i ? <Check size={13} /> : i + 1}</span>
                {t}
              </li>
            ),
          )}
        </ol>
      </aside>
      <div className="finder-main">
        <div className="finder-top">
          <span className="mono-label">
            STACK FINDER / {String(step + 1).padStart(2, "0")}
          </span>
          <Sparkles size={20} />
        </div>
        <h3 ref={heading} tabIndex={-1}>
          {
            [
              "What's your world?",
              "What would you like to do?",
              "What's getting in the way?",
              "Here's your starting stack.",
            ][step]
          }
        </h3>
        <p>
          {
            [
              "Pick the industry closest to your business.",
              "Choose the outcome that matters most right now.",
              "Every good solution starts with the right problem.",
              `${industry} · ${selected?.label || "Connected business"}`,
            ][step]
          }
        </p>
        {step < 3 ? (
          <>
            <div
              className="choice-grid"
              role="group"
              aria-label={["Industry", "Goal", "Challenge"][step]}
            >
              {(step === 0
                ? [...finderIndustries]
                : step === 1
                  ? goals.map((g) => g.label)
                  : [...(selected?.challenges || []), "Other"]
              ).map((label) => {
                const value =
                  step === 1 ? goals.find((g) => g.label === label)!.id : label;
                const active =
                  (step === 0 ? industry : step === 1 ? goal : challenge) ===
                  value;
                return (
                  <button
                    key={value}
                    type="button"
                    className={`choice ${active ? "selected" : ""}`}
                    aria-pressed={active}
                    onClick={() => {
                      if (step === 0) setIndustry(value);
                      else if (step === 1) {
                        setGoal(value);
                        setChallenge("");
                        setOther("");
                      } else setChallenge(value);
                    }}
                  >
                    {label}
                    {active ? (
                      <Check size={16} />
                    ) : (
                      <span className="choice-dot" />
                    )}
                  </button>
                );
              })}
            </div>
            {step === 2 && challenge === "Other" && (
              <div className="form-field">
                <label htmlFor={id}>Tell us a little more</label>
                <input
                  id={id}
                  maxLength={300}
                  value={other}
                  onChange={(e) => setOther(e.target.value)}
                />
              </div>
            )}
            <div className="finder-actions">
              {step > 0 ? (
                <button className="text-link" onClick={() => move(step - 1)}>
                  <ArrowLeft size={16} /> Back
                </button>
              ) : (
                <span className="small-copy">
                  No sign-up. Just a little clarity.
                </span>
              )}
              <button
                className="button"
                disabled={!valid}
                onClick={() => move(step + 1)}
              >
                {step === 2 ? "Find my stack" : "Next"}
                <ArrowRight size={17} />
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="recommended-stack">
              {recommendation.map((r, i) => (
                <div key={r.id}>
                  <span>0{i + 1}</span>
                  <div>
                    <strong>
                      {services.find((s) => s.slug === r.id)?.title}
                    </strong>
                    <p>{r.reason}</p>
                  </div>
                  <Check size={17} />
                </div>
              ))}
            </div>
            {industry === "Real Estate" &&
              (goal === "leads" || goal === "conversions") && (
                <p className="recommendation-note">
                  Landing experience + performance marketing + CRM + WhatsApp
                  automation + AI voice qualification + analytics.
                </p>
              )}
            <p className="small-copy">
              A rule-based starting point. We’ll refine it together around your
              business.
            </p>
            <div className="finder-actions">
              <button
                className="text-link"
                onClick={() => {
                  setIndustry("");
                  setGoal("");
                  setChallenge("");
                  setOther("");
                  move(0);
                }}
              >
                <RotateCcw size={15} /> Start again
              </button>
              <ButtonLink
                href={contactLink(
                  recommendation.map((r) => r.id),
                  industry,
                )}
              >
                Let’s build this stack
              </ButtonLink>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
