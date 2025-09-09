import React, { createContext, useContext, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

interface AccordionContextValue {
  openItems: string[];
  toggleItem: (itemId: string) => void;
  type?: 'single' | 'multiple';
}

const AccordionContext = createContext<AccordionContextValue | undefined>(undefined);

interface AccordionProps {
  children: React.ReactNode;
  type?: 'single' | 'multiple';
  className?: string;
}

const Accordion: React.FC<AccordionProps> = ({ children, type = 'single', className }) => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (itemId: string) => {
    if (type === 'single') {
      setOpenItems(prev => prev.includes(itemId) ? [] : [itemId]);
    } else {
      setOpenItems(prev => 
        prev.includes(itemId) 
          ? prev.filter(id => id !== itemId)
          : [...prev, itemId]
      );
    }
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, type }}>
      <div className={cn("space-y-2", className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

interface AccordionItemProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ children, value, className }) => {
  return (
    <div className={cn("border rounded-lg", className)} data-value={value}>
      {children}
    </div>
  );
};

interface AccordionTriggerProps {
  children: React.ReactNode;
  className?: string;
}

const AccordionTrigger: React.FC<AccordionTriggerProps> = ({ children, className }) => {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('AccordionTrigger must be used within Accordion');

  const { openItems, toggleItem } = context;
  const item = document.querySelector('[data-value]')?.getAttribute('data-value') || '';
  const isOpen = openItems.includes(item);

  return (
    <button
      className={cn(
        "flex w-full items-center justify-between p-4 font-medium transition-all hover:bg-gray-50",
        className
      )}
      onClick={() => toggleItem(item)}
    >
      {children}
      <ChevronDown
        className={cn(
          "h-4 w-4 transition-transform duration-200",
          isOpen && "rotate-180"
        )}
      />
    </button>
  );
};

interface AccordionContentProps {
  children: React.ReactNode;
  className?: string;
}

const AccordionContent: React.FC<AccordionContentProps> = ({ children, className }) => {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('AccordionContent must be used within Accordion');

  const { openItems } = context;
  const item = document.querySelector('[data-value]')?.getAttribute('data-value') || '';
  const isOpen = openItems.includes(item);

  if (!isOpen) return null;

  return (
    <div className={cn("px-4 pb-4", className)}>
      {children}
    </div>
  );
};

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };