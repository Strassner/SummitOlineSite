/**
 * PLACEHOLDER legal copy. These are starting-point templates only, so have a qualified attorney review
 * and replace them before launch (especially the waiver, assumption of risk and refund terms).
 */
export interface LegalDoc {
  slug: string;
  title: string;
  updated: string;
  sections: { heading: string; body: string[] }[];
}

export const LEGAL_DOCS: LegalDoc[] = [
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    updated: "2026-01-01",
    sections: [
      { heading: "Information we collect", body: ["We collect information you provide when you create an account, register an athlete, book training, purchase a membership or contact us: names, email, phone number, athlete details (including age) and payment-related details handled by our payment processor.", "We also collect basic usage data (pages visited, device and browser) through analytics tools to improve the website."] },
      { heading: "Children's information", body: ["Many of our athletes are minors. Accounts are created and managed by a parent or legal guardian, and we collect athlete information only from the parent or guardian."] },
      { heading: "How we use information", body: ["To provide training, process bookings and payments, send confirmations and reminders, manage memberships, improve our services and, with your consent, send newsletters and marketing."] },
      { heading: "Sharing", body: ["We do not sell personal information. We share it only with service providers that help us run the business (payments, email, scheduling, analytics) or when required by law."] },
      { heading: "Your choices", body: ["You may request access to, correction of or deletion of your information, and unsubscribe from marketing at any time, by contacting us."] },
    ],
  },
  {
    slug: "terms-and-conditions",
    title: "Terms & Conditions",
    updated: "2026-01-01",
    sections: [
      { heading: "Using this site", body: ["By using this website, creating an account or booking training you agree to these terms. You must be at least 18 to create an account; athletes under 18 participate under a parent or guardian's account."] },
      { heading: "Bookings & memberships", body: ["Sessions are subject to availability and capacity. Memberships renew automatically on the billing frequency shown at purchase until cancelled. Session credits, expiry and rollover rules are described for each package."] },
      { heading: "Member content", body: ["Member-only videos and resources are licensed for personal use by active members and may not be copied, shared or redistributed."] },
      { heading: "Conduct", body: ["Athletes and parents are expected to behave respectfully toward coaches and other participants. Summit Line Academy may remove any participant for unsafe or disruptive conduct without refund."] },
      { heading: "Liability", body: ["Football training involves inherent risk of injury. See the Waiver / Release. To the fullest extent permitted by law, Summit Line Academy is not liable for indirect or consequential damages."] },
    ],
  },
  {
    slug: "cancellation-policy",
    title: "Cancellation Policy",
    updated: "2026-01-01",
    sections: [
      { heading: "Cancelling a session", body: ["Sessions may be cancelled or rescheduled from your account up to 24 hours before the start time at no charge. Credits used are returned and card payments are refunded in accordance with the Refund Policy."] },
      { heading: "Late cancellations & no-shows", body: ["Cancellations inside 24 hours and no-shows may forfeit the session or credit."] },
      { heading: "Cancelling a membership", body: ["Memberships may be cancelled at any time from your account. Cancellation takes effect at the end of the current billing period."] },
      { heading: "Weather & coach cancellations", body: ["If we cancel for weather, safety or coach availability, you'll be offered a reschedule or a full refund/credit."] },
    ],
  },
  {
    slug: "refund-policy",
    title: "Refund Policy",
    updated: "2026-01-01",
    sections: [
      { heading: "Sessions", body: ["Single-session purchases cancelled at least 24 hours in advance are refunded in full to the original payment method."] },
      { heading: "Memberships", body: ["Membership fees are non-refundable once a billing period has started, except where required by law. Unused credits do not carry cash value."] },
      { heading: "Camps & clinics", body: ["Camp and clinic registrations are refundable up to 7 days before the event; after that a credit toward a future event may be offered."] },
    ],
  },
  {
    slug: "waiver",
    title: "Waiver / Release",
    updated: "2026-01-01",
    sections: [
      { heading: "Liability waiver, assumption of risk & photo/video release", body: ["Participation in football training involves inherent risks, including serious injury. Before participating, a parent or legal guardian must complete the digital Summit Line Academy waiver, which includes: a liability waiver, an assumption of risk, a photo/video release, and acknowledgment of our cancellation, refund and terms policies.", "Complete the secure form below once per athlete."] },
    ],
  },
];
