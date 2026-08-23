import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions - Fewsion',
  description: 'Terms and Conditions for Fewsion Creators and Brands',
};

export default function TermsOfConditionsPage() {
  return (
    <main className="min-h-screen pt-[120px] pb-[80px] px-[5%] bg-[var(--core-bg)] text-[var(--text)]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-[clamp(32px,5vw,48px)] font-display font-extrabold mb-12 tracking-tight">Terms & Conditions</h1>
        
        {/* Creator Terms */}
        <section className="mb-20">
          <h2 className="text-[clamp(24px,3vw,32px)] font-display font-bold mb-6 text-[var(--primary)] border-b border-[var(--border)] pb-4">
            Fewsion — Creator Terms & Conditions
          </h2>
          <div className="text-[16px] md:text-[18px] leading-[1.8] text-[var(--muted2)] space-y-6">
            <p className="font-medium text-[var(--text)] bg-[var(--card-bg)] p-4 rounded-lg border border-[var(--border)]">
              <strong>Applies to:</strong> All individuals registering on Fewsion as a "Creator" (UGC creator, influencer, content creator) to offer content creation, promotion, or collaboration services to Brands.
            </p>

            <div>
              <h3 className="text-xl font-bold mt-8 mb-4 text-[var(--text)] font-display">1. Definitions</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>"Fewsion" / "Platform"</strong> — the marketplace operated by Fewsion, connecting Creators, Brands, and Editors.</li>
                <li><strong>"Creator"</strong> — an individual or entity registered on Fewsion to produce and/or deliver content, endorsements, or promotional services for Brands.</li>
                <li><strong>"Brand"</strong> — a business entity registered on Fewsion seeking Creator services.</li>
                <li><strong>"Campaign"</strong> — a specific engagement, deliverable, or collaboration agreed between a Creator and a Brand via the Platform.</li>
                <li><strong>"Creator Score"</strong> — Fewsion's proprietary trust/performance rating assigned to each Creator based on reliability, content quality, delivery timeliness, and Brand feedback.</li>
                <li><strong>"Escrow"</strong> — funds held by Fewsion's payment partner (Razorpay Route/Escrow) on behalf of a Brand until Campaign deliverables are approved.</li>
                <li><strong>"Platform Fee" / "Commission"</strong> — the percentage Fewsion deducts from Campaign payouts (5–9%, as displayed at the time of Campaign confirmation).</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mt-8 mb-4 text-[var(--text)] font-display">2. Eligibility & Registration</h3>
              <ul className="space-y-4">
                <li><strong>2.1</strong> You must be at least 18 years old, or the age of majority in your jurisdiction, to register as a Creator.</li>
                <li><strong>2.2</strong> You must provide accurate, current, and complete information during registration, including legal name, contact details, social media handles, PAN/tax details (for Indian Creators), and bank/UPI details for payouts.</li>
                <li><strong>2.3</strong> Fewsion reserves the right to verify your identity, social media ownership, and follower authenticity before activating your account. Fewsion may suspend or reject registration if verification fails or fraud is suspected.</li>
                <li><strong>2.4</strong> One Creator profile per individual. Operating multiple accounts to circumvent Creator Score, fee structures, or Brand blacklists is prohibited and will result in permanent termination.</li>
                <li><strong>2.5</strong> By registering, you represent that you have full legal right to enter into Campaign agreements and are not restricted by any existing exclusivity or non-compete agreement that would conflict with your use of Fewsion.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mt-8 mb-4 text-[var(--text)] font-display">3. Nature of Relationship</h3>
              <ul className="space-y-4">
                <li><strong>3.1</strong> Fewsion is a facilitator and marketplace, not an employer, agent, or party to any Campaign agreement between a Creator and a Brand. Fewsion does not guarantee Campaign volume, income, or Brand behavior.</li>
                <li><strong>3.2</strong> You are an independent contractor. Nothing in these Terms creates an employment, partnership, joint venture, or agency relationship between you and Fewsion.</li>
                <li><strong>3.3</strong> You are solely responsible for your own taxes, GST registration (if applicable), and compliance with Indian labor and tax law regarding income earned through the Platform.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mt-8 mb-4 text-[var(--text)] font-display">4. Campaign Process & Deliverables</h3>
              <ul className="space-y-4">
                <li><strong>4.1</strong> A Campaign is confirmed only when both Creator and Brand accept the agreed scope, deliverables, timeline, and payout via the Platform (in-app confirmation or Fewsion-generated contract).</li>
                <li><strong>4.2</strong> You agree to deliver content strictly per the agreed brief, format, deadline, and usage rights stated in the Campaign confirmation. Material deviation without Brand consent may result in payment withholding.</li>
                <li><strong>4.3 Revisions:</strong> Brands are entitled to up to [2] rounds of reasonable revisions within the agreed scope, at no extra cost, unless otherwise specified in the Campaign terms.</li>
                <li><strong>4.4 Missed deadlines:</strong> Repeated late delivery (2+ instances in a rolling 90-day period) will negatively affect your Creator Score and may result in Campaign cancellation with partial or no payout, at Fewsion's discretion, based on work completed.</li>
                <li>
                  <strong>4.5 Cancellations:</strong>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>If a Creator cancels after accepting a Campaign but before delivery, Fewsion may apply a Creator Score penalty and, for repeated cancellations, a temporary suspension.</li>
                    <li>If a Brand cancels after content is delivered and approved, full payout is still due to the Creator.</li>
                    <li>Cancellations must be raised via the Platform, not privately with the Brand, to remain eligible for dispute protection.</li>
                  </ul>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mt-8 mb-4 text-[var(--text)] font-display">5. Payments & Escrow</h3>
              <ul className="space-y-4">
                <li><strong>5.1</strong> All Campaign payments must be processed through Fewsion's Escrow system (Razorpay Route). Off-platform payment arrangements are strictly prohibited (see Section 9).</li>
                <li><strong>5.2</strong> Brand funds are held in Escrow at Campaign confirmation and released to the Creator upon: (a) Brand approval of final deliverables, or (b) Automatic release after [7] days if the Brand does not respond to a submitted deliverable (subject to Fewsion's dispute window).</li>
                <li><strong>5.3</strong> Fewsion deducts its Platform Fee (10–15%, displayed before Campaign confirmation) from the payout before disbursing the remainder to the Creator's registered bank/UPI account.</li>
                <li><strong>5.4 Payout timelines:</strong> funds are disbursed within [3–5] business days of Escrow release, subject to bank/payment processor timelines beyond Fewsion's control.</li>
                <li><strong>5.5</strong> Fewsion is not liable for delays caused by incorrect payout details provided by the Creator, bank holidays, or third-party payment processor outages.</li>
                <li><strong>5.6 Disputed payments:</strong> If a Brand disputes a deliverable, funds remain in Escrow pending resolution under Section 8 (Dispute Resolution). Fewsion may request evidence of delivery (timestamps, drafts, communication logs) from the Creator.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mt-8 mb-4 text-[var(--text)] font-display">6. Creator Score</h3>
              <ul className="space-y-4">
                <li><strong>6.1</strong> Your Creator Score is calculated using factors including but not limited to: on-time delivery, Brand ratings, dispute history, content quality flags, and platform conduct.</li>
                <li><strong>6.2</strong> Creator Score is displayed to Brands to inform matching and is not a certification of content quality by Fewsion; it reflects platform performance history only.</li>
                <li><strong>6.3</strong> Fewsion may adjust scoring methodology at its discretion, with reasonable notice communicated via the Platform. Fewsion is not obligated to disclose the exact weighting algorithm to prevent gaming of the system.</li>
                <li><strong>6.4</strong> Attempting to manipulate your Creator Score (fake reviews, colluding with Brands/other Creators, incentivized ratings) is prohibited and grounds for suspension.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mt-8 mb-4 text-[var(--text)] font-display">7. Content Ownership, Licensing & Usage Rights</h3>
              <ul className="space-y-4">
                <li><strong>7.1</strong> Unless otherwise agreed in a specific Campaign brief, the Creator retains copyright ownership of content produced.</li>
                <li><strong>7.2</strong> By delivering content for a Campaign, the Creator grants the Brand a limited, non-exclusive, royalty-included license to use the content for the specific purpose, duration, and platforms stated in the Campaign brief (e.g., organic social use, paid ads, whitelisting) once payment is confirmed released from Escrow.</li>
                <li><strong>7.3</strong> Extended usage (e.g., paid amplification, usage beyond the agreed period, usage on additional platforms, or exclusivity) requires separate agreement and additional compensation, negotiated between Creator and Brand and documented via the Platform.</li>
                <li><strong>7.4</strong> Fewsion is not responsible for enforcing IP rights between Creator and Brand but will provide delivery records and Campaign agreement history to support a Creator's claim in case of unauthorized use, upon request.</li>
                <li><strong>7.5</strong> You represent that content you deliver does not infringe any third party's copyright, trademark, publicity rights, or other intellectual property, and does not contain defamatory, obscene, or unlawful material. You indemnify Fewsion against claims arising from content you create (see Section 12).</li>
                <li><strong>7.6</strong> Fewsion may use your public Campaign work (with attribution, unless you opt out) in Platform marketing, case studies, and the public Creator directory, including your Creator Score and portfolio samples.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mt-8 mb-4 text-[var(--text)] font-display">8. Dispute Resolution</h3>
              <ul className="space-y-4">
                <li><strong>8.1</strong> Disputes regarding deliverables, quality, or scope must be raised via the Platform's dispute system within [3] business days of content submission.</li>
                <li><strong>8.2</strong> Fewsion will review evidence from both parties (brief, deliverable, communication logs) and issue a binding resolution regarding Escrow release — full release, partial release, or return to Brand — based on whether delivered content reasonably matches the agreed brief.</li>
                <li><strong>8.3</strong> Fewsion's dispute decision is made in good faith based on available evidence and is final for the purposes of Escrow release, though it does not waive either party's independent legal rights.</li>
                <li><strong>8.4</strong> Disputes not resolved through the Platform, or involving alleged fraud, harassment, or off-platform breach, may be escalated to arbitration under Section 14.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mt-8 mb-4 text-[var(--text)] font-display">9. Off-Platform Circumvention (Anti-Disintermediation)</h3>
              <ul className="space-y-4">
                <li><strong>9.1</strong> Creators and Brands who connect via Fewsion agree not to arrange payment or repeat Campaigns outside the Platform for a period of [12] months from first introduction, to avoid Fewsion's Commission.</li>
                <li><strong>9.2</strong> Soliciting a Brand's contact details for the purpose of bypassing Fewsion, or accepting off-platform payment for a Fewsion-originated Campaign, is a material breach and grounds for immediate suspension, forfeiture of any pending Escrow payout, and potential legal action for the unpaid Commission.</li>
                <li><strong>9.3</strong> Fewsion may monitor for circumvention patterns (e.g., repeated Campaign cancellations followed by continued Brand-Creator activity) and reserves the right to investigate and act on reasonable suspicion.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mt-8 mb-4 text-[var(--text)] font-display">10. Prohibited Conduct</h3>
              <p className="mb-4">You agree NOT to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Submit fake, purchased, or bot-driven engagement/follower metrics.</li>
                <li>Misrepresent your identity, reach, or past work.</li>
                <li>Harass, threaten, or discriminate against Brands, Editors, or Fewsion staff.</li>
                <li>Post content violating platform community guidelines (Instagram/YouTube/etc.) that could expose the Brand or Fewsion to liability.</li>
                <li>Use Fewsion to solicit Creators/Brands for unrelated commercial purposes.</li>
                <li>Attempt to reverse-engineer, scrape, or misuse the Fewsion AI matching system or Creator Score algorithm.</li>
                <li>Share confidential Brand campaign details, briefs, or unreleased products publicly without written consent.</li>
              </ul>
              <p className="mt-4">Violations may result in warnings, Creator Score penalties, suspension, or permanent termination, at Fewsion's sole discretion, with or without prior notice for severe violations.</p>
            </div>

            <div>
              <h3 className="text-xl font-bold mt-8 mb-4 text-[var(--text)] font-display">11. Fees & Subscriptions</h3>
              <ul className="space-y-4">
                <li><strong>11.1 Platform Commission:</strong> 10–15% of Campaign value, deducted at payout, as displayed at Campaign confirmation.</li>
                <li><strong>11.2 Creator Pro (₹499/month, optional):</strong> priority matching, advanced analytics, and reduced commission tier (if applicable) — terms displayed at subscription.</li>
                <li><strong>11.3 AI Contract Generator (₹99/use, optional):</strong> generates a Campaign-specific contract; provided as a convenience tool only and does not constitute legal advice (see Section 15).</li>
                <li><strong>11.4</strong> Subscription fees are non-refundable except as required by law or explicitly stated in a separate refund policy.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mt-8 mb-4 text-[var(--text)] font-display">12. Indemnification</h3>
              <p>You agree to indemnify and hold harmless Fewsion, its founders, employees, and affiliates from any claims, damages, liabilities, or legal costs arising from: (a) content you create or deliver, (b) your breach of these Terms, (c) your violation of any third-party rights, or (d) your conduct toward a Brand, Editor, or other Creator during a Campaign.</p>
            </div>

            <div>
              <h3 className="text-xl font-bold mt-8 mb-4 text-[var(--text)] font-display">13. Limitation of Liability</h3>
              <ul className="space-y-4">
                <li><strong>13.1</strong> Fewsion provides the Platform "as is." Fewsion does not guarantee Brand conduct, Campaign availability, or income levels.</li>
                <li><strong>13.2</strong> To the maximum extent permitted by law, Fewsion's total liability to any Creator for claims arising from Platform use is limited to the total Commission fees paid by that Creator's Campaigns in the preceding 6 months, or ₹5,000, whichever is greater.</li>
                <li><strong>13.3</strong> Fewsion is not liable for indirect, incidental, or consequential damages, including lost profits or reputational harm, arising from Platform use, Brand disputes, or third-party payment processor issues.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mt-8 mb-4 text-[var(--text)] font-display">14. Termination & Governing Law</h3>
              <ul className="space-y-4">
                <li><strong>14.1</strong> Either party may terminate the Creator account at any time via the Platform. Pending Campaigns must be completed or formally cancelled through the dispute process before account closure is finalized.</li>
                <li><strong>14.2</strong> Fewsion may suspend or terminate accounts immediately for breach of Sections 9, 10, or fraud.</li>
                <li><strong>14.3</strong> These Terms are governed by the laws of India. Disputes not resolved via Platform mechanisms shall be subject to arbitration under the Arbitration and Conciliation Act, 1996, seated in [City, e.g., Nagpur/Mumbai], with courts of [City] having exclusive jurisdiction for matters not covered by arbitration.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mt-8 mb-4 text-[var(--text)] font-display">15. Disclaimers</h3>
              <ul className="space-y-4">
                <li><strong>15.1</strong> The AI Contract Generator and Creator Score are tools to assist, not legal or financial advice. Creators are encouraged to seek independent legal counsel for high-value Campaigns.</li>
                <li><strong>15.2</strong> Fewsion does not verify the authenticity of Brand products/claims a Creator is asked to promote; Creators are responsible for complying with ASCI guidelines and applicable advertising disclosure laws (e.g., #ad, #sponsored disclosures) independently.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mt-8 mb-4 text-[var(--text)] font-display">16. Changes to Terms</h3>
              <p>Fewsion may update these Terms periodically. Material changes will be notified via the Platform or registered email at least [7] days before taking effect. Continued use after the effective date constitutes acceptance.</p>
            </div>

            <div>
              <h3 className="text-xl font-bold mt-8 mb-4 text-[var(--text)] font-display">17. Contact</h3>
              <p>For disputes, questions, or legal notices: <a href="mailto:legal@getfewsion.com" className="text-[var(--primary)] hover:underline">legal@getfewsion.com</a> / support contact</p>
            </div>
          </div>
        </section>


        {/* Brand Terms */}
        <section>
          <h2 className="text-[clamp(24px,3vw,32px)] font-display font-bold mb-6 text-[var(--primary)] border-b border-[var(--border)] pb-4">
            Fewsion — Brand Terms & Conditions
          </h2>
          <div className="text-[16px] md:text-[18px] leading-[1.8] text-[var(--muted2)] space-y-6">
            <div className="bg-[var(--card-bg)] p-4 rounded-lg border border-[var(--border)] space-y-2">
              <p><strong>Effective Date:</strong> [DATE]</p>
              <p><strong>Applies to:</strong> All businesses, agencies, or individuals registering on Fewsion as a "Brand" to source Creators and/or Editors for content, promotion, or collaboration campaigns.</p>
            </div>

            <div>
              <h3 className="text-xl font-bold mt-8 mb-4 text-[var(--text)] font-display">1. Definitions</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>"Fewsion" / "Platform"</strong> — the marketplace operated by Fewsion, connecting Brands, Creators, and Editors.</li>
                <li><strong>"Brand"</strong> — the business entity or individual registered to post Campaigns and engage Creators/Editors.</li>
                <li><strong>"Creator"</strong> — an individual delivering content/promotional services for a Campaign.</li>
                <li><strong>"Editor"</strong> — an individual delivering video/content editing services for a Campaign.</li>
                <li><strong>"Campaign"</strong> — a specific engagement, deliverable, or collaboration agreed between a Brand and a Creator/Editor via the Platform.</li>
                <li><strong>"Escrow"</strong> — funds deposited by the Brand and held by Fewsion's payment partner (Razorpay Route/Escrow) until deliverables are approved.</li>
                <li><strong>"Platform Fee"</strong> — the fee Fewsion charges the Brand for using the marketplace (structure per Section 9).</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mt-8 mb-4 text-[var(--text)] font-display">2. Eligibility & Registration</h3>
              <ul className="space-y-4">
                <li><strong>2.1</strong> You must be authorized to represent and bind the business you register (as founder, employee, or appointed agency) and be at least 18 years old.</li>
                <li><strong>2.2</strong> You must provide accurate business details — legal entity name, GSTIN (if applicable), contact information, and billing details — during registration.</li>
                <li><strong>2.3</strong> Fewsion reserves the right to verify business legitimacy (e.g., website, GST, business documents) before activating full Campaign posting privileges, and may reject or suspend registration where verification fails or fraud is suspected.</li>
                <li><strong>2.4</strong> Agencies registering on behalf of multiple client Brands must disclose this at registration and are responsible for each client Campaign's compliance with these Terms.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mt-8 mb-4 text-[var(--text)] font-display">3. Nature of Relationship</h3>
              <ul className="space-y-4">
                <li><strong>3.1</strong> Fewsion is a facilitator and marketplace, not a Creator agency, employer of Creators/Editors, or party to the Campaign agreement itself. Fewsion does not guarantee Creator/Editor availability, content quality outcomes, or campaign performance (reach, sales, engagement).</li>
                <li><strong>3.2</strong> Creators and Editors engaged through Fewsion are independent contractors, not Fewsion or Brand employees. The Brand is responsible for ensuring its use of their content/services complies with applicable advertising, labor, and consumer protection law.</li>
                <li><strong>3.3</strong> Fewsion's AI matching, Creator Score, and Editor Score are decision-support tools reflecting platform history — they are not a warranty of fit, quality, or Campaign success.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mt-8 mb-4 text-[var(--text)] font-display">4. Posting Campaigns & Briefs</h3>
              <ul className="space-y-4">
                <li><strong>4.1</strong> Brands must provide a clear, accurate Campaign brief — scope, deliverables, format, deadline, usage rights requested, and budget — before a Creator/Editor can accept.</li>
                <li><strong>4.2</strong> Material changes to scope after acceptance (added deliverables, extended usage rights, new formats) require mutual agreement and may incur additional cost, negotiated via the Platform.</li>
                <li><strong>4.3</strong> Brands may not use a Campaign brief to solicit free "trial" or "sample" work outside a paid, Escrow-backed engagement. Speculative/unpaid work requests are prohibited (see Section 10).</li>
                <li><strong>4.4</strong> Product-based Campaigns (barter/product-for-content) must be explicitly declared as such at posting, with an estimated product value; Fewsion's Commission structure for barter deals is disclosed separately at posting (Section 9.4).</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mt-8 mb-4 text-[var(--text)] font-display">5. Payments & Escrow</h3>
              <ul className="space-y-4">
                <li><strong>5.1</strong> All Campaign payments must be made through Fewsion's Escrow system (Razorpay Route). The Brand deposits the full Campaign amount (Creator/Editor payout + Fewsion Commission) into Escrow before a Creator/Editor begins work, unless a milestone-based structure is agreed for larger Campaigns.</li>
                <li><strong>5.2</strong> Funds are released from Escrow to the Creator/Editor upon: (a) Brand approval of final deliverables, or (b) Automatic release after [7] days if the Brand does not respond or raise a dispute on a submitted deliverable.</li>
                <li><strong>5.3 Approving deliverables:</strong> Brands are expected to review and respond (approve, request revision, or dispute) within [3] business days of submission. Delayed response does not extend the Creator's/Editor's payout timeline beyond the auto-release window.</li>
                <li><strong>5.4 Revisions:</strong> Brands are entitled to up to [2] rounds of reasonable revisions within the original agreed scope at no extra cost. Requests beyond original scope are treated as new deliverables requiring additional agreement.</li>
                <li>
                  <strong>5.5 Brand-initiated cancellation:</strong>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>Before Creator/Editor starts work: full refund to Brand, minus any non-refundable processing fee.</li>
                    <li>After work has started but before delivery: Brand pays a pro-rated amount for work completed, as reasonably assessed by Fewsion.</li>
                    <li>After delivery and approval: no refund; full payout is due to the Creator/Editor.</li>
                  </ul>
                </li>
                <li><strong>5.6</strong> Fewsion is not liable for payment delays caused by incorrect billing details provided by the Brand, bank holidays, or third-party payment processor outages.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mt-8 mb-4 text-[var(--text)] font-display">6. Content Usage Rights</h3>
              <ul className="space-y-4">
                <li><strong>6.1</strong> Usage rights granted to the Brand are determined by what is specified in the Campaign brief at the time of posting (e.g., organic social use only, paid ad usage, whitelisting, usage duration).</li>
                <li><strong>6.2</strong> Unless a Campaign brief explicitly states otherwise and the Creator/Editor agrees, usage rights are limited and non-exclusive — the underlying content is not transferred in full copyright to the Brand.</li>
                <li><strong>6.3</strong> If a Brand needs extended usage (longer duration, additional platforms, paid amplification, or full IP buyout) after Campaign completion, this must be negotiated and paid for separately via the Platform. Using delivered content beyond the agreed scope without additional payment is a breach of these Terms and may result in account suspension and liability for unauthorized use.</li>
                <li><strong>6.4</strong> Brands are solely responsible for ensuring any product claims, disclosures (e.g., #ad, ASCI/FTC-equivalent disclosure requirements), and legal compliance related to Campaign content are met — Fewsion does not review Campaign content for regulatory compliance.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mt-8 mb-4 text-[var(--text)] font-display">7. Dispute Resolution</h3>
              <ul className="space-y-4">
                <li><strong>7.1</strong> If a Brand believes delivered content does not match the agreed brief, a dispute must be raised via the Platform's dispute system within [3] business days of submission, with specific reasons and reference to the original brief.</li>
                <li><strong>7.2</strong> Fewsion will review evidence from both parties (brief, deliverable, communication logs) and issue a resolution regarding Escrow release — full release to Creator/Editor, partial release, or refund to Brand — based on reasonable assessment of whether the deliverable matches the agreed brief.</li>
                <li><strong>7.3</strong> Fewsion's dispute decision is made in good faith and is final for Escrow release purposes, though it does not waive either party's independent legal rights.</li>
                <li><strong>7.4</strong> Repeated unresolved disputes against a single Brand (pattern of rejecting reasonable deliverables) may result in a Brand-side trust flag, reduced Creator/Editor matching, or account review.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mt-8 mb-4 text-[var(--text)] font-display">8. Off-Platform Circumvention (Anti-Disintermediation)</h3>
              <ul className="space-y-4">
                <li><strong>8.1</strong> Brands agree not to arrange payment or repeat engagements directly with a Creator/Editor introduced via Fewsion, bypassing the Platform, for a period of [12] months from first introduction.</li>
                <li><strong>8.2</strong> Soliciting a Creator's/Editor's direct contact details for the purpose of avoiding Fewsion's Commission, or continuing a Fewsion-originated relationship off-platform, is a material breach.</li>
                <li><strong>8.3</strong> Consequences for confirmed circumvention include: immediate account suspension, forfeiture of Platform access, and liability for the Commission Fewsion would have earned on the diverted engagement(s), calculated at standard rates.</li>
                <li><strong>8.4</strong> This clause does not restrict a Brand from engaging a Creator/Editor the Brand had an existing, independently documented relationship with prior to any Fewsion introduction.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mt-8 mb-4 text-[var(--text)] font-display">9. Fees & Commission</h3>
              <ul className="space-y-4">
                <li><strong>9.1 Platform Commission:</strong> 10–15% of Campaign value, added to Brand's total payment (or deducted from Creator/Editor payout, per the fee model displayed at Campaign posting — confirm final structure).</li>
                <li><strong>9.2 Brand Premium (₹2,999/month, optional):</strong> priority Creator/Editor matching, advanced analytics, dedicated support — terms displayed at subscription.</li>
                <li><strong>9.3 AI Contract Generator (₹99/use, optional):</strong> convenience tool for generating Campaign-specific contracts; not a substitute for legal review (Section 13).</li>
                <li><strong>9.4 Barter/product-based Campaigns:</strong> Commission is calculated on the declared product value stated at posting; Brands must declare an honest market value — under-declaring product value to reduce Commission is a breach of these Terms.</li>
                <li><strong>9.5</strong> Subscription and processing fees are non-refundable except as required by law or stated in a separate refund policy.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mt-8 mb-4 text-[var(--text)] font-display">10. Prohibited Conduct</h3>
              <p className="mb-4">Brands agree NOT to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Request unpaid "trial," "sample," or speculative work outside a paid, Escrow-backed Campaign.</li>
                <li>Misrepresent Campaign scope, budget, or usage rights to secure a lower rate, then expand scope post-acceptance without additional payment.</li>
                <li>Harass, discriminate against, or pressure Creators/Editors, including over unrelated personal matters.</li>
                <li>Use Fewsion to solicit Creators/Editors for non-Campaign purposes (e.g., permanent hiring poaching without Platform-disclosed terms) in violation of Section 8.</li>
                <li>Publicly share a Creator's/Editor's private information, unreleased briefs, or Campaign details without consent, beyond what's needed for the Campaign.</li>
                <li>Submit false claims in a dispute to avoid paying for satisfactory delivered work.</li>
              </ul>
              <p className="mt-4">Violations may result in warnings, trust-score flags, restricted matching, suspension, or permanent termination at Fewsion's discretion.</p>
            </div>

            <div>
              <h3 className="text-xl font-bold mt-8 mb-4 text-[var(--text)] font-display">11. Data & Confidentiality</h3>
              <ul className="space-y-4">
                <li><strong>11.1</strong> Any confidential product information, unreleased campaign details, or briefs shared with a Creator/Editor are protected by an implicit duty of confidentiality on the Creator's/Editor's part; Fewsion is not a party to and does not enforce separate NDAs unless a formal NDA is executed and uploaded via the Platform.</li>
                <li><strong>11.2</strong> Brands are responsible for not sharing more confidential information than necessary for the Campaign brief.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mt-8 mb-4 text-[var(--text)] font-display">12. Indemnification</h3>
              <p>The Brand agrees to indemnify and hold harmless Fewsion, its founders, employees, and affiliates from claims, damages, liabilities, or legal costs arising from: (a) the Brand's product claims, advertising compliance failures, or regulatory violations, (b) the Brand's misuse of Creator/Editor content beyond agreed usage rights, (c) the Brand's breach of these Terms, or (d) the Brand's conduct toward a Creator, Editor, or other Platform user.</p>
            </div>

            <div>
              <h3 className="text-xl font-bold mt-8 mb-4 text-[var(--text)] font-display">13. Limitation of Liability & Disclaimers</h3>
              <ul className="space-y-4">
                <li><strong>13.1</strong> Fewsion provides the Platform "as is" and does not guarantee Campaign performance, Creator/Editor availability, or business outcomes (sales, reach, conversions) from any Campaign.</li>
                <li><strong>13.2</strong> To the maximum extent permitted by law, Fewsion's total liability to a Brand for claims arising from Platform use is limited to the total Commission fees paid by that Brand in the preceding 6 months, or ₹10,000, whichever is greater.</li>
                <li><strong>13.3</strong> Fewsion is not liable for indirect, incidental, or consequential damages, including lost profits, arising from Campaign outcomes, Creator/Editor conduct, or third-party payment processor issues.</li>
                <li><strong>13.4</strong> The AI Contract Generator and matching algorithm are tools to assist decision-making, not legal advice or a guarantee of Creator/Editor suitability.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mt-8 mb-4 text-[var(--text)] font-display">14. Termination & Governing Law</h3>
              <ul className="space-y-4">
                <li><strong>14.1</strong> Either party may terminate the Brand account at any time via the Platform. Active Campaigns must be completed, formally cancelled, or resolved through dispute process before account closure is finalized.</li>
                <li><strong>14.2</strong> Fewsion may suspend or terminate Brand accounts immediately for breach of Sections 8, 10, or confirmed fraud/non-payment.</li>
                <li><strong>14.3</strong> These Terms are governed by the laws of India. Disputes not resolved via Platform mechanisms shall be subject to arbitration under the Arbitration and Conciliation Act, 1996, seated in [City], with courts of [City] having exclusive jurisdiction for matters not covered by arbitration.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mt-8 mb-4 text-[var(--text)] font-display">15. Changes to Terms</h3>
              <p>Fewsion may update these Terms periodically. Material changes will be notified via the Platform or registered email at least [7] days before taking effect. Continued use after the effective date constitutes acceptance.</p>
            </div>

            <div>
              <h3 className="text-xl font-bold mt-8 mb-4 text-[var(--text)] font-display">16. Contact</h3>
              <p>For disputes, billing questions, or legal notices: <a href="mailto:legal@getfewsion.com" className="text-[var(--primary)] hover:underline">legal@getfewsion.com</a> / support contact</p>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
}
