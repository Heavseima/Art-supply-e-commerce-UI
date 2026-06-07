"use client";

import { useState } from "react";

/**
 * Atomic newsletter signup form. Isolated client island so the surrounding
 * footer can remain a pure server component. Prevents the native GET reload
 * and surfaces an accessible confirmation. No backend wired yet — submission
 * is captured client-side and acknowledged.
 */
export function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <p role="status" className="mt-2 py-2 text-sm text-ink">
        Thank you — you&rsquo;re on the list.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-2 flex border-b border-ink-muted focus-within:border-ink"
    >
      <input
        type="email"
        name="email"
        required
        placeholder="Email address"
        aria-label="Email address"
        className="w-full bg-transparent py-2 text-sm text-ink placeholder:text-ink-muted focus:outline-none"
      />
      <button
        type="submit"
        className="text-[11px] uppercase tracking-[0.18em] text-ink transition-colors hover:text-accent"
      >
        Join
      </button>
    </form>
  );
}
