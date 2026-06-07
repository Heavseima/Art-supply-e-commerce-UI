"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";

import type { Product } from "@/types/api";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/hooks/useCart";

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
}

/**
 * Client island that adds a product to the LocalStorage cart and gives a brief,
 * screen-reader-announced confirmation. Isolated so server-rendered cards and
 * pages stay static and only this small interactive leaf ships JS.
 */
export function AddToCartButton({
  product,
  quantity = 1,
  size = "md",
  fullWidth = false,
  className,
}: AddToCartButtonProps) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const soldOut = product.stock <= 0;

  // Clear any pending confirmation reset if we unmount mid-timeout.
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const handleClick = () => {
    add(product, quantity);
    setAdded(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <>
      <Button
        type="button"
        size={size}
        variant="outline"
        className={[fullWidth ? "w-full" : "", className]
          .filter(Boolean)
          .join(" ")}
        disabled={soldOut}
        onClick={handleClick}
      >
        {soldOut ? (
          "Sold out"
        ) : added ? (
          <span className="inline-flex items-center gap-1.5">
            Added
            <Check className="h-3.5 w-3.5" strokeWidth={2} aria-hidden={true} />
          </span>
        ) : (
          "Add to bag"
        )}
      </Button>
      <span aria-live="polite" className="sr-only">
        {added ? `${product.name} added to your bag` : ""}
      </span>
    </>
  );
}
