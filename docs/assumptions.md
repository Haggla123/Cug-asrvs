# CUG ASRVS: Assumptions and Unresolved Business Rules

This document tracks all assumptions, configurable defaults, and unresolved institutional business rules awaiting formal confirmation from Catholic University of Ghana authorities.

### 1. Financial & Fee Schedule Assumptions
- **Official Tariff Approval**: Default prices (GHS 50 for transcripts, GHS 40 for proficiency letters, GHS 35 for attestations, GHS 30 for certified copies, GHS 40 for recommendations) are based on the prototype specification. Confirmation is needed if separate rates apply to graduate/postgraduate programs or express/urgent processing.
- **Courier Flat Rates**: Domestic courier is defaulted to GHS 50 (Ghana Post EMS) and international to GHS 350 (DHL Express). In production, these may be replaced with zone-based or weight-based dynamic rate tables.

### 2. Operational Logistics & Campus Desks
- **Collection Location**: The default pickup location is set to *Academic Affairs Office Desk, Room 104, Fiapre-Sunyani Campus*. Confirmation is required if additional collection desks exist at satellite campuses (e.g. Sunyani City Campus).
- **Authorized Proxy Identification**: Default workflow collects Proxy Legal Name. Collecting Ghana Card numbers is kept optional at the configuration level until approved under Ghanaian Data Protection Act procedures.

### 3. Institutional Systems & Records Integration
- **SIS / CUMIS Integration**: No live automated API currently exists to CUG's student records database. All verification of fee arrears by Finance Officers and academic record lookups by Records Officers will follow a documented manual procedure in the interim.
- **Academic Program Taxonomy**: Faculties, schools, and programs are populated using standard CUG faculties (Faculty of Computing & Information Science, Faculty of Economics & Business Administration, Faculty of Education, Faculty of Health & Allied Sciences, Faculty of Religions & Social Sciences).

### 4. Legal & Cryptographic Signing
- **Digital Signatures**: The system generates visual electronic seals and audit verification hashes (`CUG-SEAL-...`) with QR lookup references. Cryptographic hardware token signing (e.g., PKCS#11 or institutional PKI) will be integrated once hardware and certificates are provisioned by the Registrar.
