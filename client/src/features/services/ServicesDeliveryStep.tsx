import React, { useState } from 'react';
import type { 
  SelectedServiceItem, 
  OrderReason, 
  RecipientDetails, 
  DeliveryDetails, 
  DeliveryMethod 
} from '../../types';
import { PICKUP_LOCATION_DEFAULT } from '../../lib/constants';
import { TariffStorage } from '../../lib/tariffStorage';
import { formatPesewas, calculateOrderTotals } from '../../lib/currency';
import { CopyCounter } from '../../components/ui/CopyCounter';

interface ServicesDeliveryStepProps {
  initialItems: SelectedServiceItem[];
  initialReason?: OrderReason;
  initialRecipient?: RecipientDetails;
  initialDelivery?: DeliveryDetails;
  onContinue: (data: {
    items: SelectedServiceItem[];
    reason: OrderReason;
    recipient: RecipientDetails;
    delivery: DeliveryDetails;
  }) => void;
  onBack: () => void;
}

export const ServicesDeliveryStep: React.FC<ServicesDeliveryStepProps> = ({
  initialItems,
  initialReason,
  initialRecipient,
  initialDelivery,
  onContinue,
  onBack
}) => {
  // Official Tariffs configured by Finance Office
  const [servicesCatalogue] = useState(() => TariffStorage.getServicesCatalogue());
  const [deliveryFees] = useState(() => TariffStorage.getDeliveryFees());

  // Selected Services State
  const [selectedItems, setSelectedItems] = useState<SelectedServiceItem[]>(() => {
    if (initialItems && initialItems.length > 0) return initialItems;
    // Default: Transcript selected with 1 copy
    const transcriptDef = servicesCatalogue[0] || {
      id: 'srv_transcript',
      code: 'TRANSCRIPT',
      title: 'Official Academic Transcript',
      basePricePesewas: 5000,
      description: ''
    };
    return [
      {
        serviceId: transcriptDef.id,
        code: transcriptDef.code,
        title: transcriptDef.title,
        unitPricePesewas: transcriptDef.basePricePesewas,
        quantity: 1,
        subtotalPesewas: transcriptDef.basePricePesewas,
        options: { academicLevel: "Bachelor's Degree" }
      }
    ];
  });

  // Reason
  const [reason, setReason] = useState<OrderReason>(initialReason || 'For Employment');

  // Recipient Details
  const [recipient, setRecipient] = useState<RecipientDetails>(
    initialRecipient || { type: 'SELF' }
  );

  // Delivery Details
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>(
    initialDelivery?.method || 'SELF_PICKUP'
  );
  const [deliveryData, setDeliveryData] = useState<DeliveryDetails>(
    initialDelivery || {
      method: 'SELF_PICKUP',
      feePesewas: deliveryFees.SELF_PICKUP
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculations
  const { totalPesewas } = calculateOrderTotals(
    selectedItems.map(item => ({ unitPricePesewas: item.unitPricePesewas, quantity: item.quantity })),
    deliveryFees[deliveryMethod]
  );

  // Toggle Service Selection
  const handleToggleService = (serviceId: string) => {
    const isSelected = selectedItems.some(i => i.serviceId === serviceId);
    if (isSelected) {
      // Deselect: Remove from array
      setSelectedItems(selectedItems.filter(i => i.serviceId !== serviceId));
    } else {
      // Select: Initialize with quantity 1
      const def = servicesCatalogue.find(s => s.id === serviceId);
      if (def) {
        const newItem: SelectedServiceItem = {
          serviceId: def.id,
          code: def.code,
          title: def.title,
          unitPricePesewas: def.basePricePesewas,
          quantity: 1,
          subtotalPesewas: def.basePricePesewas,
          options: {
            academicLevel: def.requiresLevel ? "Bachelor's Degree" : undefined,
            declaredPurpose: def.requiresPurpose ? "Internship / Employment" : undefined
          }
        };
        setSelectedItems([...selectedItems, newItem]);
      }
    }
  };

  // Update Item Quantity
  const handleQuantityChange = (serviceId: string, newQty: number) => {
    setSelectedItems(prev =>
      prev.map(item => {
        if (item.serviceId === serviceId) {
          const qty = Math.max(1, newQty);
          return {
            ...item,
            quantity: qty,
            subtotalPesewas: item.unitPricePesewas * qty
          };
        }
        return item;
      })
    );
  };

  // Update Item Options
  const handleOptionChange = (serviceId: string, optionsPatch: Partial<SelectedServiceItem['options']>) => {
    setSelectedItems(prev =>
      prev.map(item => {
        if (item.serviceId === serviceId) {
          return {
            ...item,
            options: {
              ...item.options,
              ...optionsPatch
            }
          };
        }
        return item;
      })
    );
  };

  // Handle Delivery Method Change
  const handleDeliveryMethodChange = (newMethod: DeliveryMethod) => {
    setDeliveryMethod(newMethod);
    setDeliveryData(prev => ({
      ...prev,
      method: newMethod,
      feePesewas: deliveryFees[newMethod]
    }));
  };

  // Validation
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (selectedItems.length === 0) {
      newErrors.services = 'Please select at least one academic service to proceed';
    }

    if (recipient.type === 'ORGANIZATION') {
      if (!recipient.organizationName?.trim()) {
        newErrors.organizationName = 'Organization name is required';
      }
    } else if (recipient.type === 'OTHER') {
      if (!recipient.otherLegalName?.trim()) {
        newErrors.otherLegalName = 'Recipient legal name is required';
      }
    }

    if (deliveryMethod === 'PROXY_PICKUP') {
      if (!deliveryData.proxyName?.trim()) {
        newErrors.proxyName = 'Authorized proxy legal name is required';
      }
    } else if (deliveryMethod === 'EMAIL') {
      if (!deliveryData.recipientEmail?.trim()) {
        newErrors.recipientEmail = 'Destination email is required';
      }
    } else if (deliveryMethod === 'DOMESTIC_COURIER') {
      if (!deliveryData.recipientName?.trim()) newErrors.courierName = 'Recipient name is required';
      if (!deliveryData.recipientPhone?.trim()) newErrors.courierPhone = 'Recipient phone is required';
      if (!deliveryData.addressLine?.trim()) newErrors.courierAddress = 'Delivery address is required';
      if (!deliveryData.city?.trim()) newErrors.courierCity = 'City / Town is required';
    } else if (deliveryMethod === 'INTERNATIONAL_COURIER') {
      if (!deliveryData.recipientName?.trim()) newErrors.courierName = 'Recipient name is required';
      if (!deliveryData.recipientPhone?.trim()) newErrors.courierPhone = 'Recipient phone is required';
      if (!deliveryData.destinationCountry?.trim()) newErrors.courierCountry = 'Destination country is required';
      if (!deliveryData.addressLine?.trim()) newErrors.courierAddress = 'Street address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onContinue({
        items: selectedItems,
        reason,
        recipient,
        delivery: {
          ...deliveryData,
          method: deliveryMethod,
          feePesewas: deliveryFees[deliveryMethod]
        }
      });
    } else {
      window.scrollTo({ top: 150, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 pb-32">
      {/* Header Banner */}
      <section className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 text-secondary text-label-sm font-label-sm font-bold uppercase tracking-wider">
          <span className="material-symbols-outlined text-sm">receipt_long</span>
          <span>Official Service Selection &amp; Logistics</span>
        </div>
        <h1 className="text-headline-sm sm:text-headline-md font-serif text-primary tracking-tight font-bold">
          Step 2: Services, Quantities &amp; Delivery
        </h1>
        <p className="text-body-md font-body-md text-on-surface-variant">
          Select all academic documents you require. Each document maintains its own quantity counter and fulfillment workflow.
        </p>
      </section>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: SERVICE CATALOGUE CARDS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2">
            <div>
              <h2 className="text-title-md font-title-md text-primary font-bold">
                Academic Service Items
              </h2>
              <p className="text-body-sm font-body-sm text-outline">
                Check each service you want to add to this order
              </p>
            </div>
            <span className="text-label-sm font-label-sm text-secondary font-bold">
              {selectedItems.length} selected
            </span>
          </div>

          {errors.services && (
            <div className="p-3 bg-error-container/60 border border-error text-on-error-container rounded-lg text-body-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              <span>{errors.services}</span>
            </div>
          )}

          <div className="space-y-3">
            {servicesCatalogue.map((service) => {
              const selectedItem = selectedItems.find(i => i.serviceId === service.id);
              const isSelected = !!selectedItem;

              return (
                <article
                  key={service.id}
                  className={`rounded-xl p-4 sm:p-5 transition-all relative overflow-hidden border-2 ${
                    isSelected
                      ? 'bg-surface-container-lowest border-primary shadow-sm'
                      : 'bg-surface-container-lowest/80 border-outline-variant/60 hover:border-outline opacity-90 hover:opacity-100'
                  }`}
                >
                  {/* Selected Tag Corner */}
                  {isSelected && (
                    <div className="absolute top-0 right-0 w-14 h-14 overflow-hidden pointer-events-none">
                      <div className="bg-primary text-white text-[9px] font-bold text-center py-0.5 absolute w-24 rotate-45 top-2.5 -right-6 uppercase shadow-xs">
                        Selected
                      </div>
                    </div>
                  )}

                  {/* Header Row: Checkbox & Info */}
                  <div className="flex items-start gap-3.5">
                    <input
                      type="checkbox"
                      id={`srv-${service.id}`}
                      checked={isSelected}
                      onChange={() => handleToggleService(service.id)}
                      className="mt-1 h-5 w-5 rounded border-outline text-primary focus:ring-secondary cursor-pointer shrink-0"
                    />

                    <div className="flex-1 pr-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <label
                          htmlFor={`srv-${service.id}`}
                          className="text-title-sm font-title-sm text-on-surface font-semibold cursor-pointer select-none hover:text-primary transition-colors"
                        >
                          {service.title}
                        </label>
                        <span className="text-title-sm font-title-sm text-primary font-bold">
                          {formatPesewas(service.basePricePesewas)} <span className="text-body-sm font-normal text-outline">/ copy</span>
                        </span>
                      </div>

                      <p className="text-body-sm font-body-sm text-on-surface-variant mt-1">
                        {service.description}
                      </p>

                      {service.badgeText && (
                        <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <span className="material-symbols-outlined text-[13px]">verified</span>
                          {service.badgeText}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Config Cluster (Revealed when Selected) */}
                  {isSelected && (
                    <div className="mt-4 pt-4 border-t border-outline-variant/60 bg-surface-container-low p-3.5 rounded-lg space-y-4 animate-fade-in">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Service-Specific Fields */}
                        {service.requiresLevel && (
                          <div>
                            <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1 font-medium">
                              Academic Level
                            </label>
                            <select
                              value={selectedItem.options?.academicLevel || "Bachelor's Degree"}
                              onChange={e => handleOptionChange(service.id, { academicLevel: e.target.value as any })}
                              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm px-3 py-2 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary"
                            >
                              <option value="Bachelor's Degree">Bachelor's Degree</option>
                              <option value="Master's Degree">Master's Degree</option>
                              <option value="Diploma">Diploma</option>
                            </select>
                          </div>
                        )}

                        {service.requiresPurpose && (
                          <div>
                            <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1 font-medium">
                              Declared Purpose
                            </label>
                            <select
                              value={selectedItem.options?.declaredPurpose || "Internship / Employment"}
                              onChange={e => handleOptionChange(service.id, { declaredPurpose: e.target.value as any })}
                              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm px-3 py-2 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary"
                            >
                              <option value="Visa / Embassy Application">Visa / Embassy Application</option>
                              <option value="Internship / Employment">Internship / Employment</option>
                              <option value="Banking & Financial Account">Banking &amp; Financial Account</option>
                              <option value="National Service Scheme (NSS)">National Service Scheme (NSS)</option>
                            </select>
                          </div>
                        )}

                        {service.requiresLecturer && (
                          <div className="sm:col-span-2">
                            <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1 font-medium">
                              Designated Dean or Lecturer
                            </label>
                            <input
                              type="text"
                              value={selectedItem.options?.targetLecturer || ''}
                              onChange={e => handleOptionChange(service.id, { targetLecturer: e.target.value })}
                              placeholder="e.g. Prof. Osei-Tutu, Dean of Computing"
                              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm px-3 py-2 text-on-surface focus:border-primary"
                            />
                          </div>
                        )}

                        {service.requiresDocument && (
                          <div className="sm:col-span-2">
                            <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1 font-medium">
                              Upload Certificate Scan (PDF / JPG) <span className="text-primary font-bold">*</span>
                            </label>
                            <div className="flex items-center gap-3">
                              <input
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg"
                                onChange={e => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleOptionChange(service.id, { uploadedFileName: file.name });
                                  }
                                }}
                                className="text-body-sm text-on-surface-variant file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-label-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-container cursor-pointer"
                              />
                              {selectedItem.options?.uploadedFileName && (
                                <span className="text-label-sm text-secondary font-medium">
                                  ✓ Attached: {selectedItem.options.uploadedFileName}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Copy Counter & Subtotal */}
                        <div className="sm:col-span-2 pt-2 border-t border-outline-variant/50 flex flex-wrap items-center justify-between gap-3">
                          <CopyCounter
                            quantity={selectedItem.quantity}
                            onChange={(newQty) => handleQuantityChange(service.id, newQty)}
                            label="Copies for this document:"
                          />

                          <div className="text-right">
                            <span className="block text-[11px] text-outline uppercase font-semibold">
                              Item Subtotal
                            </span>
                            <span className="text-title-md font-title-md text-primary font-bold font-mono">
                              {formatPesewas(selectedItem.subtotalPesewas)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: REASON FOR REQUEST */}
        <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-xl shadow-sm border border-outline-variant/60 space-y-4">
          <div className="border-b border-outline-variant/50 pb-2.5">
            <h2 className="text-title-md font-title-md text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">help_center</span>
              Reason for Ordering
            </h2>
            <p className="text-body-sm font-body-sm text-outline mt-0.5">
              Select the primary justification for this academic records request
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              'For Myself',
              'For Admission',
              'For Employment',
              'For Scholarship',
              'For an Organization / Institution',
              'For Some Other Reasons'
            ].map((r) => (
              <label
                key={r}
                className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-all ${
                  reason === r
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-outline-variant hover:bg-surface-container-low'
                }`}
              >
                <input
                  type="radio"
                  name="orderReason"
                  value={r}
                  checked={reason === r}
                  onChange={() => setReason(r as OrderReason)}
                  className="text-primary focus:ring-secondary h-4 w-4"
                />
                <span className="text-body-sm font-body-sm font-medium text-on-surface">
                  {r}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* SECTION 3: RECIPIENT SPECIFICATION */}
        <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-xl shadow-sm border border-outline-variant/60 space-y-4">
          <div className="border-b border-outline-variant/50 pb-2.5">
            <h2 className="text-title-md font-title-md text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">send</span>
              Recipient Configuration
            </h2>
            <p className="text-body-sm font-body-sm text-outline mt-0.5">
              Indicate whether documents are addressed to yourself or a third-party organization
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { type: 'SELF' as const, label: 'Send to Myself', desc: 'Directly issued to student' },
              { type: 'ORGANIZATION' as const, label: 'Send to an Organization', desc: 'WES, Embassy, Employer' },
              { type: 'OTHER' as const, label: 'Other Recipient', desc: 'Family or authorized sponsor' }
            ].map((opt) => (
              <label
                key={opt.type}
                className={`p-3.5 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                  recipient.type === opt.type
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-outline-variant hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="radio"
                    name="recipientType"
                    checked={recipient.type === opt.type}
                    onChange={() => setRecipient({ ...recipient, type: opt.type })}
                    className="text-primary focus:ring-secondary h-4 w-4"
                  />
                  <span className="text-title-sm font-title-sm text-on-surface font-semibold">
                    {opt.label}
                  </span>
                </div>
                <span className="text-body-sm font-body-sm text-outline pl-6">
                  {opt.desc}
                </span>
              </label>
            ))}
          </div>

          {/* Conditional Recipient Fields */}
          {recipient.type === 'ORGANIZATION' && (
            <div className="p-4 bg-surface-container-low rounded-lg space-y-3 border border-outline-variant animate-fade-in">
              <div>
                <label className="block text-label-sm font-label-sm text-on-surface mb-1">
                  Organization / Institution Name <span className="text-primary font-bold">*</span>
                </label>
                <input
                  type="text"
                  value={recipient.organizationName || ''}
                  onChange={e => setRecipient({ ...recipient, organizationName: e.target.value })}
                  placeholder="e.g. World Education Services (WES), Ghana Audit Service"
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-primary"
                />
                {errors.organizationName && (
                  <p className="text-body-sm text-error mt-1">{errors.organizationName}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-label-sm font-label-sm text-on-surface mb-1">
                    Attention Person / Office
                  </label>
                  <input
                    type="text"
                    value={recipient.attentionPerson || ''}
                    onChange={e => setRecipient({ ...recipient, attentionPerson: e.target.value })}
                    placeholder="e.g. Director of Admissions"
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-label-sm font-label-sm text-on-surface mb-1">
                    Reference / WES Reference Number
                  </label>
                  <input
                    type="text"
                    value={recipient.referenceNumber || ''}
                    onChange={e => setRecipient({ ...recipient, referenceNumber: e.target.value })}
                    placeholder="e.g. WES-6543210"
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-body-md font-mono focus:border-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {recipient.type === 'OTHER' && (
            <div className="p-4 bg-surface-container-low rounded-lg space-y-3 border border-outline-variant animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-label-sm font-label-sm text-on-surface mb-1">
                    Recipient Legal Name <span className="text-primary font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={recipient.otherLegalName || ''}
                    onChange={e => setRecipient({ ...recipient, otherLegalName: e.target.value })}
                    placeholder="Full legal name"
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-primary"
                  />
                  {errors.otherLegalName && (
                    <p className="text-body-sm text-error mt-1">{errors.otherLegalName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-label-sm font-label-sm text-on-surface mb-1">
                    Relationship to Applicant
                  </label>
                  <input
                    type="text"
                    value={recipient.otherRelationship || ''}
                    onChange={e => setRecipient({ ...recipient, otherRelationship: e.target.value })}
                    placeholder="e.g. Sibling, Legal Guardian"
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-primary"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 4: DELIVERY METHODS */}
        <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-xl shadow-sm border border-outline-variant/60 space-y-4">
          <div className="border-b border-outline-variant/50 pb-2.5">
            <h2 className="text-title-md font-title-md text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">local_shipping</span>
              Delivery Method
            </h2>
            <p className="text-body-sm font-body-sm text-outline mt-0.5">
              Choose how you wish to receive or dispatch your certified documents
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                method: 'SELF_PICKUP' as const,
                title: 'Self-Pickup (Fiapre Campus)',
                desc: PICKUP_LOCATION_DEFAULT,
                fee: deliveryFees.SELF_PICKUP,
                icon: 'storefront'
              },
              {
                method: 'PROXY_PICKUP' as const,
                title: 'Authorized Proxy Pickup',
                desc: 'Nominate a trusted representative to collect in person at Fiapre Campus',
                fee: deliveryFees.PROXY_PICKUP,
                icon: 'group'
              },
              {
                method: 'EMAIL' as const,
                title: 'Electronic Official PDF (Email Delivery)',
                desc: 'Digital certified copy transmitted directly to verified recipient email',
                fee: deliveryFees.EMAIL,
                icon: 'mail'
              },
              {
                method: 'DOMESTIC_COURIER' as const,
                title: 'Ghana Post EMS (Domestic Courier)',
                desc: 'Secure nationwide delivery across all 16 regions of Ghana',
                fee: deliveryFees.DOMESTIC_COURIER,
                icon: 'local_post_office'
              },
              {
                method: 'INTERNATIONAL_COURIER' as const,
                title: 'DHL Express (International Courier)',
                desc: 'Tracked express courier dispatch worldwide to foreign institutions and employers',
                fee: deliveryFees.INTERNATIONAL_COURIER,
                icon: 'flight_takeoff'
              }
            ].map((opt) => (
              <label
                key={opt.method}
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  deliveryMethod === opt.method
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-outline-variant hover:bg-surface-container-low'
                }`}
              >
                <input
                  type="radio"
                  name="deliveryMethod"
                  value={opt.method}
                  checked={deliveryMethod === opt.method}
                  onChange={() => handleDeliveryMethodChange(opt.method)}
                  className="mt-1 text-primary focus:ring-secondary h-4 w-4"
                />
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-title-sm font-title-sm text-on-surface font-semibold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px] text-secondary">
                        {opt.icon}
                      </span>
                      {opt.title}
                    </span>
                    <span className="text-title-sm font-title-sm text-primary font-bold">
                      {opt.fee === 0 ? 'FREE' : formatPesewas(opt.fee)}
                    </span>
                  </div>
                  <p className="text-body-sm font-body-sm text-on-surface-variant mt-0.5">
                    {opt.desc}
                  </p>
                </div>
              </label>
            ))}
          </div>

          {/* Conditional Delivery Sub-Forms */}
          {deliveryMethod === 'PROXY_PICKUP' && (
            <div className="p-4 bg-surface-container-low rounded-lg space-y-3 border border-outline-variant animate-fade-in">
              <h3 className="text-title-sm text-primary font-semibold">Authorized Representative Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-label-sm font-label-sm text-on-surface mb-1">
                    Proxy Full Legal Name <span className="text-primary font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={deliveryData.proxyName || ''}
                    onChange={e => setDeliveryData({ ...deliveryData, proxyName: e.target.value })}
                    placeholder="Must match their national ID card"
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-primary"
                  />
                  {errors.proxyName && <p className="text-body-sm text-error mt-1">{errors.proxyName}</p>}
                </div>
                <div>
                  <label className="block text-label-sm font-label-sm text-on-surface mb-1">
                    Proxy Ghana Card / National ID <span className="text-outline text-label-sm">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={deliveryData.proxyGhanaCard || ''}
                    onChange={e => setDeliveryData({ ...deliveryData, proxyGhanaCard: e.target.value })}
                    placeholder="e.g. GHA-000000000-0"
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-body-md font-mono focus:border-primary"
                  />
                  <p className="text-[11px] text-outline mt-1">Data minimized in accordance with university policy</p>
                </div>
              </div>
            </div>
          )}

          {deliveryMethod === 'EMAIL' && (
            <div className="p-4 bg-surface-container-low rounded-lg space-y-3 border border-outline-variant animate-fade-in">
              <h3 className="text-title-sm text-primary font-semibold">Destination Email</h3>
              <div>
                <label className="block text-label-sm font-label-sm text-on-surface mb-1">
                  Recipient Email Address <span className="text-primary font-bold">*</span>
                </label>
                <input
                  type="email"
                  value={deliveryData.recipientEmail || ''}
                  onChange={e => setDeliveryData({ ...deliveryData, recipientEmail: e.target.value })}
                  placeholder="e.g. admissions@oxford.edu or hr@company.com"
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-primary"
                />
                {errors.recipientEmail && <p className="text-body-sm text-error mt-1">{errors.recipientEmail}</p>}
              </div>
            </div>
          )}

          {(deliveryMethod === 'DOMESTIC_COURIER' || deliveryMethod === 'INTERNATIONAL_COURIER') && (
            <div className="p-4 bg-surface-container-low rounded-lg space-y-3 border border-outline-variant animate-fade-in">
              <h3 className="text-title-sm text-primary font-semibold">
                {deliveryMethod === 'DOMESTIC_COURIER' ? 'Ghana Post EMS Destination' : 'DHL International Destination'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-label-sm font-label-sm text-on-surface mb-1">
                    Contact Person Name <span className="text-primary font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={deliveryData.recipientName || ''}
                    onChange={e => setDeliveryData({ ...deliveryData, recipientName: e.target.value })}
                    placeholder="Recipient's full name"
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-primary"
                  />
                  {errors.courierName && <p className="text-body-sm text-error mt-1">{errors.courierName}</p>}
                </div>
                <div>
                  <label className="block text-label-sm font-label-sm text-on-surface mb-1">
                    Contact Phone Number <span className="text-primary font-bold">*</span>
                  </label>
                  <input
                    type="tel"
                    value={deliveryData.recipientPhone || ''}
                    onChange={e => setDeliveryData({ ...deliveryData, recipientPhone: e.target.value })}
                    placeholder="Courier dispatch phone"
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-primary"
                  />
                  {errors.courierPhone && <p className="text-body-sm text-error mt-1">{errors.courierPhone}</p>}
                </div>
                {deliveryMethod === 'INTERNATIONAL_COURIER' && (
                  <div className="sm:col-span-2">
                    <label className="block text-label-sm font-label-sm text-on-surface mb-1">
                      Destination Country <span className="text-primary font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      value={deliveryData.destinationCountry || ''}
                      onChange={e => setDeliveryData({ ...deliveryData, destinationCountry: e.target.value })}
                      placeholder="e.g. United Kingdom, United States, Canada"
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-primary"
                    />
                    {errors.courierCountry && <p className="text-body-sm text-error mt-1">{errors.courierCountry}</p>}
                  </div>
                )}
                <div className="sm:col-span-2">
                  <label className="block text-label-sm font-label-sm text-on-surface mb-1">
                    Delivery Address <span className="text-primary font-bold">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={deliveryData.addressLine || ''}
                    onChange={e => setDeliveryData({ ...deliveryData, addressLine: e.target.value })}
                    placeholder="House/office address, street name"
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-primary"
                  />
                  {errors.courierAddress && <p className="text-body-sm text-error mt-1">{errors.courierAddress}</p>}
                </div>
                <div>
                  <label className="block text-label-sm font-label-sm text-on-surface mb-1">
                    City / Town
                  </label>
                  <input
                    type="text"
                    value={deliveryData.city || ''}
                    onChange={e => setDeliveryData({ ...deliveryData, city: e.target.value })}
                    placeholder="e.g. Accra, Kumasi, London"
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-label-sm font-label-sm text-on-surface mb-1">
                    {deliveryMethod === 'DOMESTIC_COURIER' ? 'GhanaPost GPS Address' : 'Postal Code'}
                  </label>
                  <input
                    type="text"
                    value={deliveryData.gpsAddress || ''}
                    onChange={e => setDeliveryData({ ...deliveryData, gpsAddress: e.target.value })}
                    placeholder={deliveryMethod === 'DOMESTIC_COURIER' ? 'e.g. GA-183-9022' : 'e.g. SW1A 1AA'}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-body-md font-mono focus:border-primary"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* STICKY BOTTOM DOCK: RUNNING ORDER TOTAL & ACTIONS */}
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-surface-container-lowest/98 backdrop-blur-md border-t border-outline-variant/80 p-4 shadow-xl">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-label-sm font-label-sm text-outline block">
                Calculated Running Total:
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-headline-sm font-title-lg text-primary font-bold font-mono">
                  {formatPesewas(totalPesewas)}
                </span>
                <span className="text-body-sm text-outline">
                  ({selectedItems.reduce((s, i) => s + i.quantity, 0)} items)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors text-label-md font-label-md font-medium"
              >
                ← Back
              </button>

              <button
                type="submit"
                disabled={selectedItems.length === 0}
                className="flex-1 sm:flex-initial px-8 py-2.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed font-title-sm font-semibold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Review Order</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
