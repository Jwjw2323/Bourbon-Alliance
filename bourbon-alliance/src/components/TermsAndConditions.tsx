import React from 'react';
import { FileText, ArrowLeft, AlertTriangle, Scale, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface TermsAndConditionsProps {
  onBack: () => void;
  onNavigatePrivacy: () => void;
}

export const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({ onBack, onNavigatePrivacy }) => {
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
          bourbonalliance.net/terms
        </span>
      </div>

      {/* Header Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-3 shadow-xl">
        <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-wider">
          <Scale className="w-4 h-4" />
          <span>User Agreement</span>
        </div>
        <h1 className="font-serif-brand text-3xl sm:text-4xl font-bold text-stone-100">
          Terms & Conditions
        </h1>
        <p className="text-xs sm:text-sm text-stone-400">
          Effective Date: November 6, 2026 · Domain: <strong className="text-amber-400 font-mono-code">bourbonalliance.net</strong>
        </p>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-3xl">
          Please review these Terms and Conditions ("Terms") carefully before using Bourbon Alliance. By accessing, browsing, or submitting drop tips on bourbonalliance.net, you agree to be bound by these Terms. If you do not agree, do not use the service.
        </p>
      </div>

      {/* Statutory & Independence Notice */}
      <div className="bg-amber-950/40 border border-amber-800/80 rounded-2xl p-5 sm:p-6 space-y-3">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>Notice of Independence & Alcohol Disclaimer</span>
        </div>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
          Bourbon Alliance is an independent informational and crowdsourced intelligence network. <strong>We do not sell, ship, warehouse, or distribute distilled spirits or alcoholic beverages.</strong> We hold no retail liquor license and receive no commission on bottle transactions. 
          Bourbon Alliance is not affiliated with the Virginia Alcoholic Beverage Control Authority (VA ABC), Montgomery County Alcohol Beverage Services (MoCo ABS), DC ABCA, or any commercial distillery or distributor.
        </p>
      </div>

      {/* Main Legal Clauses */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-6 text-xs sm:text-sm leading-relaxed">
        
        {/* Clause 1 */}
        <section className="space-y-2">
          <h2 className="font-serif-brand text-lg sm:text-xl font-bold text-stone-100">
            1. Legal Drinking Age (21+ Strict Restriction)
          </h2>
          <p>
            You must be at least twenty-one (21) years of age to access or use Bourbon Alliance. By using this service, you represent and warrant that you are of legal purchase age. Retail establishments in DC, MD, and VA are legally obligated to verify valid government-issued photographic identification upon purchase.
          </p>
        </section>

        {/* Clause 2 */}
        <section className="space-y-2 pt-4 border-t border-stone-800">
          <h2 className="font-serif-brand text-lg sm:text-xl font-bold text-stone-100">
            2. Crowdsourced Intelligence & Inventory Disclaimer
          </h2>
          <p>
            Drop sightings, allocated bottle counts, price observations, and delivery schedules are submitted in real-time by independent retail clerks, scouts, and community members.
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-stone-300">
            <li>
              <strong>No Guarantee of Inventory:</strong> Highly allocated bottles (such as Buffalo Trace Antique Collection, Pappy Van Winkle, Blanton's, Stagg, and E.H. Taylor) often sell out within minutes of being shelved. A live sighting is an observation, not an inventory reservation.
            </li>
            <li>
              <strong>Store Discretion & Pricing:</strong> Independent retailers set their own shelf pricing, purchase limits (e.g. limit 1 per customer), lottery entry rules, and bundle requirements. Bourbon Alliance displays fair market price ceilings for consumer guidance, but cannot compel any retailer to adhere to MSRP.
            </li>
          </ul>
        </section>

        {/* Clause 3 */}
        <section className="space-y-2 pt-4 border-t border-stone-800">
          <h2 className="font-serif-brand text-lg sm:text-xl font-bold text-stone-100">
            3. User Conduct & Tip Submission Rules
          </h2>
          <p>
            To preserve community integrity, members and associates agree to the following code of conduct:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-stone-300">
            <li>Submit accurate, honest prices seen and authentic bottle locations.</li>
            <li>Do not submit fabricated, misleading, or deceptive sightings ("ghost drops").</li>
            <li>Do not harass, intimidate, or disrupt store personnel, cashiers, or delivery drivers.</li>
            <li>Do not deploy automated bots, scrapers, or DDoS attacks against bourbonalliance.net.</li>
          </ul>
          <p className="text-stone-400 text-xs mt-1">
            Violations of these conduct standards will result in immediate permanent banning of your account and blacklisting of associated IP addresses.
          </p>
        </section>

        {/* Clause 4 */}
        <section className="space-y-3 pt-4 border-t border-stone-800">
          <h2 className="font-serif-brand text-lg sm:text-xl font-bold text-stone-100">
            4. SMS Drop Alerts, Carrier Compliance & Opt-In Terms
          </h2>
          <p className="text-stone-300">
            Bourbon Alliance operates an optional SMS notification service for registered users and web subscribers. By submitting your mobile phone number on our web opt-in form, you agree to the following terms in accordance with CTIA, TCPA, and Carrier guidelines:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-stone-300">
            <li><strong>Voluntary Web Opt-In:</strong> Consent is collected solely via an explicit web opt-in form with an un-selected checkbox. Consent is never pre-checked or assumed. Consent is not a condition of purchasing any good or service.</li>
            <li><strong>Program Description:</strong> Bourbon Alliance Drop Alerts delivers time-sensitive text alerts regarding account activity, high-demand allocated whiskey drops, store inventory arrivals, and community sightings across Washington DC, Maryland, and Virginia.</li>
            <li><strong>Message Frequency:</strong> You will receive up to 3 messages per day (message frequency varies based on regional bottle sightings).</li>
            <li><strong>Standard Rates:</strong> Message and data rates may apply depending on your mobile phone service plan.</li>
            <li><strong>Opt-Out Instructions (STOP):</strong> You may cancel the SMS service at any time. Text <span className="text-amber-400 font-mono-code font-bold">STOP</span> in reply to any notification message. You will receive a single confirmation message confirming your opt-out. No further messages will be sent unless re-subscribed.</li>
            <li><strong>Customer Support (HELP):</strong> For assistance or instructions, reply <span className="text-amber-400 font-mono-code font-bold">HELP</span> to any text message, or contact our support team at <a href="mailto:celeron.sec@proton.me" className="text-amber-400 underline font-mono-code">celeron.sec@proton.me</a>.</li>
            <li><strong>Carrier Disclaimer:</strong> Wireless mobile carriers are not liable for delayed, unread, or undelivered messages.</li>
          </ul>
        </section>

        {/* Clause 5 */}
        <section className="space-y-2 pt-4 border-t border-stone-800">
          <h2 className="font-serif-brand text-lg sm:text-xl font-bold text-stone-100">
            5. Intellectual Property
          </h2>
          <p>
            The Bourbon Alliance name, logo, radar algorithm, and interface styling are proprietary to Bourbon Alliance. Distillery names, bottle brand marks, and product photographs (e.g., Buffalo Trace, Blanton's, Weller, Heaven Hill, Wild Turkey) belong to their respective trademark owners and are used purely for nominative descriptive identification under fair use.
          </p>
        </section>

        {/* Clause 6 */}
        <section className="space-y-2 pt-4 border-t border-stone-800">
          <h2 className="font-serif-brand text-lg sm:text-xl font-bold text-stone-100">
            6. Limitation of Liability
          </h2>
          <p className="bg-stone-950 p-4 rounded-xl border border-stone-800 text-stone-400 text-xs leading-relaxed">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, BOURBON ALLIANCE AND ITS OPERATORS SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO TRAVEL EXPENSES, FUEL COSTS, LOST TIME, DISAPPOINTMENT, OR DISPUTES ARISING OUT OF OUT-OF-STOCK BOTTLES, INACCURATE CROWDSOURCED SIGHTINGS, OR STORE CONDUCT.
          </p>
        </section>

        {/* Clause 7 */}
        <section className="space-y-2 pt-4 border-t border-stone-800">
          <h2 className="font-serif-brand text-lg sm:text-xl font-bold text-stone-100">
            7. Governing Law
          </h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the District of Columbia and the States of Maryland and Virginia, without regard to conflicts of law provisions.
          </p>
        </section>

        {/* Clause 8 */}
        <section className="space-y-2 pt-4 border-t border-stone-800">
          <h2 className="font-serif-brand text-lg sm:text-xl font-bold text-stone-100">
            8. Contact Information
          </h2>
          <p>
            For legal inquiries, copyright notices, or terms clarification, contact:
          </p>
          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-1 text-xs">
            <div className="text-stone-200 font-semibold">Bourbon Alliance Legal Administration</div>
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
          <button onClick={onNavigatePrivacy} className="text-stone-400 hover:text-amber-400 underline">
            Privacy Policy
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
