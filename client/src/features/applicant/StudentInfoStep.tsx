import React, { useState, useEffect } from 'react';
import type { ApplicantInfo } from '../../types';
import { CUG_FACULTIES, GHANA_REGIONS } from '../../lib/constants';

interface StudentInfoStepProps {
  initialData: ApplicantInfo | null;
  onContinue: (data: ApplicantInfo) => void;
  onCancel?: () => void;
}

export const StudentInfoStep: React.FC<StudentInfoStepProps> = ({
  initialData,
  onContinue,
  onCancel
}) => {
  const [formData, setFormData] = useState<ApplicantInfo>({
    indexNumber: initialData?.indexNumber || '',
    legalName: initialData?.legalName || '',
    phone: initialData?.phone || '',
    altPhone: initialData?.altPhone || '',
    email: initialData?.email || '',
    faculty: initialData?.faculty || CUG_FACULTIES[0].name,
    programme: initialData?.programme || CUG_FACULTIES[0].programmes[0],
    status: initialData?.status || 'CONTINUING',
    graduationYear: initialData?.graduationYear || (new Date().getFullYear() - 1),
    country: initialData?.country || 'Ghana',
    region: initialData?.region || 'Bono Region (Sunyani)',
    address: initialData?.address || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableProgrammes, setAvailableProgrammes] = useState<string[]>([]);

  // Update programmes when faculty changes
  useEffect(() => {
    const matchedFaculty = CUG_FACULTIES.find(f => f.name === formData.faculty);
    if (matchedFaculty) {
      setAvailableProgrammes(matchedFaculty.programmes);
      if (!matchedFaculty.programmes.includes(formData.programme)) {
        setFormData(prev => ({ ...prev, programme: matchedFaculty.programmes[0] }));
      }
    }
  }, [formData.faculty]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.indexNumber.trim()) {
      newErrors.indexNumber = 'Student index number is required';
    }
    if (!formData.legalName.trim()) {
      newErrors.legalName = 'Full legal name is required';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Mobile phone number is required';
    } else if (!/^[0-9+() -]{9,15}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.faculty) {
      newErrors.faculty = 'Faculty / School is required';
    }
    if (!formData.programme) {
      newErrors.programme = 'Programme of study is required';
    }
    if (formData.status === 'COMPLETED' && (!formData.graduationYear || formData.graduationYear < 2000)) {
      newErrors.graduationYear = 'Valid graduation year is required for alumni';
    }
    if (!formData.region) {
      newErrors.region = 'Region of residence is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Permanent or postal address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onContinue(formData);
    } else {
      // Scroll to the first error
      window.scrollTo({ top: 150, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header Banner */}
      <section className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 text-secondary text-label-sm font-label-sm font-bold uppercase tracking-wider">
          <span className="material-symbols-outlined text-sm">account_balance</span>
          <span>Fiapre Academic Registry • Student Verification</span>
        </div>
        <h1 className="text-headline-sm sm:text-headline-md font-serif text-primary tracking-tight font-bold">
          Step 1: Student Information
        </h1>
        <p className="text-body-md font-body-md text-on-surface-variant">
          Please provide your academic records information exactly as registered with the Catholic University of Ghana. No account is required.
        </p>
      </section>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* CARD 1: PRIMARY IDENTIFICATION */}
        <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-xl shadow-sm border border-outline-variant/60 space-y-4">
          <div className="border-b border-outline-variant/50 pb-2.5">
            <h2 className="text-title-md font-title-md text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">badge</span>
              Primary Identification
            </h2>
            <p className="text-body-sm font-body-sm text-outline mt-0.5">
              Must match your institutional student archives
            </p>
          </div>

          {/* Index Number */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="indexNumber" className="text-label-md font-label-md text-on-surface">
                Student Index Number <span className="text-primary font-bold">*</span>
              </label>
              <span className="text-label-sm font-label-sm text-outline uppercase tracking-wider">Required</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                <span className="material-symbols-outlined text-lg">pin</span>
              </div>
              <input
                id="indexNumber"
                type="text"
                required
                value={formData.indexNumber}
                onChange={e => setFormData({ ...formData, indexNumber: e.target.value })}
                placeholder="e.g. CUG/BIT/20/004 or 10423011"
                className={`w-full pl-9 pr-3 py-2.5 bg-surface-container-lowest rounded-lg border text-on-surface placeholder:text-outline-variant/80 font-mono text-body-md focus:ring-2 focus:ring-primary/20 transition-all ${
                  errors.indexNumber ? 'border-error focus:border-error' : 'border-outline-variant focus:border-primary'
                }`}
              />
            </div>
            {errors.indexNumber ? (
              <p className="text-body-sm font-body-sm text-error mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">error</span>
                {errors.indexNumber}
              </p>
            ) : (
              <p className="text-body-sm font-body-sm text-outline mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-secondary">help</span>
                Found on your student ID card, admission letter, or portal
              </p>
            )}
          </div>

          {/* Full Legal Name */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="legalName" className="text-label-md font-label-md text-on-surface">
                Full Legal Name <span className="text-primary font-bold">*</span>
              </label>
              <span className="text-label-sm font-label-sm text-outline uppercase tracking-wider">Official</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                <span className="material-symbols-outlined text-lg">person</span>
              </div>
              <input
                id="legalName"
                type="text"
                required
                value={formData.legalName}
                onChange={e => setFormData({ ...formData, legalName: e.target.value })}
                placeholder="Surname, First Name, Other Names"
                className={`w-full pl-9 pr-3 py-2.5 bg-surface-container-lowest rounded-lg border text-on-surface placeholder:text-outline-variant/80 text-body-md focus:ring-2 focus:ring-primary/20 transition-all ${
                  errors.legalName ? 'border-error focus:border-error' : 'border-outline-variant focus:border-primary'
                }`}
              />
            </div>
            {errors.legalName && (
              <p className="text-body-sm font-body-sm text-error mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">error</span>
                {errors.legalName}
              </p>
            )}
          </div>

          {/* Phone & Alt Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="text-label-md font-label-md text-on-surface block mb-1">
                Mobile Phone Number <span className="text-primary font-bold">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-lg">call</span>
                </div>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="024 123 4567"
                  className={`w-full pl-9 pr-3 py-2.5 bg-surface-container-lowest rounded-lg border text-on-surface placeholder:text-outline-variant/80 text-body-md focus:ring-2 focus:ring-primary/20 transition-all ${
                    errors.phone ? 'border-error focus:border-error' : 'border-outline-variant focus:border-primary'
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="text-body-sm font-body-sm text-error mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label htmlFor="altPhone" className="text-label-md font-label-md text-on-surface block mb-1">
                Alternate Phone <span className="text-outline text-label-sm">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-lg">phone_android</span>
                </div>
                <input
                  id="altPhone"
                  type="tel"
                  value={formData.altPhone || ''}
                  onChange={e => setFormData({ ...formData, altPhone: e.target.value })}
                  placeholder="Optional secondary line"
                  className="w-full pl-9 pr-3 py-2.5 bg-surface-container-lowest rounded-lg border border-outline-variant text-on-surface placeholder:text-outline-variant/80 text-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label htmlFor="email" className="text-label-md font-label-md text-on-surface block mb-1">
              Email Address <span className="text-primary font-bold">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                <span className="material-symbols-outlined text-lg">mail</span>
              </div>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. yourname@gmail.com or student@cug.edu.gh"
                className={`w-full pl-9 pr-3 py-2.5 bg-surface-container-lowest rounded-lg border text-on-surface placeholder:text-outline-variant/80 text-body-md focus:ring-2 focus:ring-primary/20 transition-all ${
                  errors.email ? 'border-error focus:border-error' : 'border-outline-variant focus:border-primary'
                }`}
              />
            </div>
            {errors.email ? (
              <p className="text-body-sm font-body-sm text-error mt-1">{errors.email}</p>
            ) : (
              <p className="text-body-sm font-body-sm text-outline mt-1">
                Official order receipts and dispatch updates will be sent here
              </p>
            )}
          </div>
        </div>

        {/* CARD 2: ACADEMIC STANDING & PROGRAMME */}
        <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-xl shadow-sm border border-outline-variant/60 space-y-4">
          <div className="border-b border-outline-variant/50 pb-2.5">
            <h2 className="text-title-md font-title-md text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">school</span>
              Academic Affiliation
            </h2>
            <p className="text-body-sm font-body-sm text-outline mt-0.5">
              Specify your enrolled faculty and completion status
            </p>
          </div>

          {/* Faculty */}
          <div>
            <label htmlFor="faculty" className="text-label-md font-label-md text-on-surface block mb-1">
              Faculty / School <span className="text-primary font-bold">*</span>
            </label>
            <select
              id="faculty"
              value={formData.faculty}
              onChange={e => setFormData({ ...formData, faculty: e.target.value })}
              className="w-full px-3 py-2.5 bg-surface-container-lowest rounded-lg border border-outline-variant text-on-surface text-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
            >
              {CUG_FACULTIES.map(faculty => (
                <option key={faculty.name} value={faculty.name}>
                  {faculty.name}
                </option>
              ))}
            </select>
          </div>

          {/* Programme */}
          <div>
            <label htmlFor="programme" className="text-label-md font-label-md text-on-surface block mb-1">
              Programme of Study <span className="text-primary font-bold">*</span>
            </label>
            <select
              id="programme"
              value={formData.programme}
              onChange={e => setFormData({ ...formData, programme: e.target.value })}
              className="w-full px-3 py-2.5 bg-surface-container-lowest rounded-lg border border-outline-variant text-on-surface text-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
            >
              {availableProgrammes.map(prog => (
                <option key={prog} value={prog}>
                  {prog}
                </option>
              ))}
            </select>
          </div>

          {/* Student Status (Radio Group) */}
          <div>
            <label className="text-label-md font-label-md text-on-surface block mb-2">
              Current Student Status <span className="text-primary font-bold">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label 
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  formData.status === 'CONTINUING' 
                    ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                    : 'border-outline-variant hover:bg-surface-container-low'
                }`}
              >
                <input
                  type="radio"
                  name="studentStatus"
                  value="CONTINUING"
                  checked={formData.status === 'CONTINUING'}
                  onChange={() => setFormData({ ...formData, status: 'CONTINUING' })}
                  className="text-primary focus:ring-secondary h-4 w-4"
                />
                <div>
                  <span className="text-title-sm font-title-sm text-on-surface block">
                    Continuing Student
                  </span>
                  <span className="text-body-sm font-body-sm text-outline block">
                    Currently enrolled in classes
                  </span>
                </div>
              </label>

              <label 
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  formData.status === 'COMPLETED' 
                    ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                    : 'border-outline-variant hover:bg-surface-container-low'
                }`}
              >
                <input
                  type="radio"
                  name="studentStatus"
                  value="COMPLETED"
                  checked={formData.status === 'COMPLETED'}
                  onChange={() => setFormData({ ...formData, status: 'COMPLETED' })}
                  className="text-primary focus:ring-secondary h-4 w-4"
                />
                <div>
                  <span className="text-title-sm font-title-sm text-on-surface block">
                    Completed / Alumnus
                  </span>
                  <span className="text-body-sm font-body-sm text-outline block">
                    Graduated or finished studies
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Conditional: Graduation Year */}
          {formData.status === 'COMPLETED' && (
            <div className="p-3.5 bg-secondary-fixed/20 border border-secondary/30 rounded-lg animate-fade-in">
              <label htmlFor="graduationYear" className="text-label-md font-label-md text-on-surface block mb-1">
                Graduation / Completion Year <span className="text-primary font-bold">*</span>
              </label>
              <div className="relative max-w-xs">
                <input
                  id="graduationYear"
                  type="number"
                  min="2000"
                  max={new Date().getFullYear()}
                  value={formData.graduationYear || ''}
                  onChange={e => setFormData({ ...formData, graduationYear: parseInt(e.target.value, 10) || undefined })}
                  placeholder="e.g. 2023"
                  className={`w-full px-3 py-2 bg-surface-container-lowest rounded-lg border text-on-surface text-body-md focus:ring-2 focus:ring-primary/20 font-mono ${
                    errors.graduationYear ? 'border-error' : 'border-outline-variant focus:border-primary'
                  }`}
                />
              </div>
              {errors.graduationYear && (
                <p className="text-body-sm font-body-sm text-error mt-1">{errors.graduationYear}</p>
              )}
            </div>
          )}
        </div>

        {/* CARD 3: RESIDENCE & POSTAL LOCATION */}
        <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-xl shadow-sm border border-outline-variant/60 space-y-4">
          <div className="border-b border-outline-variant/50 pb-2.5">
            <h2 className="text-title-md font-title-md text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">home_pin</span>
              Residential &amp; Postal Address
            </h2>
            <p className="text-body-sm font-body-sm text-outline mt-0.5">
              Required for institutional archiving and physical dispatch records
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="country" className="text-label-md font-label-md text-on-surface block mb-1">
                Country of Residence <span className="text-primary font-bold">*</span>
              </label>
              <input
                id="country"
                type="text"
                value={formData.country}
                onChange={e => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-3 py-2.5 bg-surface-container-lowest rounded-lg border border-outline-variant text-on-surface text-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div>
              <label htmlFor="region" className="text-label-md font-label-md text-on-surface block mb-1">
                Region <span className="text-primary font-bold">*</span>
              </label>
              <select
                id="region"
                value={formData.region}
                onChange={e => setFormData({ ...formData, region: e.target.value })}
                className="w-full px-3 py-2.5 bg-surface-container-lowest rounded-lg border border-outline-variant text-on-surface text-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
              >
                {GHANA_REGIONS.map(reg => (
                  <option key={reg} value={reg}>
                    {reg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="address" className="text-label-md font-label-md text-on-surface block mb-1">
              Permanent / Postal Address <span className="text-primary font-bold">*</span>
            </label>
            <textarea
              id="address"
              rows={2}
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              placeholder="House number, street address, or P.O. Box"
              className={`w-full px-3 py-2.5 bg-surface-container-lowest rounded-lg border text-on-surface placeholder:text-outline-variant/80 text-body-md focus:ring-2 focus:ring-primary/20 transition-all ${
                errors.address ? 'border-error focus:border-error' : 'border-outline-variant focus:border-primary'
              }`}
            />
            {errors.address && (
              <p className="text-body-sm font-body-sm text-error mt-1">{errors.address}</p>
            )}
          </div>
        </div>

        {/* Action Button Dock */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          {onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors text-label-md font-label-md font-medium"
            >
              Cancel Request
            </button>
          ) : (
            <div />
          )}

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 rounded-lg bg-primary text-on-primary hover:bg-primary-container active:bg-primary focus:ring-2 focus:ring-secondary/50 font-title-sm font-title-sm font-semibold shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Proceed to Services &amp; Delivery</span>
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </div>
      </form>
    </div>
  );
};
