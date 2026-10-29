import React from 'react';

export interface WizardStepperProps {
  currentStep: 1 | 2 | 3;
  onStepClick?: (step: 1 | 2 | 3) => void;
  maxAccessibleStep?: number;
}

export const WizardStepper: React.FC<WizardStepperProps> = ({
  currentStep,
  onStepClick,
  maxAccessibleStep = 3
}) => {
  const steps = [
    { number: 1 as const, title: 'Student Info', short: 'Info' },
    { number: 2 as const, title: 'Services & Delivery', short: 'Services' },
    { number: 3 as const, title: 'Review & Pay', short: 'Review' }
  ];

  return (
    <section 
      aria-label="Application Progress" 
      className="bg-surface-container-lowest rounded-xl p-4 mb-6 shadow-sm border border-outline-variant/60"
    >
      <div className="flex items-center justify-between relative max-w-lg mx-auto">
        {/* Background Connecting Track Lines */}
        <div className="absolute left-6 right-6 top-4 h-[2px] bg-surface-container -z-0" />
        <div 
          className="absolute left-6 top-4 h-[2px] bg-primary transition-all duration-300 -z-0"
          style={{
            width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%'
          }}
        />

        {steps.map((step) => {
          const isCompleted = step.number < currentStep;
          const isActive = step.number === currentStep;
          const isPending = step.number > currentStep;
          const isClickable = onStepClick && step.number <= maxAccessibleStep;

          return (
            <div 
              key={step.number} 
              className={`flex flex-col items-center relative z-10 select-none ${isClickable ? 'cursor-pointer' : ''}`}
              onClick={() => isClickable && onStepClick(step.number)}
            >
              {/* Step Node */}
              {isCompleted ? (
                <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-title-sm shadow-sm transition-all">
                  <span className="material-symbols-outlined text-[16px]">check</span>
                </div>
              ) : isActive ? (
                <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-title-sm font-bold ring-2 ring-offset-2 ring-secondary shadow-md transition-all scale-105">
                  {step.number}
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center font-title-sm transition-all">
                  {step.number}
                </div>
              )}

              {/* Step Label */}
              <span className={`text-label-sm font-label-sm mt-1.5 text-center ${
                isActive 
                  ? 'font-bold text-primary' 
                  : isCompleted 
                  ? 'font-medium text-on-surface' 
                  : 'text-on-surface-variant font-medium'
              }`}>
                {step.title}
              </span>

              {/* Status Badge */}
              <span className={`text-[9px] uppercase tracking-wider font-semibold ${
                isActive 
                  ? 'text-secondary font-bold' 
                  : isCompleted 
                  ? 'text-emerald-700' 
                  : 'text-outline font-medium'
              }`}>
                {isActive ? 'Active' : isCompleted ? 'Completed' : 'Pending'}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
