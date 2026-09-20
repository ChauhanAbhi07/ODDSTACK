"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="container section">
      <p className="eyebrow">A small interruption</p>
      <h1>Let’s reconnect.</h1>
      <p>Something went wrong loading this page. Give it another try.</p>
      <button className="button" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
