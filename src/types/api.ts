/**
 * Strict TypeScript bindings that mirror the backend DTO structures exactly.
 *
 * These are the single source of truth for product shape across the app.
 * No `any` is permitted anywhere in this project — narrow with `unknown`
 * + type guards if you must consume untyped data.
 */

/** Unique product identifier as returned by the backend. */
export type ProductId = string;

/** Category identifier a product belongs to. */
export type CategoryId = string;

/**
 * Core product DTO. Field set matches the backend contract exactly:
 * id, categoryId, slug, description, price, stock, imageUrl.
 */
export interface Product {
  /** Stable unique identifier. */
  readonly id: ProductId;
  /** Owning category identifier (joins to {@link Category.id}). */
  readonly categoryId: CategoryId;
  /** URL-safe slug used for `/products/[slug]` routing. */
  readonly slug: string;
  /** Human-facing display name. */
  readonly name: string;
  /** Long-form editorial description. */
  readonly description: string;
  /** Price in minor-unit-free decimal currency (e.g. 24.0 = $24.00). */
  readonly price: number;
  /** Units available. `0` means sold out. */
  readonly stock: number;
  /** Absolute URL to the product hero image. */
  readonly imageUrl: string;
}

/** A merchandising category used to group and filter products. */
export interface Category {
  readonly id: CategoryId;
  readonly slug: string;
  readonly name: string;
  /** Short editorial blurb shown in filters / collection headers. */
  readonly tagline: string;
}

/** A single line in the local cart (product reference + quantity). */
export interface CartLine {
  readonly productId: ProductId;
  readonly quantity: number;
}

/**
 * A cart line resolved against the catalog for display — pairs the stored
 * line with its full product record and the computed line subtotal.
 */
export interface ResolvedCartLine {
  readonly product: Product;
  readonly quantity: number;
  /** `product.price * quantity`. */
  readonly subtotal: number;
}

/** Minimal shipping payload captured at checkout. */
export interface ShippingDetails {
  readonly fullName: string;
  readonly email: string;
  readonly address: string;
  readonly city: string;
  readonly postalCode: string;
  readonly country: string;
}
