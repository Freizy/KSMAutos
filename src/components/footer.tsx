import React from "react";
import { Gauge } from "lucide-react";

interface FooterProps {
  onOpenInfo: (title: string, content: React.ReactNode) => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenInfo }) => {
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
          <button
            onClick={() =>
              onOpenInfo(
                "Terms of Service",
                <div className="flex flex-col gap-4 text-xs leading-relaxed">
                  <p>
                    Welcome to KSM Autos. By accessing our platform, you agree
                    to comply with and be bound by the following terms and
                    conditions of use.
                  </p>
                  <h4 className="text-accent font-bold">
                    1. Digital Acquisition
                  </h4>
                  <p>
                    All vehicle listings are subject to verification. Inquiries
                    do not constitute a binding purchase agreement until
                    finalized by our elite concierge team.
                  </p>
                  <h4 className="text-accent font-bold">2. Data Integrity</h4>
                  <p>
                    Users are responsible for maintaining the security of their
                    private garage access. Any unauthorized activity should be
                    reported immediately.
                  </p>
                  <h4 className="text-accent font-bold">3. System Usage</h4>
                  <p>
                    Our performance telemetry and market analytics are provided
                    for informational purposes. KSM Autos reserves the right to
                    modify specifications without prior notice.
                  </p>
                </div>,
              )
            }
            className="hover:text-accent transition-colors"
          >
            Terms
          </button>
          <button
            onClick={() =>
              onOpenInfo(
                "Privacy Policy",
                <div className="flex flex-col gap-4 text-xs leading-relaxed">
                  <p>
                    Your privacy is paramount. KSM Autos employs advanced
                    encryption to safeguard your high-performance data.
                  </p>
                  <h4 className="text-accent font-bold">Data Collection</h4>
                  <p>
                    We only collect essential information required to provide
                    our vehicle management services and facilitate acquisition
                    inquiries.
                  </p>
                  <h4 className="text-accent font-bold">Secure Storage</h4>
                  <p>
                    Your private garage data and wishlist are stored in
                    encrypted cloud arrays, accessible only via verified
                    authentication tokens.
                  </p>
                  <h4 className="text-accent font-bold">
                    Third-Party Disclosure
                  </h4>
                  <p>
                    We do not sell or lease your personal data to third parties.
                    Information is only shared with verified delivery partners
                    when an acquisition is initiated.
                  </p>
                </div>,
              )
            }
            className="hover:text-accent transition-colors"
          >
            Privacy
          </button>
          <button
            onClick={() =>
              onOpenInfo(
                "KSM Nexus API",
                <div className="flex flex-col gap-4 text-xs leading-relaxed">
                  <p>
                    The KSM Nexus API provides programmatic access to our global
                    inventory and technical specifications.
                  </p>
                  <div className="bg-white/5 p-4 rounded-sm border border-line font-mono text-[10px] text-accent">
                    GET /api/v4/inventory/active
                    <br />
                    Authorization: Bearer [ACCESS_TOKEN]
                  </div>
                  <h4 className="text-accent font-bold">Developer Access</h4>
                  <p>
                    API keys are currently reserved for Elite members and
                    enterprise partners. Contact system administration for
                    provisioning requests.
                  </p>
                  <h4 className="text-accent font-bold">Rate Limiting</h4>
                  <p>
                    Standard endpoints are capped at 50,000 requests per cycle
                    to maintain system-wide performance integrity.
                  </p>
                </div>,
              )
            }
            className="hover:text-accent transition-colors"
          >
            API
          </button>
          <button
            onClick={() =>
              onOpenInfo(
                "Technical Support",
                <div className="flex flex-col gap-4 text-xs leading-relaxed">
                  <p>
                    Our support team is available 24/7 for system-critical
                    issues and acquisition assistance.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="glass p-4">
                      <div className="text-accent font-bold mb-1">
                        Direct Uplink
                      </div>
                      <p className="opacity-70">support@ksm-autos.systems</p>
                    </div>
                    <div className="glass p-4">
                      <div className="text-accent font-bold mb-1">
                        Command Sync
                      </div>
                      <p className="opacity-70">+1 (800) KSM-ELITE</p>
                    </div>
                  </div>
                  <h4 className="text-accent font-bold underline">
                    Common Diagnostics
                  </h4>
                  <ul className="list-disc pl-4 opacity-70">
                    <li>Authentication parity issues</li>
                    <li>Telemetry data synchronization</li>
                    <li>Garage capacity upgrades</li>
                    <li>Secure transaction protocols</li>
                  </ul>
                </div>,
              )
            }
            className="hover:text-accent transition-colors"
          >
            Support
          </button>
        </div>
        <div className="font-mono text-[10px] opacity-30">© 2026 KSM AUTOS</div>
        <div className="font-mono text-[10px] opacity-30">
          Powered by Freizy ❣
        </div>
      </div>
    </footer>
  );
};

export default Footer;
