"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";

import type { Product } from "@/types/api";
import { Button } from "@/components/ui/Button";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { useCart } from "@/hooks/useCart";

interface PurchasePanelProps {
  product: Product;
}

/**
 * Detail-page purchase controls: a shared quantity stepper + add-to-cart.
 * Client island so the surrounding product detail can render on the server.
 */
export function PurchasePanel({ product }: PurchasePanelProps) {
  const { add } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const soldOut = product.stock <= 0;

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const handleAdd = () => {
    add(product, quantity);
    setAdded(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAdded(false), 1600);
  };

  if (soldOut) {
    return (
      <Button variant="outline" size="lg" className="w-full" disabled>
        Sold out
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <QuantityStepper
        value={quantity}
        min={1}
        max={product.stock}
        onChange={setQuantity}
      />
      <Button
        type="button"
        variant="solid"
        size="lg"
        className="flex-1"
        onClick={handleAdd}
      >
        {added ? (
          <span className="inline-flex items-center gap-1.5">
            Added to bag
            <Check className="h-3.5 w-3.5" strokeWidth={2} aria-hidden={true} />
          </span>
        ) : (
          "Add to bag"
        )}
      </Button>
      <span aria-live="polite" className="sr-only">
        {added ? `${product.name} added to your bag` : ""}
      </span>
    </div>
  );
}
