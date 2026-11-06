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

        {/* Section 3: Carrier & Toll-Free Verification Compliant */}
        <section className="space-y-4 pt-4 border-t border-stone-800">
          <div>
            <h2 className="font-serif-brand text-lg sm:text-xl font-bold text-stone-100 flex items-center gap-2">
              <span>3. SMS Communications Policy, Carrier Compliance & Opt-In Policy Proof</span>
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Bourbon Alliance complies with CTIA, TCPA, and Carrier Toll-Free / A2P 10DLC messaging standards. Below is our formal messaging disclosure and web opt-in policy proof.
            </p>
          </div>

          <div className="bg-stone-950 p-4 sm:p-5 rounded-xl border border-stone-800 space-y-3 text-xs">
            <div className="font-bold text-stone-200 uppercase tracking-wider text-[11px] text-amber-500">
              Web Opt-In Form Specification & Proof of Consent
            </div>
            <p className="text-stone-300">
              Users opt-in to SMS messaging via our public web opt-in form located on <strong className="text-stone-100">bourbonalliance.net/alerts</strong>. In accordance with carrier guidelines:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-stone-300">
              <li><strong className="text-stone-100">Phone Number Input:</strong> The consumer must enter their own 10-digit mobile phone number.</li>
              <li><strong className="text-stone-100">Consent Checkbox (Not Pre-Selected):</strong> The consent checkbox is unchecked by default. The consumer must actively and manually click the checkbox to provide consent.</li>
              <li><strong className="text-stone-100">Message Description:</strong> The consent label explicitly states: <em>"Yes, I would like to receive automated text messages from Bourbon Alliance about account payment activity, allocated whiskey drops, restock alerts, and important updates. I understand I will receive up to 3 messages per day."</em></li>
              <li><strong className="text-stone-100">Message Frequency:</strong> Consumers will receive up to 3 messages per day (frequency varies based on regional bottle sightings).</li>
              <li><strong className="text-stone-100">Standard Rates:</strong> Message and data rates may apply depending on your mobile phone service plan.</li>
              <li><strong className="text-stone-100">Help & Stop Instructions:</strong> Reply <span className="text-amber-400 font-mono-code font-bold">HELP</span> for help or <span className="text-amber-400 font-mono-code font-bold">STOP</span> to cancel any time. Support is also available via email at <a href="mailto:celeron.sec@proton.me" className="text-amber-400 underline font-mono-code">celeron.sec@proton.me</a>.</li>
              <li><strong className="text-stone-100">Direct Policy Links:</strong> Clear, prominent links to our <a href="/terms" onClick={(e) => { e.preventDefault(); onBack(); }} className="text-amber-400 underline">Terms of Service</a> and <a href="/privacy" className="text-amber-400 underline">Privacy Policy</a> are displayed directly with the opt-in checkbox.</li>
              <li><strong className="text-stone-100">Clear Action Button:</strong> The form requires clicking an explicit button: <span className="text-stone-100 font-mono-code font-bold">"Yes, sign me up!"</span></li>
              <li><strong className="text-stone-100">No Purchase Requirement:</strong> Consent to receive marketing or notification text messages is not a condition of purchasing any good or service, nor is it required to browse the radar.</li>
            </ul>

            {/* Visual Opt-In Form Preview Card for Verification Auditors */}
            <div className="mt-4 p-4 bg-stone-900 border border-stone-700/80 rounded-xl space-y-3">
              <div className="text-[11px] text-amber-400 font-bold uppercase tracking-wider">
                Live Web Form Demonstration (As displayed on bourbonalliance.net/alerts)
              </div>
              <div>
                <label className="text-xs text-stone-300 block mb-1 font-semibold">
                  Mobile Phone Number
                </label>
                <input
                  type="text"
                  disabled
                  placeholder="+1 (202) 555-0199"
                  className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-1.5 text-xs text-stone-400 font-mono-code"
                />
              </div>

              <div className="p-3 bg-stone-950 border border-stone-800 rounded-lg space-y-2">
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    disabled
                    checked={false}
                    className="mt-0.5 rounded border-stone-700 bg-stone-900 h-4 w-4 flex-shrink-0"
                  />
                  <span className="text-xs text-stone-200">
                    Yes, I would like to receive automated text messages from Bourbon Alliance about account payment activity, allocated whiskey drops, restock alerts, and important updates. I understand I will receive up to 3 messages per day.
                  </span>
                </div>
                <div className="text-[10px] text-stone-400 pl-6 space-y-1 pt-1 border-t border-stone-800/80">
                  <p><strong className="text-stone-300">Message Frequency:</strong> You will receive up to 3 messages per day (message frequency varies based on regional sightings).</p>
                  <p><strong className="text-stone-300">Standard Rates:</strong> Message and data rates may apply depending on your mobile phone service plan.</p>
                  <p><strong className="text-stone-300">Help & Stop:</strong> Reply HELP for help or STOP to cancel any time.</p>
                  <p>By providing your phone number and checking the box above, you agree to receive text messages from Bourbon Alliance. Consent is not required to make a purchase or browse the website.</p>
                  <div className="pt-1 text-xs text-amber-400">
                    <span>Terms of Service</span> | <span>Privacy Policy</span>
                  </div>
                </div>
              </div>

              <div className="bg-stone-100 text-stone-950 font-bold py-2 rounded-lg text-center text-xs">
                Yes, sign me up!
              </div>
            </div>
          </div>
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
