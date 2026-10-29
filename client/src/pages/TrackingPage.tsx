import React from 'react';
import { ConfirmationTrackingView } from '../features/tracking/ConfirmationTrackingView';
import type { OrderDraft } from '../types';

interface TrackingPageProps {
  initialRef?: string;
  initialIdentifier?: string;
  onNewRequest: () => void;
}

export const TrackingPage: React.FC<TrackingPageProps> = ({
  initialRef = 'CUG-REQ-2026-8941',
  initialIdentifier = 'CUG/BIT/20/004',
  onNewRequest
}) => {
  // Sample demonstration draft for tracking
  const sampleDraft: OrderDraft = {
    applicant: {
      indexNumber: initialIdentifier || 'CUG/BIT/20/004',
      legalName: 'Mensah, Kwame Emmanuel',
      phone: '024 456 7890',
      email: 'mensah.k@alumni.cug.edu.gh',
      faculty: 'Faculty of Computing & Information Science',
      programme: 'BSc. Information Technology',
      status: 'COMPLETED',
      graduationYear: 2023,
      country: 'Ghana',
      region: 'Greater Accra Region',
      address: 'P.O. Box GP 1234, Accra'
    },
    items: [
      {
        serviceId: 'srv_transcript',
        code: 'TRANSCRIPT',
        title: 'Official Academic Transcript',
        unitPricePesewas: 5000,
        quantity: 2,
        subtotalPesewas: 10000,
        options: { academicLevel: "Bachelor's Degree" }
      },
      {
        serviceId: 'srv_english',
        code: 'ENGLISH_PROFICIENCY',
        title: 'English Proficiency Letter',
        unitPricePesewas: 4000,
        quantity: 1,
        subtotalPesewas: 4000
      }
    ],
    reason: 'For Employment',
    recipient: {
      type: 'ORGANIZATION',
      organizationName: 'Ghana Audit Service',
      attentionPerson: 'Director of HR',
      referenceNumber: 'GAS/REC/2026/089'
    },
    delivery: {
      method: 'DOMESTIC_COURIER',
      feePesewas: 5000,
      recipientName: 'Kwame Emmanuel Mensah',
      recipientPhone: '024 456 7890',
      destinationCountry: 'Ghana',
      city: 'Accra Central',
      addressLine: 'Audit House, Ministries Block A',
      gpsAddress: 'GA-183-9022'
    },
    subtotalPesewas: 14000,
    deliveryFeePesewas: 5000,
    totalPesewas: 19000
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
      <ConfirmationTrackingView
        referenceNumber={initialRef || 'CUG-REQ-2026-8941'}
        orderDraft={sampleDraft}
        onNewRequest={onNewRequest}
      />
    </div>
  );
};
