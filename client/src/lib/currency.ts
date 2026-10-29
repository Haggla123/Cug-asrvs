// Decimal-safe currency calculations and formatters

/**
 * Converts integer minor units (pesewas) to formatted GHS currency string.
 * Example: 5000 -> "GHS 50.00"
 */
export function formatPesewas(pesewas: number): string {
  const ghs = (pesewas / 100).toFixed(2);
  return `GHS ${ghs}`;
}

/**
 * Converts GHS float (from inputs if any) to integer pesewas safely.
 */
export function ghsToPesewas(ghs: number): number {
  return Math.round(ghs * 100);
}

/**
 * Calculates item subtotal safely.
 */
export function calculateItemSubtotal(unitPricePesewas: number, quantity: number): number {
  if (quantity < 1) return 0;
  return unitPricePesewas * Math.floor(quantity);
}

/**
 * Calculates full order totals.
 */
export function calculateOrderTotals(
  items: { unitPricePesewas: number; quantity: number }[],
  deliveryFeePesewas: number = 0
): { subtotalPesewas: number; deliveryFeePesewas: number; totalPesewas: number } {
  const subtotalPesewas = items.reduce(
    (sum, item) => sum + calculateItemSubtotal(item.unitPricePesewas, item.quantity),
    0
  );
  return {
    subtotalPesewas,
    deliveryFeePesewas,
    totalPesewas: subtotalPesewas + deliveryFeePesewas
  };
}
