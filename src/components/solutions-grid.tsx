"use client";
import { useRef, useState } from "react";
import { ArrowUpRight, X, ArrowRight } from "lucide-react";
import { solutions } from "@/data/solutions";
import { services } from "@/data/services";
import { ButtonLink, Eyebrow, Tags } from "./ui";
import { contactLink } from "@/lib/recommendations";
export function SolutionsGrid() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState(solutions[0]);
  const close = () => {
    dialog.current?.close();
    document.body.style.overflow = "";
  };
  return (
    <>
      <div className="solutions-grid">
        {solutions.map((s, i) => (
          <button
            key={s.slug}
            className="solution-card"
            onClick={() => {
              setActive(s);
              dialog.current?.showModal();
              document.body.style.overflow = "hidden";
            }}
          >
            <div>
              <span className="mono-label">0{i + 1}</span>
              <ArrowUpRight size={22} />
            </div>
            <h3>{s.title}</h3>
            <p>{s.description}</p>
          </button>
        ))}
      </div>
      <dialog
        ref={dialog}
        className="detail-dialog"
        aria-labelledby="solution-title"
        onCancel={close}
        onClose={() => {
          document.body.style.overflow = "";
        }}
      >
        <button
          className="icon-button dialog-close"
          onClick={close}
          aria-label="Close solution"
        >
          <X />
        </button>
        <Eyebrow>Outcome first. Stack second.</Eyebrow>
        <h2 id="solution-title">{active.title}.</h2>
        <p className="dialog-intro">{active.description}</p>
        <p>{active.approach}</p>
        <h3>Your connected capabilities</h3>
        <Tags
          items={active.capabilities.map(
            (id) => services.find((s) => s.slug === id)!.title,
          )}
        />
        <div className="dialog-flow">
          <span>Understand</span>
          <ArrowRight size={16} />
          <span>Connect</span>
          <ArrowRight size={16} />
          <span>Improve</span>
        </div>
        <div onClick={close}>
          <ButtonLink href={contactLink(active.capabilities)}>
            Build this stack
          </ButtonLink>
        </div>
      </dialog>
    </>
  );
}
