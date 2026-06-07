"use client";

import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";

/**
 * Contact form — isolated client island. Captures the message client-side and
 * acknowledges it (no backend wired). Prevents the native page reload.
 */
export function ContactForm() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex flex-col items-start gap-5 border border-hairline bg-canvas-deep p-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-canvas">
          <Check className="h-5 w-5" strokeWidth={1.75} aria-hidden={true} />
        </span>
        <h3 className="font-display text-2xl font-medium text-ink">
          Message received.
        </h3>
        <p className="text-sm leading-relaxed text-ink-muted">
          Thank you for writing. Our studio replies within two working days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-7">
      <div className="grid gap-7 sm:grid-cols-2">
        <TextField label="Name" name="name" required autoComplete="name" placeholder="Jane Painter" />
        <TextField
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="jane@studio.com"
        />
      </div>
      <TextField label="Subject" name="subject" placeholder="A question about pigments" />
      <label htmlFor="message" className="flex flex-col gap-2">
        <span className="text-[12px] font-semibold text-ink">Message</span>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Tell us what you're working on…"
          className="resize-none border-b border-hairline-strong bg-transparent py-2.5 text-sm text-ink transition-colors placeholder:text-ink-muted/60 focus:border-ink focus:outline-none"
        />
      </label>
      <Button type="submit" variant="solid" size="lg" className="w-full sm:w-auto">
        Send message
      </Button>
    </form>
  );
}
