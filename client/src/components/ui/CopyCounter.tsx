import React from 'react';

interface CopyCounterProps {
  quantity: number;
  min?: number;
  max?: number;
  onChange: (newQuantity: number) => void;
  label?: string;
}

export const CopyCounter: React.FC<CopyCounterProps> = ({
  quantity,
  min = 1,
  max = 99,
  onChange,
  label = 'Number of Copies'
}) => {
  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity > min) {
      onChange(quantity - 1);
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {label && (
        <span className="text-label-sm font-label-sm text-on-surface-variant font-medium">
          {label}
        </span>
      )}
      <div 
        className="flex items-center border border-outline-variant bg-surface-container-lowest rounded-lg overflow-hidden shadow-xs"
        role="group"
        aria-label={label}
      >
        <button
          type="button"
          onClick={handleDecrement}
          disabled={quantity <= min}
          aria-label="Decrease quantity"
          className="w-9 h-8 flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-primary active:bg-surface-container-high disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-base font-bold"
        >
          -
        </button>
        <span 
          className="w-9 text-center text-title-sm font-title-sm text-on-surface font-mono font-semibold select-none"
          aria-live="polite"
        >
          {quantity}
        </span>
        <button
          type="button"
          onClick={handleIncrement}
          disabled={quantity >= max}
          aria-label="Increase quantity"
          className="w-9 h-8 flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-primary active:bg-surface-container-high disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-base font-bold"
        >
          +
        </button>
      </div>
    </div>
  );
};
