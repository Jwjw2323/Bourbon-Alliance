import React from 'react';
import { ShieldCheck, ArrowLeft, Lock, EyeOff, Phone, Mail, FileText, CheckCircle2 } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
  onNavigateTerms: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack, onNavigateTerms }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 text-stone-300">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Bourbon Alliance Radar</span>
        </button>

        <span className="text-[11px] font-mono-code text-stone-500">
          bourbonalliance.net/privacy
        </span>
      </div>

      {/* Header Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-3 shadow-xl">
        <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Legal & Data Protection</span>
        </div>
        <h1 className="font-serif-brand text-3xl sm:text-4xl font-bold text-stone-100">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-stone-400">
          Effective Date: November 6, 2026 · Domain: <strong className="text-amber-400 font-mono-code">bourbonalliance.net</strong>
        </p>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-3xl">
          Bourbon Alliance ("we", "us", or "our") respects your personal privacy. We are committed to protecting the privacy of independent bottle hunters, distillery clerks, and retail scouts across Washington D.C., Maryland, and Virginia. This policy details how we collect, store, and shield your data.
        </p>
      </div>

      {/* Privacy Highlights Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <EyeOff className="w-4 h-4" />
            <span>Anonymous by Default</span>
          </div>
          <p className="text-stone-400 text-[11px] leading-relaxed">
            Drop tips never expose your real name or email. You appear as an anonymous scout or store associate.
          </p>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl space-y-1.5">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <Lock className="w-4 h-4" />
            <span>Zero Password Storage</span>
          </div>
          <p className="text-stone-400 text-[11px] leading-relaxed">
            Google OAuth handles authentication. We never handle or store passwords on our servers.
          </p>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl space-y-1.5">
          <div className="flex items-center gap-2 text-sky-400 font-bold">
            <Phone className="w-4 h-4" />
            <span>No Telemarketing Texts</span>
          </div>
          <p className="text-stone-400 text-[11px] leading-relaxed">
            Phone numbers are strictly used for your requested high-priority Unicorn bottle alerts with quiet hours.
          </p>
        </div>
      </div>

      {/* Main Legal Sections */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-6 text-xs sm:text-sm leading-relaxed">
        
        {/* Section 1 */}
        <section className="space-y-2">
          <h2 className="font-serif-brand text-lg sm:text-xl font-bold text-stone-100 flex items-center gap-2">
            <span>1. Information We Collect</span>
          </h2>
          <p>
            We collect only the minimum information necessary to operate community bottle tracking and alert delivery:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-stone-300">
            <li>
              <strong className="text-stone-100">Google OAuth Profile:</strong> When you sign in with Google, we receive your verified Google account email, display name, and avatar picture via Google Identity Services (OAuth Client ID: <code className="text-amber-400 font-mono-code text-[11px]">19323179551-81fncrrnrv1gv690a98agpu8to55mtej.apps.googleusercontent.com</code>).
            </li>
            <li>
              <strong className="text-stone-100">Notification Endpoints (Optional):</strong> If you opt-in to SMS alerts or morning digests, you provide a mobile phone number and notification email address.
            </li>
            <li>
              <strong className="text-stone-100">Watchlist & Preferences:</strong> Your selected bottles, priority tiers (Unicorn, Want, Curious), price ceiling parameters, and quiet hours settings.
            </li>
            <li>
              <strong className="text-stone-100">Community Submissions:</strong> Sighting locations, prices seen, quantity estimates, and verification upvotes.
            </li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-2 pt-4 border-t border-stone-800">
          <h2 className="font-serif-brand text-lg sm:text-xl font-bold text-stone-100 flex items-center gap-2">
            <span>2. The Anonymous Scout Shield</span>
          </h2>
          <p>
            We recognize that store associates, distributor drivers, and private collectors need confidentiality.
          </p>
          <p className="bg-stone-950 p-4 rounded-xl border border-stone-800 text-stone-300">
            When you report a drop or confirm an in-stock bottle, your account display name is masked. Community cards show aliases such as <span className="text-amber-400 font-mono-code">"Staff Clerk (Verified)"</span>, <span className="text-amber-400 font-mono-code">"Alliance Scout"</span>, or <span className="text-amber-400 font-mono-code">"Anonymous Hunter"</span>. We do not sell or disclose tipster identities to store owners, competitors, or liquor distributors.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-2 pt-4 border-t border-stone-800">
          <h2 className="font-serif-brand text-lg sm:text-xl font-bold text-stone-100 flex items-center gap-2">
            <span>3. SMS & Mobile Communications Policy (CTIA / TCPA Compliance)</span>
          </h2>
          <p>
            If you provide a mobile phone number for text alerts:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-stone-300">
            <li><strong className="text-stone-100">Purpose:</strong> SMS alerts are sent solely when a bottle marked as "Unicorn" priority is reported in your selected jurisdiction (DC, MD, or VA).</li>
            <li><strong className="text-stone-100">No Telemarketing:</strong> We do not send telemarketing, promotional ads, or third-party sponsor messages.</li>
            <li><strong className="text-stone-100">Frequency & Rates:</strong> Message frequency varies depending on community sighting activity and your configured daily cap (default: 3 msgs/day). Standard message and data rates may apply depending on your cellular service provider.</li>
            <li><strong className="text-stone-100">Opt-Out Instructions (STOP):</strong> You can cancel SMS drop alerts at any time by replying <span className="text-amber-400 font-mono-code font-bold">STOP</span> to any text message received, or by toggling SMS off in your Alerts & Watchlist dashboard. Upon texting STOP, you will receive a single confirmation message confirming your opt-out.</li>
            <li><strong className="text-stone-100">Customer Support (HELP):</strong> For assistance or questions regarding text notifications, reply <span className="text-amber-400 font-mono-code font-bold">HELP</span> or email us at <a href="mailto:celeron.sec@proton.me" className="text-amber-400 underline font-mono-code">celeron.sec@proton.me</a>.</li>
            <li><strong className="text-stone-100">Anti-Spam Throttles:</strong> We enforce quiet hours (default: 10:00 PM to 8:00 AM) and same-store cooldowns to prevent notification spam.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-2 pt-4 border-t border-stone-800">
          <h2 className="font-serif-brand text-lg sm:text-xl font-bold text-stone-100 flex items-center gap-2">
            <span>4. Data Storage & Security</span>
          </h2>
          <p>
            Your preferences, bookmarks, and sessions are encrypted and stored using standard browser local storage and secure server transport (HTTPS/TLS). We do not store financial payment cards, driver's licenses, or social security numbers.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-2 pt-4 border-t border-stone-800">
          <h2 className="font-serif-brand text-lg sm:text-xl font-bold text-stone-100 flex items-center gap-2">
            <span>5. Age Requirement (21+ Strict Policy)</span>
          </h2>
          <p>
            Bourbon Alliance is strictly intended for individuals who are at least twenty-one (21) years of age in compliance with the National Minimum Drinking Age Act and beverage alcohol regulations in the District of Columbia, Maryland, and Virginia. We do not knowingly collect personal data from individuals under 21.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-2 pt-4 border-t border-stone-800">
          <h2 className="font-serif-brand text-lg sm:text-xl font-bold text-stone-100 flex items-center gap-2">
            <span>6. Contact Us & Data Deletion</span>
          </h2>
          <p>
            If you have questions about this Privacy Policy, or wish to request immediate deletion of your account and watchlist data, contact us at:
          </p>
          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-1 text-xs">
            <div className="text-stone-200 font-semibold">Bourbon Alliance Administration</div>
            <div className="text-stone-400">Email: <a href="mailto:celeron.sec@proton.me" className="text-amber-400 underline font-mono-code">celeron.sec@proton.me</a></div>
            <div className="text-stone-400">Website: <span className="text-stone-300 font-mono-code">https://bourbonalliance.net</span></div>
          </div>
        </section>

      </div>

      {/* Footer Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 pt-4 border-t border-stone-800">
        <div>
          © 2026 Bourbon Alliance. All rights reserved.
        </div>
        <div className="flex items-center gap-4">
          <button onClick={onNavigateTerms} className="text-stone-400 hover:text-amber-400 underline">
            Terms & Conditions
          </button>
          <span>·</span>
          <button onClick={onBack} className="text-stone-400 hover:text-amber-400">
            Return to Radar
          </button>
        </div>
      </div>

    </div>
  );
};
