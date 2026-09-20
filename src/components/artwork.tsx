import type { CaseStudy } from "@/lib/content-types";
import {
  AudioLines,
  ArrowUpRight,
  Check,
  MapPin,
  Play,
  Layers,
} from "lucide-react";
export function CaseArtwork({ type }: { type: CaseStudy["art"] }) {
  return (
    <div className={`case-art art-${type}`} aria-hidden="true">
      {type === "voice" ? (
        <>
          <div className="voice-orb">
            <AudioLines size={66} strokeWidth={1} />
          </div>
          <div className="waveform">
            {Array.from({ length: 38 }, (_, i) => (
              <i key={i} style={{ height: `${15 + ((i * 37 + 19) % 67)}%` }} />
            ))}
          </div>
          <div className="art-pill">
            <span className="status-dot" /> Conversation → action
          </div>
        </>
      ) : type === "mobile" ? (
        <div className="phone-art">
          <div className="phone-notch" />
          <span>YOUR NEXT CHAPTER</span>
          <strong>
            A clearer
            <br />
            financial picture.
          </strong>
          <div className="phone-chart">
            {[30, 45, 35, 65, 55, 80, 90].map((n, i) => (
              <i key={i} style={{ height: `${n}%` }} />
            ))}
          </div>
          <div className="phone-row">
            Your goals <ArrowUpRight size={18} />
          </div>
        </div>
      ) : type === "content" ? (
        <div className="content-frames">
          <div>
            MAKE
            <br />
            <em>SOME</em>
            <br />
            NOISE.
            <Play />
          </div>
          <div>
            STAY
            <br />
            <em>A LITTLE</em>
            <br />
            ODD.
            <Play />
          </div>
        </div>
      ) : type === "data" ? (
        <div className="dashboard-art">
          <div className="dashboard-header">
            <span>THE BIGGER PICTURE</span>
            <span>↗</span>
          </div>
          <div className="bar-chart">
            {[35, 55, 48, 68, 60, 80, 73, 93].map((n, i) => (
              <i key={i} style={{ height: `${n}%` }} />
            ))}
          </div>
          <div className="dashboard-foot">
            Connected data. Clearer decisions.
          </div>
        </div>
      ) : type === "commerce" ? (
        <div className="commerce-art">
          <div className="product-shape" />
          <div className="commerce-caption">
            <span>
              GOOD THINGS.
              <br />
              GREAT EXPERIENCES.
            </span>
            <ArrowUpRight />
          </div>
          <div className="art-pill">
            <Check size={14} /> Order → operation
          </div>
        </div>
      ) : (
        <div className="field-art">
          <div className="map-lines" />
          <div className="map-pin pin-one">
            <MapPin />
          </div>
          <div className="map-pin pin-two">
            <MapPin />
          </div>
          <div className="map-pin pin-three">
            <MapPin />
          </div>
          <div className="dispatch-card">
            <Layers size={20} />
            <span>
              {type === "routes"
                ? "A more connected working day."
                : "Every job. One shared view."}
            </span>
            <div>
              <i />
              <i />
              <i />
            </div>
          </div>
        </div>
      )}
      <span className="art-label">ODD / {type.toUpperCase()}</span>
    </div>
  );
}
