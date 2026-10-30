import type { AcademicServiceDefinition, DeliveryMethod } from '../types';

export const CUG_FACULTIES = [
  {
    name: 'Faculty of Computing & Information Science',
    programmes: [
      'BSc. Information Technology',
      'BSc. Computer Science',
      'BSc. Business Information Systems',
      'Diploma in Information Technology'
    ]
  },
  {
    name: 'Faculty of Economics & Business Administration',
    programmes: [
      'BSc. Accounting',
      'BSc. Banking & Finance',
      'BSc. Human Resource Management',
      'BSc. Marketing',
      'BSc. Management',
      'BSc. Economics'
    ]
  },
  {
    name: 'Faculty of Health & Allied Sciences',
    programmes: [
      'BSc. Public Health (Nursing)',
      'BSc. Public Health (Health Education)',
      'BSc. Public Health (Health Informatics)',
      'BSc. General Nursing'
    ]
  },
  {
    name: 'Faculty of Education',
    programmes: [
      'B.Ed. English Language',
      'B.Ed. Mathematics',
      'B.Ed. Religious & Moral Education',
      'Postgraduate Diploma in Education'
    ]
  },
  {
    name: 'Faculty of Religions & Social Sciences',
    programmes: [
      'BA. Religious Studies',
      'BA. Social Work',
      'BA. Pastoral Ministry'
    ]
  }
];

export const GHANA_REGIONS = [
  'Ahafo Region',
  'Ashanti Region',
  'Bono Region (Sunyani)',
  'Bono East Region',
  'Central Region',
  'Eastern Region',
  'Greater Accra Region',
  'Northern Region',
  'North East Region',
  'Oti Region',
  'Savannah Region',
  'Upper East Region',
  'Upper West Region',
  'Volta Region',
  'Western Region',
  'Western North Region'
];

export const INITIAL_SERVICES_CATALOGUE: AcademicServiceDefinition[] = [
  {
    id: 'srv_transcript',
    code: 'TRANSCRIPT',
    title: 'Official Academic Transcript',
    description: 'Comprehensive record of all courses taken, credit hours, and grades achieved, embossed with the official university seal.',
    basePricePesewas: 5000, // GHS 50.00
    badgeText: 'Seal Included',
    requiresLevel: true
  },
  {
    id: 'srv_english',
    code: 'ENGLISH_PROFICIENCY',
    title: 'English Proficiency Letter',
    description: 'Certifies that English is the official and exclusive medium of instruction and assessment at the Catholic University of Ghana.',
    basePricePesewas: 4000 // GHS 40.00
  },
  {
    id: 'srv_attestation',
    code: 'ATTESTATION',
    title: 'Attestation / Introductory Letter',
    description: 'Official registry declaration verifying your enrollment status, academic standing, or degree completion for third parties.',
    basePricePesewas: 3500, // GHS 35.00
    requiresPurpose: true
  },
  {
    id: 'srv_certified_copy',
    code: 'CERTIFIED_COPY',
    title: 'Certified True Copy of Certificate',
    description: 'Official institutional verification stamp and registrar signature certifying the authenticity of a previously issued diploma/degree certificate.',
    basePricePesewas: 3000, // GHS 30.00
    requiresDocument: true
  },
  {
    id: 'srv_recommendation',
    code: 'RECOMMENDATION',
    title: 'Academic Recommendation Letter',
    description: 'Formal confidential or open academic recommendation letter authored by the designated faculty Dean or Head of Department.',
    basePricePesewas: 4000, // GHS 40.00
    requiresLecturer: true
  }
];

export const DELIVERY_FEES: Record<DeliveryMethod, number> = {
  SELF_PICKUP: 0,
  PROXY_PICKUP: 0,
  EMAIL: 0,
  DOMESTIC_COURIER: 5000, // GHS 50.00 (Ghana Post EMS)
  INTERNATIONAL_COURIER: 35000 // GHS 350.00 (DHL Express)
};

export const PICKUP_LOCATION_DEFAULT = 'Academic Affairs Office Desk, Fiapre-Sunyani Campus';

// ---------------------------------------------------------------------------
// PAYMENT SETTINGS — Category B (Finance Office configurable)
// These are the manual payment details displayed to students during checkout.
// In the live system these values will be stored in the database and managed
// through the Finance Office portal.  The defaults below are placeholders.
// ---------------------------------------------------------------------------
export const PAYMENT_SETTINGS = {
  mobileMoney: [
    {
      network: 'MTN MoMo',
      accountNumber: '024 XXX XXXX',
      accountName: 'Catholic University of Ghana – Registry',
      instructions: 'Dial *170# → Send Money → type the number above → enter the exact amount → use your reference as the description.',
    },
    {
      network: 'Telecel Cash',
      accountNumber: '027 XXX XXXX',
      accountName: 'Catholic University of Ghana – Registry',
      instructions: 'Dial *700# → Send Money → enter the number above → enter the exact amount.',
    },
  ],
  bankTransfer: {
    bankName: 'GCB Bank Ltd',
    branch: 'Sunyani Branch',
    accountName: 'Catholic University of Ghana',
    accountNumber: '1234567890',
    sortCode: '040101',
    swiftCode: 'GHCBGHAC',
    instructions: 'Make a direct bank deposit or online transfer. Use your full name and student index number as the reference/narration.',
  },
};
