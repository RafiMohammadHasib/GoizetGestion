'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SelectOption {
  value: string;
  label: string;
  sublabel?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  align?: 'left' | 'right';
  icon?: React.ComponentType<{ className?: string }>;
}

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = 'Select option...',
  className = '',
  disabled = false,
  align = 'left',
  icon: LeadingIcon,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropDirection, setDropDirection] = useState<'down' | 'up'>('down');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const calculateDirection = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const estimatedMenuHeight = Math.min(options.length * 44 + 20, 270);

    // If space below is not enough and space above is larger, flip upward
    if (spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow) {
      setDropDirection('up');
    } else {
      setDropDirection('down');
    }
  };

  const toggleDropdown = () => {
    if (!isOpen) {
      calculateDirection();
    }
    setIsOpen((prev) => !prev);
  };

  // Close dropdown on outside click or Esc key, update position on scroll/resize
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    function handleReposition() {
      if (isOpen) {
        calculateDirection();
      }
    }

    if (isOpen) {
      calculateDirection();
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      window.addEventListener('resize', handleReposition);
      window.addEventListener('scroll', handleReposition, true);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, true);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={toggleDropdown}
        className={`w-full h-[42px] px-3.5 py-2.5 bg-white hover:bg-[#FAF9F6] border rounded-xl text-xs font-medium text-[#171512] transition-all duration-200 flex items-center justify-between gap-2 shadow-xs group ${
          isOpen
            ? 'border-[#748C8C] ring-2 ring-[#748C8C]/20 shadow-md'
            : 'border-[#171512]/15 hover:border-[#748C8C]/50'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 truncate">
          {LeadingIcon && (
            <LeadingIcon className="w-3.5 h-3.5 text-[#748C8C] shrink-0" />
          )}
          <span className={`truncate text-xs ${selectedOption ? 'text-[#171512] font-semibold' : 'text-[#6F6255]'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-[#748C8C] transition-transform duration-300 shrink-0 ${
            isOpen ? 'rotate-180 text-[#4F6565]' : 'group-hover:translate-y-0.5'
          }`}
        />
      </button>

      {/* Floating Animated Dropdown Menu with Smart Up/Down Direction */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: dropDirection === 'up' ? 8 : -8,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: dropDirection === 'up' ? 8 : -8,
              scale: 0.98,
            }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute z-50 w-full min-w-[200px] max-h-64 overflow-y-auto rounded-2xl bg-white/95 backdrop-blur-xl border border-[#748C8C]/25 shadow-2xl p-1.5 space-y-0.5 custom-scrollbar ${
              dropDirection === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'
            } ${align === 'right' ? 'right-0' : 'left-0'}`}
            role="listbox"
          >
            {options.map((option) => {
              const isSelected = option.value === value;
              const OptionIcon = option.icon;

              return (
                <button
                  type="button"
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option.value)}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 flex items-center justify-between text-left group ${
                    isSelected
                      ? 'bg-brand-gradient text-white font-semibold shadow-xs'
                      : 'text-[#2C2723] hover:bg-[#748C8C]/10 hover:text-[#4F6565]'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    {OptionIcon && (
                      <OptionIcon
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isSelected ? 'text-white' : 'text-[#748C8C] group-hover:scale-110 transition-transform'
                        }`}
                      />
                    )}
                    <span className="truncate">{option.label}</span>
                    {option.sublabel && (
                      <span className={`text-[10px] ml-1 ${isSelected ? 'text-white/80' : 'text-[#6F6255]'}`}>
                        ({option.sublabel})
                      </span>
                    )}
                  </div>

                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-white shrink-0 ml-2 animate-in fade-in" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
