"use client";
import { useId, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Check, Send } from "lucide-react";
import { services } from "@/data/services";
import { finderIndustries } from "@/lib/recommendations";
import {
  intents,
  companySizes,
  budgets,
  timelines,
  inquirySchema,
} from "@/lib/inquiry-schema";
import { site } from "@/config/site";

type FormData = {
  engagement: string;
  intent: string;
  capabilities: string[];
  industry: string;
  companySize: string;
  budget: string;
  timeline: string;
  description: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  website: string;
};
const stepFields = [
  ["intent", "capabilities"],
  ["industry", "companySize"],
  ["budget", "timeline"],
  ["description"],
  ["name", "company", "email", "phone"],
];
export function ProjectWizard({
  initialCapabilities = [],
  initialIndustry = "",
  initialEngagement = "",
}: {
  initialCapabilities?: string[];
  initialIndustry?: string;
  initialEngagement?: string;
}) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>({
    engagement: initialEngagement,
    intent: "",
    capabilities: initialCapabilities.filter((id) =>
      services.some((s) => s.slug === id),
    ),
    industry: finderIndustries.some((i) => i === initialIndustry)
      ? initialIndustry
      : "",
    companySize: "",
    budget: "",
    timeline: "",
    description: "",
    name: "",
    company: "",
    email: "",
    phone: "",
    website: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [failure, setFailure] = useState("");
  const [emailDraft, setEmailDraft] = useState("");
  const [receipt, setReceipt] = useState<{ id: string; mode: string } | null>(
    null,
  );
  const key = useRef("");
  const priorPayload = useRef("");
  const root = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const uid = useId();
  const set = (field: keyof FormData, value: string | string[]) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
    setFailure("");
  };
  const move = (n: number) => {
    setStep(n);
    setErrors({});
    requestAnimationFrame(() => title.current?.focus());
  };
  const validate = (all = false) => {
    const parsed = inquirySchema.safeParse(form);
    const issues = parsed.success
      ? []
      : parsed.error.issues.filter(
          (i) => all || stepFields[step].includes(String(i.path[0])),
        );
    const nextErrors = Object.fromEntries(
      issues.map((i) => [i.path[0], i.message]),
    );
    setErrors(nextErrors);
    if (issues.length) {
      requestAnimationFrame(() =>
        root.current
          ?.querySelector<HTMLElement>("[aria-invalid='true']")
          ?.focus(),
      );
      return false;
    }
    return true;
  };
  const submit = async () => {
    if (!validate(true)) return;
    if (process.env.NEXT_PUBLIC_STATIC_SITE === "true") {
      setEmailDraft(
        [
          "ODDESTACK project enquiry",
          "",
          `Name: ${form.name}`,
          `Company / project: ${form.company}`,
          `Email: ${form.email}`,
          `Phone / WhatsApp: ${form.phone || "Not provided"}`,
          "",
          `Intent: ${form.intent}`,
          `Services: ${form.capabilities.map((id) => services.find((s) => s.slug === id)?.title || id).join(", ") || "Not sure yet"}`,
          `Industry: ${form.industry}`,
          `Company size: ${form.companySize}`,
          `Budget: ${form.budget}`,
          `Timeline: ${form.timeline}`,
          `Engagement: ${form.engagement || "Not specified"}`,
          "",
          "Project description:",
          form.description,
        ].join("\n"),
      );
      requestAnimationFrame(() => title.current?.focus());
      return;
    }
    setPending(true);
    setFailure("");
    const payload = JSON.stringify(form);
    if (!key.current || payload !== priorPayload.current) {
      key.current = crypto.randomUUID();
      priorPayload.current = payload;
    }
    try {
      const r = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": key.current,
        },
        body: payload,
      });
      const data = await r.json();
      if (!r.ok) {
        setErrors(data.fields || {});
        throw new Error(data.error || "We couldn't save your brief.");
      }
      setReceipt(data);
      requestAnimationFrame(() => title.current?.focus());
    } catch (error) {
      setFailure(
        error instanceof Error
          ? error.message
          : "The connection failed. Your answers are still here; please retry.",
      );
    } finally {
      setPending(false);
    }
  };
  const choices = (field: keyof FormData, options: readonly string[]) => (
    <div className="choice-grid">
      {options.map((value) => (
        <button
          key={value}
          type="button"
          className={`choice ${form[field] === value ? "selected" : ""}`}
          aria-pressed={form[field] === value}
          onClick={() => set(field, value)}
        >
          {value}
          {form[field] === value ? (
            <Check size={15} />
          ) : (
            <span className="choice-dot" />
          )}
        </button>
      ))}
    </div>
  );
  const fieldset = (
    field: keyof FormData,
    label: string,
    options: readonly string[],
  ) => (
    <fieldset
      tabIndex={-1}
      aria-invalid={!!errors[field]}
      aria-describedby={errors[field] ? `${uid}-${field}-error` : undefined}
    >
      <legend>{label}</legend>
      {choices(field, options)}
      {errors[field] && (
        <p id={`${uid}-${field}-error`} className="field-error">
          {errors[field]}
        </p>
      )}
    </fieldset>
  );
  const input = (
    field: "name" | "company" | "email" | "phone",
    label: string,
    autoComplete: string,
    type = "text",
  ) => (
    <div className="form-field">
      <label htmlFor={`${uid}-${field}`}>{label}</label>
      <input
        id={`${uid}-${field}`}
        name={field}
        type={type}
        autoComplete={autoComplete}
        value={form[field]}
        maxLength={field === "email" ? 254 : field === "phone" ? 40 : 150}
        onChange={(e) => set(field, e.target.value)}
        aria-invalid={!!errors[field]}
        aria-describedby={errors[field] ? `${uid}-${field}-error` : undefined}
      />
      {errors[field] && (
        <p id={`${uid}-${field}-error`} className="field-error">
          {errors[field]}
        </p>
      )}
    </div>
  );
  return (
    <div ref={root} className="project-wizard">
      {emailDraft ? (
        <div className="email-draft">
          <h3 tabIndex={-1} ref={title}>
            Your brief is ready to email.
          </h3>
          <p>
            Open your email app, review the draft and send it to {site.email}.
            Nothing has been sent yet.
          </p>
          <a
            className="button"
            href={`mailto:${site.email}?subject=${encodeURIComponent("ODDESTACK project enquiry")}&body=${encodeURIComponent(emailDraft)}`}
          >
            Open email app <Send size={16} aria-hidden="true" />
          </a>
          <label htmlFor={`${uid}-email-draft`}>
            Prefer webmail? Copy your brief below and email it to {site.email}.
          </label>
          <textarea
            id={`${uid}-email-draft`}
            rows={10}
            readOnly
            value={emailDraft}
            onFocus={(event) => event.target.select()}
          />
          <button
            className="text-link"
            onClick={() => {
              setEmailDraft("");
              requestAnimationFrame(() => title.current?.focus());
            }}
          >
            <ArrowLeft size={16} aria-hidden="true" /> Edit my brief
          </button>
        </div>
      ) : receipt ? (
        <div className="wizard-success">
          <span className="success-check">
            <Check size={34} />
          </span>
          <h3 tabIndex={-1} ref={title}>
            Nice. We’ve got the brief — even if you don’t.
          </h3>
          <p>
            {receipt.mode === "local"
              ? "Your brief was saved locally for this development demo. It has not been sent to ODDESTACK."
              : receipt.mode === "email"
                ? "Your enquiry has been queued for email delivery to our team. Thanks for sharing what you want to build."
                : "Your brief has been saved. Thanks for sharing what you want to build."}
          </p>
          <p className="receipt">Reference: {receipt.id}</p>
          <button
            className="button"
            onClick={() => {
              setReceipt(null);
              key.current = "";
              move(0);
            }}
          >
            Edit and create another brief <ArrowRight size={17} />
          </button>
        </div>
      ) : (
        <>
          <div className="wizard-progress">
            <span className="mono-label">YOUR NEXT CHAPTER</span>
            <span>0{step + 1} / 05</span>
          </div>
          <div className="progress-track">
            {stepFields.map((_, i) => (
              <span className={i <= step ? "complete" : ""} key={i} />
            ))}
          </div>
          <h3 ref={title} tabIndex={-1}>
            {
              [
                "What are you trying to do?",
                "Tell us about your business.",
                "Let's set a little context.",
                "What's on your mind?",
                "Where can we find you?",
              ][step]
            }
          </h3>
          <p className="wizard-help">
            {
              [
                "Start with the ambition. We'll help connect the rest.",
                "A little context helps us build the right stack.",
                "Rough estimates are fine. Nothing is set in stone.",
                "Tell us what you want to build, fix, automate or grow.",
                "One last step. Review your brief and leave your details.",
              ][step]
            }
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (step < 4) {
                if (validate()) move(step + 1);
              } else void submit();
            }}
            noValidate
          >
            {step === 0 && (
              <>
                {fieldset("intent", "The mission", intents)}
                <fieldset>
                  <legend>
                    What might you need?{" "}
                    <span className="muted">(optional, choose any)</span>
                  </legend>
                  <div className="capability-choices">
                    {services.map((s) => (
                      <button
                        type="button"
                        key={s.slug}
                        aria-pressed={form.capabilities.includes(s.slug)}
                        onClick={() =>
                          set(
                            "capabilities",
                            form.capabilities.includes(s.slug)
                              ? form.capabilities.filter((id) => id !== s.slug)
                              : [...form.capabilities, s.slug],
                          )
                        }
                      >
                        {s.title}
                        {form.capabilities.includes(s.slug) && (
                          <Check size={14} />
                        )}
                      </button>
                    ))}
                  </div>
                </fieldset>
              </>
            )}
            {step === 1 && (
              <>
                <div className="form-field">
                  <label htmlFor={`${uid}-industry`}>Industry</label>
                  <select
                    id={`${uid}-industry`}
                    value={form.industry}
                    onChange={(e) => set("industry", e.target.value)}
                    aria-invalid={!!errors.industry}
                    aria-describedby={`${uid}-industry-error`}
                  >
                    <option value="">Choose your industry</option>
                    {finderIndustries.map((i) => (
                      <option key={i}>{i}</option>
                    ))}
                  </select>
                  <p className="field-error" id={`${uid}-industry-error`}>
                    {errors.industry}
                  </p>
                </div>
                {fieldset("companySize", "Company size", companySizes)}
              </>
            )}
            {step === 2 && (
              <>
                {fieldset("budget", "Estimated project budget", budgets)}
                {fieldset(
                  "timeline",
                  "When would you like to begin?",
                  timelines,
                )}
              </>
            )}
            {step === 3 && (
              <div className="form-field">
                <label htmlFor={`${uid}-description`}>
                  Your project, in your words
                </label>
                <textarea
                  id={`${uid}-description`}
                  rows={7}
                  value={form.description}
                  maxLength={4000}
                  placeholder="The idea, the problem, or the thing that keeps ending up on your to-do list…"
                  onChange={(e) => set("description", e.target.value)}
                  aria-invalid={!!errors.description}
                  aria-describedby={`${uid}-description-error`}
                />
                <div className="textarea-foot">
                  <p className="field-error" id={`${uid}-description-error`}>
                    {errors.description}
                  </p>
                  <span>{form.description.length}/4000</span>
                </div>
              </div>
            )}
            {step === 4 && (
              <>
                <details className="brief-review">
                  <summary>Review your brief</summary>
                  <dl>
                    {form.engagement && (
                      <>
                        <dt>Engagement</dt>
                        <dd>{form.engagement}</dd>
                      </>
                    )}
                    <dt>Mission</dt>
                    <dd>{form.intent}</dd>
                    <dt>Capabilities</dt>
                    <dd>
                      {form.capabilities
                        .map((id) => services.find((s) => s.slug === id)?.title)
                        .join(", ") || "Help us decide"}
                    </dd>
                    <dt>Business</dt>
                    <dd>
                      {form.industry} · {form.companySize}
                    </dd>
                    <dt>Budget / timeline</dt>
                    <dd>
                      {form.budget} · {form.timeline}
                    </dd>
                    <dt>Project</dt>
                    <dd>{form.description}</dd>
                  </dl>
                </details>
                <div className="form-grid">
                  {input("name", "Your name", "name")}
                  {input("company", "Company / project", "organization")}
                  {input("email", "Email", "email", "email")}
                  {input("phone", "Phone / WhatsApp (optional)", "tel", "tel")}
                </div>
                <p className="small-copy">
                  We’ll use these details to respond to your project enquiry.{" "}
                  <Link href="/privacy">Read the privacy notice.</Link>
                </p>
              </>
            )}
            <div className="honeypot" aria-hidden="true">
              <label htmlFor={`${uid}-website`}>Leave this field empty</label>
              <input
                id={`${uid}-website`}
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={(e) => set("website", e.target.value)}
              />
            </div>
            {failure && (
              <p className="submission-error" role="alert">
                {failure} <a href={`mailto:${site.email}`}>{site.email}</a>
              </p>
            )}
            <div className="wizard-actions">
              {step > 0 ? (
                <button
                  className="text-link"
                  type="button"
                  disabled={pending}
                  onClick={() => move(step - 1)}
                >
                  <ArrowLeft size={16} /> Back
                </button>
              ) : (
                <span className="small-copy">
                  A good conversation starts here.
                </span>
              )}
              <button className="button" type="submit" disabled={pending}>
                {pending
                  ? "Saving your brief…"
                  : step === 4
                    ? process.env.NEXT_PUBLIC_STATIC_SITE === "true"
                      ? "Prepare email brief"
                      : "Send my brief"
                    : "Continue"}
                {step === 4 ? <Send size={16} /> : <ArrowRight size={17} />}
              </button>
            </div>
            <div className="sr-only" role="status">
              {pending ? "Saving your brief" : ""}
            </div>
          </form>
        </>
      )}
    </div>
  );
}
