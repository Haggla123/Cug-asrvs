import React, { useState, useEffect } from 'react';
import type { 
  ApplicantInfo, 
  SelectedServiceItem, 
  OrderReason, 
  RecipientDetails, 
  DeliveryDetails, 
  OrderDraft 
} from '../types';
import { DraftStorage } from '../lib/storage';
import { calculateOrderTotals } from '../lib/currency';
import { WizardStepper } from '../components/ui/WizardStepper';
import { StudentInfoStep } from '../features/applicant/StudentInfoStep';
import { ServicesDeliveryStep } from '../features/services/ServicesDeliveryStep';
import { OrderSummaryStep } from '../features/orders/OrderSummaryStep';

interface RequestWizardPageProps {
  onCancel: () => void;
}

export const RequestWizardPage: React.FC<RequestWizardPageProps> = ({ onCancel }) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Draft Data States
  const [applicant, setApplicant] = useState<ApplicantInfo | null>(() => DraftStorage.getApplicant());
  const [items, setItems] = useState<SelectedServiceItem[]>(() => DraftStorage.getSelectedItems() || []);
  const [reason, setReason] = useState<OrderReason>(() => DraftStorage.getReason() || 'For Employment');
  const [recipient, setRecipient] = useState<RecipientDetails>(() => DraftStorage.getRecipient() || { type: 'SELF' });
  const [delivery, setDelivery] = useState<DeliveryDetails>(() => DraftStorage.getDelivery() || { method: 'SELF_PICKUP', feePesewas: 0 });

  // Save changes to local draft storage
  useEffect(() => {
    if (applicant) DraftStorage.saveApplicant(applicant);
  }, [applicant]);

  useEffect(() => {
    if (items.length > 0) DraftStorage.saveSelectedItems(items);
  }, [items]);

  useEffect(() => {
    DraftStorage.saveReason(reason);
  }, [reason]);

  useEffect(() => {
    DraftStorage.saveRecipient(recipient);
  }, [recipient]);

  useEffect(() => {
    DraftStorage.saveDelivery(delivery);
  }, [delivery]);

  // Handle Step 1 Complete
  const handleStep1Complete = (data: ApplicantInfo) => {
    setApplicant(data);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Step 2 Complete
  const handleStep2Complete = (data: {
    items: SelectedServiceItem[];
    reason: OrderReason;
    recipient: RecipientDetails;
    delivery: DeliveryDetails;
  }) => {
    setItems(data.items);
    setReason(data.reason);
    setRecipient(data.recipient);
    setDelivery(data.delivery);
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Build Full Order Draft for Step 3
  const { subtotalPesewas, deliveryFeePesewas, totalPesewas } = calculateOrderTotals(
    items.map(i => ({ unitPricePesewas: i.unitPricePesewas, quantity: i.quantity })),
    delivery.feePesewas
  );

  const fullOrderDraft: OrderDraft = {
    applicant: applicant || {
      indexNumber: '',
      legalName: '',
      phone: '',
      email: '',
      faculty: '',
      programme: '',
      status: 'CONTINUING',
      country: 'Ghana',
      region: 'Bono Region (Sunyani)',
      address: ''
    },
    items,
    reason,
    recipient,
    delivery,
    subtotalPesewas,
    deliveryFeePesewas,
    totalPesewas
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
      {/* Stepper Navigation */}
      <WizardStepper
        currentStep={currentStep}
        onStepClick={(step) => {
          if (step === 1) setCurrentStep(1);
          if (step === 2 && applicant) setCurrentStep(2);
          if (step === 3 && applicant && items.length > 0) setCurrentStep(3);
        }}
        maxAccessibleStep={applicant ? (items.length > 0 ? 3 : 2) : 1}
      />

      {/* Step 1 */}
      {currentStep === 1 && (
        <StudentInfoStep
          initialData={applicant}
          onContinue={handleStep1Complete}
          onCancel={onCancel}
        />
      )}

      {/* Step 2 */}
      {currentStep === 2 && (
        <ServicesDeliveryStep
          initialItems={items}
          initialReason={reason}
          initialRecipient={recipient}
          initialDelivery={delivery}
          onContinue={handleStep2Complete}
          onBack={() => setCurrentStep(1)}
        />
      )}

      {/* Step 3 */}
      {currentStep === 3 && (
        <OrderSummaryStep
          draft={fullOrderDraft}
          onEditApplicant={() => setCurrentStep(1)}
          onEditServices={() => setCurrentStep(2)}
        />
      )}
    </div>
  );
};
