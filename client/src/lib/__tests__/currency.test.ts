import { describe, it, expect } from 'vitest';
import { 
  formatPesewas, 
  ghsToPesewas, 
  calculateItemSubtotal, 
  calculateOrderTotals 
} from '../currency';

describe('Currency Calculations & Formatters', () => {
  it('formats pesewas to GHS string accurately', () => {
    expect(formatPesewas(5000)).toBe('GHS 50.00');
    expect(formatPesewas(3500)).toBe('GHS 35.00');
    expect(formatPesewas(0)).toBe('GHS 0.00');
    expect(formatPesewas(35000)).toBe('GHS 350.00');
  });

  it('converts GHS to integer pesewas safely', () => {
    expect(ghsToPesewas(50)).toBe(5000);
    expect(ghsToPesewas(35.50)).toBe(3550);
    expect(ghsToPesewas(0)).toBe(0);
  });

  it('calculates independent copy counters subtotal correctly', () => {
    // 1 copy @ GHS 50.00
    expect(calculateItemSubtotal(5000, 1)).toBe(5000);
    // 2 copies @ GHS 50.00
    expect(calculateItemSubtotal(5000, 2)).toBe(10000);
    // 3 copies @ GHS 40.00
    expect(calculateItemSubtotal(4000, 3)).toBe(12000);
    // minimum 1 copy enforced
    expect(calculateItemSubtotal(5000, 0)).toBe(0);
  });

  it('calculates full multi-service order totals including delivery fee', () => {
    const items = [
      { unitPricePesewas: 5000, quantity: 2 }, // 2 transcripts = GHS 100.00
      { unitPricePesewas: 4000, quantity: 1 }  // 1 english letter = GHS 40.00
    ];

    // Pickup (fee = 0)
    const pickupOrder = calculateOrderTotals(items, 0);
    expect(pickupOrder.subtotalPesewas).toBe(14000);
    expect(pickupOrder.deliveryFeePesewas).toBe(0);
    expect(pickupOrder.totalPesewas).toBe(14000);

    // Domestic courier (fee = 5000 pesewas / GHS 50.00)
    const courierOrder = calculateOrderTotals(items, 5000);
    expect(courierOrder.subtotalPesewas).toBe(14000);
    expect(courierOrder.deliveryFeePesewas).toBe(5000);
    expect(courierOrder.totalPesewas).toBe(19000);

    // International courier (fee = 35000 pesewas / GHS 350.00)
    const intlOrder = calculateOrderTotals(items, 35000);
    expect(intlOrder.subtotalPesewas).toBe(14000);
    expect(intlOrder.deliveryFeePesewas).toBe(35000);
    expect(intlOrder.totalPesewas).toBe(49000);
  });
});
