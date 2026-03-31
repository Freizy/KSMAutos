import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calculator, DollarSign, Calendar, Percent } from 'lucide-react';

interface FinanceCalculatorProps {
  price?: number;
}

export const FinanceCalculator: React.FC<FinanceCalculatorProps> = ({ price = 100000 }) => {
  const [downPayment, setDownPayment] = useState(price * 0.2);
  const [interestRate, setInterestRate] = useState(5.5);
  const [term, setTerm] = useState(60);
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  useEffect(() => {
    const principal = price - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = term;

    if (monthlyRate === 0) {
      setMonthlyPayment(principal / numberOfPayments);
    } else {
      const x = Math.pow(1 + monthlyRate, numberOfPayments);
      const monthly = (principal * x * monthlyRate) / (x - 1);
      setMonthlyPayment(monthly);
    }
  }, [price, downPayment, interestRate, term]);

  return (
    <div className="glass p-8 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-accent/10 flex items-center justify-center rounded-sm text-accent">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-black tracking-tighter uppercase leading-none">Finance Calculator</h3>
          <p className="text-muted text-[10px] uppercase tracking-widest font-bold mt-1">Estimate your monthly payments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-muted">
              <label>Vehicle Price</label>
              <span className="text-ink font-mono">${price.toLocaleString()}</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-accent" style={{ width: '100%' }} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-muted">
              <label>Down Payment</label>
              <span className="text-ink font-mono">${downPayment.toLocaleString()}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max={price} 
              step="1000"
              value={downPayment}
              onChange={(e) => setDownPayment(parseInt(e.target.value))}
              className="accent-accent"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-muted">
              <label>Interest Rate (%)</label>
              <span className="text-ink font-mono">{interestRate}%</span>
            </div>
            <input 
              type="range" 
              min="0.1" 
              max="15" 
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(parseFloat(e.target.value))}
              className="accent-accent"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-muted">
              <label>Term (Months)</label>
              <span className="text-ink font-mono">{term} Months</span>
            </div>
            <div className="flex gap-2">
              {[24, 36, 48, 60, 72].map((t) => (
                <button
                  key={t}
                  onClick={() => setTerm(t)}
                  className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-sm border transition-all ${term === t ? 'bg-accent border-accent text-bg' : 'border-line text-muted hover:text-ink'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center bg-white/5 p-8 rounded-sm border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <DollarSign className="w-32 h-32" />
          </div>
          <div className="text-[10px] uppercase tracking-widest font-bold text-muted mb-2">Estimated Monthly Payment</div>
          <div className="text-5xl font-black tracking-tighter text-accent font-mono">
            ${Math.round(monthlyPayment).toLocaleString()}
          </div>
          <div className="text-[10px] uppercase tracking-widest font-bold text-muted mt-4 text-center max-w-[200px]">
            *Estimated payments are for informational purposes only.
          </div>
          <button className="mt-8 w-full py-4 bg-white text-bg font-bold uppercase tracking-widest text-xs rounded-sm hover:scale-105 transition-all">
            Get Pre-Approved
          </button>
        </div>
      </div>
    </div>
  );
};
