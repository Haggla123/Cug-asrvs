import type { AcademicServiceDefinition, DeliveryMethod } from '../types';
import { INITIAL_SERVICES_CATALOGUE, DELIVERY_FEES } from './constants';

const TARIFF_STORAGE_KEYS = {
  SERVICES_CATALOGUE: 'cug_asrvs_tariff_catalogue',
  DELIVERY_FEES: 'cug_asrvs_tariff_delivery_fees',
};

export const TariffStorage = {
  getServicesCatalogue(): AcademicServiceDefinition[] {
    try {
      const saved = localStorage.getItem(TARIFF_STORAGE_KEYS.SERVICES_CATALOGUE);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback to initial catalogue on error/SSR
    }
    return INITIAL_SERVICES_CATALOGUE;
  },

  saveServicesCatalogue(services: AcademicServiceDefinition[]): void {
    try {
      localStorage.setItem(TARIFF_STORAGE_KEYS.SERVICES_CATALOGUE, JSON.stringify(services));
      window.dispatchEvent(new Event('cug_tariffs_updated'));
    } catch {
      // ignore
    }
  },

  getDeliveryFees(): Record<DeliveryMethod, number> {
    try {
      const saved = localStorage.getItem(TARIFF_STORAGE_KEYS.DELIVERY_FEES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return { ...DELIVERY_FEES, ...parsed };
        }
      }
    } catch {
      // Fallback
    }
    return DELIVERY_FEES;
  },

  saveDeliveryFees(fees: Record<DeliveryMethod, number>): void {
    try {
      localStorage.setItem(TARIFF_STORAGE_KEYS.DELIVERY_FEES, JSON.stringify(fees));
      window.dispatchEvent(new Event('cug_tariffs_updated'));
    } catch {
      // ignore
    }
  },

  resetDefaults(): { services: AcademicServiceDefinition[]; deliveryFees: Record<DeliveryMethod, number> } {
    try {
      localStorage.removeItem(TARIFF_STORAGE_KEYS.SERVICES_CATALOGUE);
      localStorage.removeItem(TARIFF_STORAGE_KEYS.DELIVERY_FEES);
      window.dispatchEvent(new Event('cug_tariffs_updated'));
    } catch {
      // ignore
    }
    return {
      services: INITIAL_SERVICES_CATALOGUE,
      deliveryFees: DELIVERY_FEES,
    };
  },
};
