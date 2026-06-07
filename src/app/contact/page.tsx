import type { Metadata } from "next";
import { MapPin, Mail, Clock } from "lucide-react";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/modules/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Visit the Atelier studio in Florence, or write to us — we reply within two working days.",
};

const DETAILS = [
  {
    icon: MapPin,
    label: "The studio",
    lines: ["12 Atelier Lane", "50123 Florence, Italy"],
  },
  {
    icon: Mail,
    label: "Write to us",
    lines: ["studio@atelier.example", "press@atelier.example"],
  },
  {
    icon: Clock,
    label: "Studio hours",
    lines: ["Tuesday – Saturday", "10:00 – 18:00 CET"],
  },
] as const;

export default function ContactPage() {
  return (
    <div>
      <section className="section-y mx-auto max-w-[1600px] px-6 lg:px-12">
        <SectionHeading
          eyebrow="Contact"
          title="Come by, or write to us."
          description="Whether it's a question about a pigment or a wholesale enquiry, the studio is glad to hear from you."
          className="reveal block-gap max-w-2xl"
        />

        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          {/* Details */}
          <div className="flex flex-col gap-10">
            <dl className="reveal flex flex-col divide-y divide-hairline border-y border-hairline">
              {DETAILS.map(({ icon: Icon, label, lines }) => (
                <div key={label} className="flex items-start gap-5 py-6">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-ink" strokeWidth={1.25} aria-hidden={true} />
                  <div className="flex flex-col gap-1">
                    <dt className="text-[11px] uppercase tracking-[0.2em] text-ink-muted">
                      {label}
                    </dt>
                    {lines.map((line) => (
                      <dd key={line} className="text-base text-ink">
                        {line}
                      </dd>
                    ))}
                  </div>
                </div>
              ))}
            </dl>

            {/* Embedded map */}
            <div className="reveal relative aspect-[4/3] w-full overflow-hidden border border-hairline grayscale">
              <iframe
                title="Map to the Atelier studio in Florence, Italy"
                src="https://www.google.com/maps?q=Florence,Italy&z=13&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>

          {/* Form */}
          <div className="reveal">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
