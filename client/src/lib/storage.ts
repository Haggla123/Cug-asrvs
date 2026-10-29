import type { ApplicantInfo, SelectedServiceItem, OrderReason, RecipientDetails, DeliveryDetails } from '../types';

const STORAGE_KEYS = {
  STEP1_APPLICANT: 'cug_asrvs_draft_applicant',
  STEP2_ITEMS: 'cug_asrvs_draft_items',
  STEP2_REASON: 'cug_asrvs_draft_reason',
  STEP2_RECIPIENT: 'cug_asrvs_draft_recipient',
  STEP2_DELIVERY: 'cug_asrvs_draft_delivery',
  CURRENT_STEP: 'cug_asrvs_current_step',
  LAST_CONFIRMED_ORDER: 'cug_asrvs_last_confirmed_order'
};

export const DraftStorage = {
  saveApplicant(data: ApplicantInfo): void {
    try {
      localStorage.setItem(STORAGE_KEYS.STEP1_APPLICANT, JSON.stringify(data));
    } catch {
      // ignore
    }
  },

  getApplicant(): ApplicantInfo | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STEP1_APPLICANT);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveSelectedItems(items: SelectedServiceItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.STEP2_ITEMS, JSON.stringify(items));
    } catch {
      // ignore
    }
  },

  getSelectedItems(): SelectedServiceItem[] | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STEP2_ITEMS);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveReason(reason: OrderReason): void {
    try {
      localStorage.setItem(STORAGE_KEYS.STEP2_REASON, reason);
    } catch {
      // ignore
    }
  },

  getReason(): OrderReason | null {
    try {
      return (localStorage.getItem(STORAGE_KEYS.STEP2_REASON) as OrderReason) || null;
    } catch {
      return null;
    }
  },

  saveRecipient(recipient: RecipientDetails): void {
    try {
      localStorage.setItem(STORAGE_KEYS.STEP2_RECIPIENT, JSON.stringify(recipient));
    } catch {
      // ignore
    }
  },

  getRecipient(): RecipientDetails | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STEP2_RECIPIENT);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveDelivery(delivery: DeliveryDetails): void {
    try {
      localStorage.setItem(STORAGE_KEYS.STEP2_DELIVERY, JSON.stringify(delivery));
    } catch {
      // ignore
    }
  },

  getDelivery(): DeliveryDetails | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STEP2_DELIVERY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  clearDraft(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    } catch {
      // ignore
    }
  }
};
