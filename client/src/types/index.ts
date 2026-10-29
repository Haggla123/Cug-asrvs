// Domain models and data types for CUG ASRVS

export type StudentStatus = 'CONTINUING' | 'COMPLETED';

export interface ApplicantInfo {
  indexNumber: string;
  legalName: string;
  phone: string;
  altPhone?: string;
  email: string;
  faculty: string;
  programme: string;
  status: StudentStatus;
  graduationYear?: number;
  country: string;
  region: string;
  address: string;
}

export type AcademicServiceCode = 
  | 'TRANSCRIPT'
  | 'ENGLISH_PROFICIENCY'
  | 'ATTESTATION'
  | 'CERTIFIED_COPY'
  | 'RECOMMENDATION';

export interface AcademicServiceDefinition {
  id: string;
  code: AcademicServiceCode;
  title: string;
  description: string;
  basePricePesewas: number; // in pesewas (5000 = GHS 50.00)
  badgeText?: string;
  requiresLevel?: boolean;
  requiresPurpose?: boolean;
  requiresLecturer?: boolean;
  requiresDocument?: boolean;
}

export interface SelectedServiceItem {
  serviceId: string;
  code: AcademicServiceCode;
  title: string;
  unitPricePesewas: number;
  quantity: number;
  subtotalPesewas: number;
  options?: {
    academicLevel?: 'Bachelor\'s Degree' | 'Master\'s Degree' | 'Diploma';
    declaredPurpose?: 'Visa / Embassy Application' | 'Internship / Employment' | 'Banking & Financial Account' | 'National Service Scheme (NSS)';
    targetLecturer?: string;
    uploadedFileName?: string;
  };
}

export type OrderReason = 
  | 'For Myself'
  | 'For Admission'
  | 'For Employment'
  | 'For Scholarship'
  | 'For an Organization / Institution'
  | 'For Some Other Reasons';

export type RecipientType = 'SELF' | 'ORGANIZATION' | 'OTHER';

export interface RecipientDetails {
  type: RecipientType;
  organizationName?: string;
  attentionPerson?: string;
  referenceNumber?: string;
  otherLegalName?: string;
  otherRelationship?: string;
}

export type DeliveryMethod = 
  | 'SELF_PICKUP'
  | 'PROXY_PICKUP'
  | 'EMAIL'
  | 'DOMESTIC_COURIER'
  | 'INTERNATIONAL_COURIER';

export interface DeliveryDetails {
  method: DeliveryMethod;
  feePesewas: number;
  // Proxy details
  proxyName?: string;
  proxyGhanaCard?: string;
  // Email details
  recipientEmail?: string;
  // Courier details
  recipientName?: string;
  recipientPhone?: string;
  destinationCountry?: string;
  city?: string;
  addressLine?: string;
  gpsAddress?: string;
  postalCode?: string;
}

export interface OrderDraft {
  applicant: ApplicantInfo;
  items: SelectedServiceItem[];
  reason: OrderReason;
  recipient: RecipientDetails;
  delivery: DeliveryDetails;
  subtotalPesewas: number;
  deliveryFeePesewas: number;
  totalPesewas: number;
}

export type RequestStatus = 
  | 'SUBMITTED'
  | 'AWAITING_CLEARANCE'
  | 'UNDER_REVIEW'
  | 'ACTION_REQUIRED'
  | 'PROCESSING'
  | 'AWAITING_APPROVAL'
  | 'APPROVED'
  | 'READY_FOR_PICKUP'
  | 'DISPATCHED'
  | 'COMPLETED'
  | 'REJECTED';

export type ItemStatus = 
  | 'PENDING'
  | 'PREPARING'
  | 'AWAITING_REVIEW'
  | 'APPROVED'
  | 'READY'
  | 'DISPATCHED'
  | 'COMPLETED';

export interface TrackingTimelineStep {
  label: string;
  status: 'COMPLETED' | 'ACTIVE' | 'PENDING';
  date?: string;
  detail?: string;
}

export interface TrackingResult {
  referenceNumber: string;
  applicantName: string;
  indexNumber: string;
  requestStatus: RequestStatus;
  paymentStatus: 'SUCCESSFUL' | 'PENDING' | 'FAILED';
  submittedAt: string;
  deliveryMethod: DeliveryMethod;
  items: {
    title: string;
    quantity: number;
    subtotalGHS: string;
    itemStatus: ItemStatus;
  }[];
  timeline: TrackingTimelineStep[];
  collectionInfo?: string;
  courierTracking?: {
    provider: string;
    trackingNumber: string;
  };
}
