import type { Metadata } from "next";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { CartView } from "@/components/modules/CartView";
import { getProducts } from "@/utils/products";

export const metadata: Metadata = {
  title: "Your Bag",
  description: "Review the pieces in your Atelier bag before checkout.",
};

export default async function CartPage() {
  // Cached catalog read; cart lines are resolved against it on the client.
  const catalog = await getProducts();

  return (
    <div className="section-y mx-auto max-w-[1600px] px-6 lg:px-12">
      <SectionHeading eyebrow="Your Bag" title="Review your selection" className="reveal block-gap" />
      <CartView catalog={catalog} />
    </div>
  );
}
