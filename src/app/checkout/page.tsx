import type { Metadata } from "next";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { CheckoutForm } from "@/components/modules/CheckoutForm";
import { getProducts } from "@/utils/products";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Atelier order with a few shipping details.",
};

export default async function CheckoutPage() {
  // Cached catalog read; the cart is resolved against it on the client.
  const catalog = await getProducts();

  return (
    <div className="section-y mx-auto max-w-[1600px] px-6 lg:px-12">
      <SectionHeading
        eyebrow="Checkout"
        title="A few details"
        description="Tell us where to send it. No account required."
        className="reveal block-gap"
      />
      <CheckoutForm catalog={catalog} />
    </div>
  );
}
