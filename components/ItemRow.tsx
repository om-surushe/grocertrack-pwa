import React, { useState, useEffect } from 'react';
import { ShopItem, UnitType } from '../types';
import { TrashIcon, CalculatorIcon } from './Icons';

interface ItemRowProps {
  item: ShopItem;
  onUpdate: (id: string, updates: Partial<ShopItem>) => void;
  onDelete: (id: string) => void;
}

const ItemRow: React.FC<ItemRowProps> = ({ item, onUpdate, onDelete }) => {
  const [name, setName] = useState(item.name);
  const [unitType, setUnitType] = useState<UnitType>(item.unitType);
  
  const [price, setPrice] = useState(item.pricePerUnit);
  const [amount, setAmount] = useState(item.amount);
  const [total, setTotal] = useState(item.totalPaid);

  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setName(item.name);
    setUnitType(item.unitType);
    setPrice(item.pricePerUnit);
    setAmount(item.amount);
    setTotal(item.totalPaid);
  }, [item.id, item.name, item.unitType, item.pricePerUnit, item.amount, item.totalPaid]);

  const fmt = (num: number) => {
    if (isNaN(num) || !isFinite(num)) return "";
    return parseFloat(num.toFixed(3)).toString();
  };

  const handleManualCalculate = () => {
    const p = parseFloat(price);
    const a = parseFloat(amount);
    const t = parseFloat(total);

    const isP = !isNaN(p) && isFinite(p) && p > 0;
    const isA = !isNaN(a) && isFinite(a) && a > 0;
    const isT = !isNaN(t) && isFinite(t) && t > 0;

    // Validation: Need at least 2 non-zero values
    const validCount = (isP ? 1 : 0) + (isA ? 1 : 0) + (isT ? 1 : 0);

    if (validCount < 2) {
      setHasError(true);
      // Haptic feedback for mobile
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(200);
      }
      return;
    }

    setHasError(false);
    const updates: Partial<ShopItem> = {};

    // Logic: Determine what to calculate based on what is missing or present
    if (isP && isA && !isT) {
       // Price & Amount -> Calc Total
       const newTotal = fmt(p * a);
       setTotal(newTotal);
       updates.totalPaid = newTotal;
    } else if (isT && isP && !isA) {
       // Total & Price -> Calc Amount
       const newAmount = fmt(t / p);
       setAmount(newAmount);
       updates.amount = newAmount;
    } else if (isT && isA && !isP) {
       // Total & Amount -> Calc Price
       const newPrice = fmt(t / a);
       setPrice(newPrice);
       updates.pricePerUnit = newPrice;
    } else {
       // Fallback / Recalculation Case:
       // If all 3 are present, or some specific combo that fell through:
       // Standard behavior is to re-calculate Total if P and A are present.
       if (isP && isA) {
         const newTotal = fmt(p * a);
         setTotal(newTotal);
         updates.totalPaid = newTotal;
       } else if (isT && isP) {
          const newAmount = fmt(t / p);
          setAmount(newAmount);
          updates.amount = newAmount;
       }
    }

    onUpdate(item.id, updates);
  };

  const handleInputChange = (field: 'price'|'amount'|'total', val: string) => {
    // Prevent negative numbers
    if (val.startsWith('-')) return;
    
    setHasError(false); // Clear error immediately on user interaction

    const updates: Partial<ShopItem> = {};
    if (field === 'price') {
      setPrice(val);
      updates.pricePerUnit = val;
    } else if (field === 'amount') {
      setAmount(val);
      updates.amount = val;
    } else {
      setTotal(val);
      updates.totalPaid = val;
    }
    onUpdate(item.id, updates);
  };

  const unitLabels = {
    'kg': 'kg',
    'liter': 'L',
    'quantity': 'pcs'
  };

  const inputBaseClass = "w-full rounded-lg px-2 py-2 text-sm outline-none transition-all";
  const inputNormalClass = "bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/50 focus:border-primary dark:text-white";
  const inputErrorClass = "bg-red-50 dark:bg-red-900/20 border border-red-400 focus:ring-2 focus:ring-red-500 text-gray-900 dark:text-white";
  
  const currentInputClass = `${inputBaseClass} ${hasError ? inputErrorClass : inputNormalClass}`;

  return (
    <div className={`p-4 mb-3 rounded-xl border shadow-sm transition-all ${
      item.isCompleted 
        ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 opacity-70' 
        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    }`}>
      
      {/* Header Row: Name & Unit Toggle */}
      <div className="flex justify-between items-start mb-3 gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            onUpdate(item.id, { name: e.target.value });
          }}
          placeholder="Item name (e.g. Potato)"
          className="flex-1 bg-transparent font-medium text-lg placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none text-gray-900 dark:text-gray-100"
        />
        
        <div className="flex bg-gray-100 dark:bg-gray-900 rounded-lg p-0.5 shrink-0">
          {(['kg', 'liter', 'quantity'] as UnitType[]).map((u) => (
            <button
              key={u}
              onClick={() => {
                setUnitType(u);
                onUpdate(item.id, { unitType: u });
              }}
              className={`px-2 py-1 text-xs font-semibold rounded-md transition-all ${
                unitType === u 
                  ? 'bg-white dark:bg-gray-700 text-primary shadow-sm' 
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600'
              }`}
            >
              {u === 'quantity' ? '#' : u === 'liter' ? 'L' : 'kg'}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs Row */}
      <div className="flex items-end gap-2 mb-2">
        <div className="grid grid-cols-3 gap-2 flex-1">
          <div className="flex flex-col">
            <label className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
              Price/{unitLabels[unitType]}
            </label>
            <input
              type="number"
              inputMode="decimal"
              value={price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="0"
              className={currentInputClass}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
              Amount
            </label>
            <input
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              placeholder="0"
              className={currentInputClass}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] uppercase tracking-wider text-primary font-bold mb-1">
              Total
            </label>
            <input
              type="number"
              inputMode="decimal"
              value={total}
              onChange={(e) => handleInputChange('total', e.target.value)}
              placeholder="0"
              className={currentInputClass.replace('dark:bg-gray-900', 'dark:bg-gray-900 font-bold')} // slight bold for total
            />
          </div>
        </div>

        <button
            onClick={handleManualCalculate}
            className="mb-[1px] h-[38px] w-[38px] bg-secondary/10 hover:bg-secondary/20 text-secondary rounded-lg transition-colors flex items-center justify-center shrink-0 active:scale-95"
            title="Calculate missing value"
          >
            <CalculatorIcon className="w-5 h-5" />
        </button>
      </div>

      {hasError && (
        <div className="text-red-500 text-xs mb-2 pl-1 animate-pulse">
          Please enter at least 2 values to calculate.
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-2 border-t border-dashed border-gray-100 dark:border-gray-700 pt-2">
        <button 
          onClick={() => onDelete(item.id)}
          className="text-red-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ItemRow;