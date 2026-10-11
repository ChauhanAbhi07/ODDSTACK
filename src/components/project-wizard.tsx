"use client";
import { useId, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Check, Send } from "lucide-react";
import { services } from "@/data/services";
import { finderIndustries } from "@/lib/recommendations";
import { reportAlert } from "@/lib/alerts/report";
import { inquirySchema } from "@/lib/inquiry-schema";
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
  ["description", "capabilities"],
  ["name", "company", "email", "phone"],
];
const lastStep = stepFields.length - 1;
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
    intent: "Not sure yet",
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
  const [submitted, setSubmitted] = useState(false);
  const inFlight = useRef(false);
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
    if (inFlight.current || !validate(true)) return;
    const inquiry = inquirySchema.parse(form);
    inFlight.current = true;
    setPending(true);
    setFailure("");
    try {
      const response = await fetch(site.inquiryEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: inquiry.name,
          email: inquiry.email,
          message: inquiry.description,
          company: inquiry.company,
          phone: inquiry.phone,
          services:
            inquiry.capabilities
              .map(
                (id) =>
                  services.find((service) => service.slug === id)?.title || id,
              )
              .join(", ") || "Not sure yet",
          industry: inquiry.industry,
          engagement: inquiry.engagement,
          subject: "New ODDESTACK website enquiry",
          _gotcha: inquiry.website,
        }),
        signal: AbortSignal.timeout(20000),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || data?.ok !== true) {
        const fields: Record<string, string> = {};
        if (Array.isArray(data?.errors)) {
          for (const issue of data.errors) {
            const field =
              issue.field === "message" ? "description" : issue.field;
            if (
              stepFields.flat().includes(field) &&
              typeof issue.message === "string"
            )
              fields[field] = issue.message;
          }
        }
        if (fields.description) setStep(0);
        setErrors(fields);
        throw new Error(
          response.status === 429
            ? "Too many enquiries right now. Please wait a moment and try again."
            : "We couldn't send your enquiry. Your details are still here; please try again.",
        );
      }
      reportAlert({ kind: "enquiry" });
      setSubmitted(true);
      requestAnimationFrame(() => title.current?.focus());
    } catch (error) {
      setFailure(
        error instanceof Error &&
          error.name !== "TypeError" &&
          error.name !== "TimeoutError"
          ? error.message
          : "We couldn't confirm your enquiry. Your details are still here; please try again.",
      );
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  };
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
        maxLength={
          field === "email"
            ? 254
            : field === "phone"
              ? 40
              : field === "name"
                ? 100
                : 150
        }
        required={field === "name" || field === "email"}
        disabled={pending}
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
      {submitted ? (
        <div className="wizard-success">
          <span className="success-check">
            <Check size={34} aria-hidden="true" />
          </span>
          <h3 tabIndex={-1} ref={title}>
            Thanks! Your enquiry has been submitted.
          </h3>
          <p>We will reply using the contact details you shared.</p>
          <button
            className="button"
            onClick={() => {
              setSubmitted(false);
              setForm((current) => ({
                ...current,
                description: "",
                name: "",
                email: "",
                phone: "",
                company: "",
                website: "",
              }));
              move(0);
            }}
          >
            Start a new enquiry <ArrowRight size={17} aria-hidden="true" />
          </button>
        </div>
      ) : (
        <>
          <div className="wizard-progress">
            <span className="mono-label">LET’S CONNECT</span>
            <span>
              Step {step + 1} of {stepFields.length}
            </span>
          </div>
          <div className="progress-track">
            {stepFields.map((_, i) => (
              <span className={i <= step ? "complete" : ""} key={i} />
            ))}
          </div>
          <h3 ref={title} tabIndex={-1}>
            {["What can we help you with?", "How can we reach you?"][step]}
          </h3>
          <p className="wizard-help">
            {
              [
                "A sentence or two is enough. No technical brief needed.",
                "Just your name and email. We’ll discuss the details together.",
              ][step]
            }
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (step < lastStep) {
                if (validate()) move(step + 1);
              } else void submit();
            }}
            noValidate
          >
            {step === 0 && (
              <>
                <div className="form-field">
                  <label htmlFor={`${uid}-description`}>
                    What do you need help with?
                  </label>
                  <textarea
                    id={`${uid}-description`}
                    name="description"
                    rows={4}
                    required
                    value={form.description}
                    maxLength={4000}
                    placeholder="For example: I need a website for my shop with online bookings."
                    onChange={(e) => set("description", e.target.value)}
                    aria-invalid={!!errors.description}
                    aria-describedby={
                      errors.description
                        ? `${uid}-description-error`
                        : undefined
                    }
                  />
                  {errors.description && (
                    <p className="field-error" id={`${uid}-description-error`}>
                      {errors.description}
                    </p>
                  )}
                </div>
                <details
                  className="brief-review"
                  open={initialCapabilities.length > 0 ? true : undefined}
                >
                  <summary>
                    Choose services (optional)
                    {form.capabilities.length
                      ? ` · ${form.capabilities.length} selected`
                      : ""}
                  </summary>
                  <fieldset>
                    <legend>Select any services you have in mind</legend>
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
                                ? form.capabilities.filter(
                                    (id) => id !== s.slug,
                                  )
                                : [...form.capabilities, s.slug],
                            )
                          }
                        >
                          {s.title}
                          {form.capabilities.includes(s.slug) && (
                            <Check size={14} aria-hidden="true" />
                          )}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                </details>
              </>
            )}
            {step === 1 && (
              <>
                <div className="form-grid">
                  {input("name", "Your name", "name")}
                  {input("email", "Email", "email", "email")}
                  {input("phone", "Phone / WhatsApp (optional)", "tel", "tel")}
                  {input(
                    "company",
                    "Company / project (optional)",
                    "organization",
                  )}
                </div>
                <p className="small-copy">
                  We’ll use these details to respond to your enquiry.{" "}
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
                  ? "Sending enquiry..."
                  : step === lastStep
                    ? "Send enquiry"
                    : "Continue"}
                {step === lastStep ? (
                  <Send size={16} />
                ) : (
                  <ArrowRight size={17} />
                )}
              </button>
            </div>
            <div className="sr-only" role="status">
              {pending ? "Sending enquiry" : ""}
            </div>
          </form>
        </>
      )}
    </div>
  );
}
