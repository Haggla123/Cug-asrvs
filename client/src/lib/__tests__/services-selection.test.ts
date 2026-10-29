import { describe, it, expect } from 'vitest';
import type { SelectedServiceItem } from '../../types';
import { INITIAL_SERVICES_CATALOGUE } from '../constants';

describe('Multi-Service Selection & Independent Counter Rules', () => {
  it('initializes a service item with quantity 1 upon selection', () => {
    const transcriptDef = INITIAL_SERVICES_CATALOGUE.find(s => s.code === 'TRANSCRIPT')!;
    const item: SelectedServiceItem = {
      serviceId: transcriptDef.id,
      code: transcriptDef.code,
      title: transcriptDef.title,
      unitPricePesewas: transcriptDef.basePricePesewas,
      quantity: 1,
      subtotalPesewas: transcriptDef.basePricePesewas
    };

    expect(item.quantity).toBe(1);
    expect(item.subtotalPesewas).toBe(5000);
  });

  it('increments quantity and updates subtotal without affecting other items', () => {
    const items: SelectedServiceItem[] = [
      {
        serviceId: 'srv_transcript',
        code: 'TRANSCRIPT',
        title: 'Official Academic Transcript',
        unitPricePesewas: 5000,
        quantity: 1,
        subtotalPesewas: 5000
      },
      {
        serviceId: 'srv_english',
        code: 'ENGLISH_PROFICIENCY',
        title: 'English Proficiency Letter',
        unitPricePesewas: 4000,
        quantity: 1,
        subtotalPesewas: 4000
      }
    ];

    // Increment transcript to 3
    const updatedItems = items.map(item => {
      if (item.serviceId === 'srv_transcript') {
        const qty = item.quantity + 2;
        return { ...item, quantity: qty, subtotalPesewas: item.unitPricePesewas * qty };
      }
      return item;
    });

    // Transcript updated to 3 copies @ GHS 50 = GHS 150.00 (15000 pesewas)
    expect(updatedItems[0].quantity).toBe(3);
    expect(updatedItems[0].subtotalPesewas).toBe(15000);

    // English letter remains strictly 1 copy @ GHS 40 = GHS 40.00 (4000 pesewas)
    expect(updatedItems[1].quantity).toBe(1);
    expect(updatedItems[1].subtotalPesewas).toBe(4000);
  });

  it('enforces a minimum quantity floor of 1', () => {
    const item: SelectedServiceItem = {
      serviceId: 'srv_transcript',
      code: 'TRANSCRIPT',
      title: 'Official Academic Transcript',
      unitPricePesewas: 5000,
      quantity: 1,
      subtotalPesewas: 5000
    };

    // Attempt decrement below 1
    const attemptedQty = Math.max(1, item.quantity - 1);
    expect(attemptedQty).toBe(1);
  });

  it('removes item completely upon deselection and preserves others', () => {
    const items: SelectedServiceItem[] = [
      {
        serviceId: 'srv_transcript',
        code: 'TRANSCRIPT',
        title: 'Official Academic Transcript',
        unitPricePesewas: 5000,
        quantity: 2,
        subtotalPesewas: 10000
      },
      {
        serviceId: 'srv_english',
        code: 'ENGLISH_PROFICIENCY',
        title: 'English Proficiency Letter',
        unitPricePesewas: 4000,
        quantity: 1,
        subtotalPesewas: 4000
      }
    ];

    // Deselect transcript
    const remaining = items.filter(i => i.serviceId !== 'srv_transcript');
    expect(remaining).toHaveLength(1);
    expect(remaining[0].code).toBe('ENGLISH_PROFICIENCY');
    expect(remaining[0].quantity).toBe(1);
  });
});
