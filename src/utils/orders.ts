"use server";

import type { OrderConfirmation, PlaceOrderInput } from "@/types/api";
import { apiUrl } from "@/utils/apiClient";

/**
 * Order placement, isolated as a Server Action.
 *
 * Running on the server (not the browser) means the request is made
 * server-to-server, so checkout never depends on the backend enabling CORS for
 * the browser origin, and the API URL is resolved server-side. The browser
 * cart is resolved into a strict {@link PlaceOrderInput} by the caller.
 */

/** Discriminated result so the client can render success or a clean error. */
export type PlaceOrderResult =
  | { readonly ok: true; readonly order: OrderConfirmation }
  | { readonly ok: false; readonly error: string };

/** Subset of the backend `OrderResponse` the storefront actually consumes. */
interface OrderResponseDTO {
  orderReference?: string | null;
  total?: number | null;
  placedAt?: string | null;
  customerEmail?: string | null;
}

/** RFC 7807 problem detail shape the backend returns on validation/stock errors. */
interface ProblemDetailDTO {
  detail?: string | null;
  title?: string | null;
}

/** Place an order through the backend `POST /orders` endpoint. */
export async function placeOrder(
  input: PlaceOrderInput,
): Promise<PlaceOrderResult> {
  try {
    const res = await fetch(apiUrl("/orders"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      const problem = (await res
        .json()
        .catch(() => null)) as ProblemDetailDTO | null;
      const message =
        problem?.detail ??
        problem?.title ??
        `We couldn't place your order (error ${res.status}). Please try again.`;
      return { ok: false, error: message };
    }

    const dto = (await res.json()) as OrderResponseDTO;
    return {
      ok: true,
      order: {
        orderReference: dto.orderReference ?? "—",
        total: typeof dto.total === "number" ? dto.total : 0,
        placedAt: dto.placedAt ?? new Date().toISOString(),
        customerEmail: dto.customerEmail ?? input.customerEmail,
      },
    };
  } catch (error) {
    console.error("placeOrder failed:", error);
    return {
      ok: false,
      error: "We couldn't reach the order service. Please try again in a moment.",
    };
  }
}
