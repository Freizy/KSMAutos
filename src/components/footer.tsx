
import React from 'react';
import { Gauge } from 'lucide-react';

export default function Footer() {
  return (
      <footer className="border-t border-line py-12 mt-24">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-accent" />
              <span className="font-bold tracking-tighter uppercase">
                KSM Autos
              </span>
            </div>
            <p className="text-xs text-muted">
              High-Performance Vehicle Management System
            </p>
          </div>
          <div className="flex gap-8 text-[10px] uppercase tracking-widest font-medium text-muted">
            <a href="#" className="hover:text-accent transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              API
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              Support
            </a>
          </div>
          <div className="font-mono text-[10px] opacity-30">
            © 2026 KSM AUTOS
          </div>
          <div className="font-mono text-[10px] opacity-30">
            Powered by Freizy ❣
          </div>
        </div>
      </footer>)}
      