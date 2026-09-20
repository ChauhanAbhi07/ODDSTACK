"use client";
import { useState } from "react";
import { Check, Minus } from "lucide-react";
const rows = [
  [
    "Strategy",
    "Separate plans and priorities",
    "One strategy, built around your business",
  ],
  ["Delivery", "Multiple briefs and handoffs", "One connected delivery team"],
  [
    "Context",
    "Explaining the same thing again",
    "Shared understanding from day one",
  ],
  [
    "Systems",
    "Integrations become your problem",
    "Connected systems by design",
  ],
  [
    "Measurement",
    "Different reports, different definitions",
    "A shared view of what matters",
  ],
  [
    "Iteration",
    "Coordinating across vendors",
    "A shorter path from learning to action",
  ],
];
export function Comparison() {
  const [mode, setMode] = useState("stack");
  return (
    <div className="comparison">
      <div className="segmented" role="group" aria-label="Compare approaches">
        <button
          aria-pressed={mode === "vendors"}
          onClick={() => setMode("vendors")}
        >
          Many vendors
        </button>
        <button
          aria-pressed={mode === "stack"}
          onClick={() => setMode("stack")}
        >
          One ODDESTACK
        </button>
      </div>
      <div className="comparison-rows">
        {rows.map((r) => (
          <div key={r[0]}>
            <span>{r[0]}</span>
            <p>
              {mode === "stack" ? <Check size={18} /> : <Minus size={18} />}
              {mode === "stack" ? r[2] : r[1]}
            </p>
          </div>
        ))}
      </div>
      <p className="small-copy">
        An integrated approach to delivery. Outcomes depend on scope, systems
        and execution.
      </p>
    </div>
  );
}
