import type { Metadata } from 'next'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import Card from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Magic-Headshot Privacy Policy for AI Headshots, Professional Photos, and AI Portraits',
  description:
    'Read how Magic-Headshot collects, uses, stores, and protects account data, uploaded photos, generated AI headshots, payment metadata, and support records.',
  keywords: [
    'Magic-Headshot privacy',
    'AI headshot privacy policy',
    'uploaded photo privacy',
  ],
  alternates: {
    canonical: '/privacy',
  },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="mb-8 text-3xl font-bold text-slate-900">Magic-Headshot AI Headshot Privacy Policy</h1>

          <div className="space-y-6 text-slate-600">
            <Card className="p-6">
              <h2 className="mb-3 text-xl font-semibold text-slate-900">1. Information We Collect</h2>
              <p className="mb-3">We collect information needed to provide Magic-Headshot, including:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Account information such as name, email address, and authentication data.</li>
                <li>Photos you upload and AI-generated headshots created from those photos.</li>
                <li>Generation history, selected styles, credit usage, and support requests.</li>
                <li>Payment status, order IDs, and transaction metadata from payment providers. We do not store full card numbers.</li>
                <li>Basic device, usage, cookie, and analytics data used to operate and improve the service.</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h2 className="mb-3 text-xl font-semibold text-slate-900">2. How We Use Information</h2>
              <p className="mb-3">We use your information to:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Create and manage your account.</li>
                <li>Generate AI headshots from the photos and styles you select.</li>
                <li>Process payments, credits, refunds, and purchase confirmations.</li>
                <li>Send service emails such as payment confirmations, generation completion notices, and credit expiration reminders.</li>
                <li>Prevent fraud, abuse, duplicate credit deductions, and unauthorized access.</li>
                <li>Maintain, secure, troubleshoot, and improve the service.</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h2 className="mb-3 text-xl font-semibold text-slate-900">3. Photo Handling and Storage</h2>
              <p className="mb-3">
                Your uploaded photos and generated headshots remain your content. We use uploaded photos only to provide the AI headshot service you request through our specialized portrait-generation model and related processing infrastructure.
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Uploaded input photos may be stored in private Supabase Storage or generation records for processing, troubleshooting, abuse prevention, and support.</li>
                <li>Generated headshots are stored in Supabase Storage so you can view and download your results.</li>
                <li>Generated image URLs may be accessible to anyone who has the direct file link. Do not share result links publicly unless you want others to view them.</li>
                <li>We do not sell your uploaded photos or generated headshots.</li>
                <li>We do not use your uploaded photos or generated headshots to train our own AI models.</li>
                <li>You may request deletion of your uploaded photos, generated headshots, account, or generation history by contacting us.</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h2 className="mb-3 text-xl font-semibold text-slate-900">4. Third-Party Service Providers</h2>
              <p className="mb-3">We share data with service providers only as needed to operate the service, including:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Supabase for authentication, database, and file storage.</li>
                <li>PayPal, Stripe, or other payment processors for payments and refunds.</li>
                <li>Resend for transactional email delivery.</li>
                <li>Hosting, analytics, logging, and security providers used to run the website.</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h2 className="mb-3 text-xl font-semibold text-slate-900">5. Data Retention</h2>
              <p className="mb-3">
                We keep personal data only for as long as reasonably needed for the purposes described in this policy, unless a longer retention period is required by law, tax, accounting, security, or dispute-resolution obligations.
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Account, credit, payment, and generation records may be kept while your account is active and as needed for business records.</li>
                <li>Uploaded input photos are intended to be retained for a shorter period than generated headshots.</li>
                <li>Generated headshots may be retained so you can access your results, unless you request deletion or your account is deleted.</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h2 className="mb-3 text-xl font-semibold text-slate-900">6. Cookies and Analytics</h2>
              <p className="mb-3">We use cookies and similar technologies to:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Keep you signed in and provide essential account functionality.</li>
                <li>Remember cookie consent and basic preferences.</li>
                <li>Understand site usage and improve performance.</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h2 className="mb-3 text-xl font-semibold text-slate-900">7. Data Security</h2>
              <p>
                We use reasonable technical and organizational safeguards to protect personal information, including access controls, secure service providers, and encrypted transport where supported. No online service can guarantee absolute security.
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="mb-3 text-xl font-semibold text-slate-900">8. Your Rights</h2>
              <p className="mb-3">Depending on your location, you may have rights to:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Access personal information we hold about you.</li>
                <li>Correct inaccurate information.</li>
                <li>Request deletion of your data.</li>
                <li>Object to or restrict certain processing.</li>
                <li>Request a portable copy of certain data.</li>
                <li>Withdraw consent where processing is based on consent.</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h2 className="mb-3 text-xl font-semibold text-slate-900">9. Children&apos;s Privacy</h2>
              <p>
                Magic-Headshot is not intended for users under 18 years old. We do not knowingly collect personal information from children under 18.
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="mb-3 text-xl font-semibold text-slate-900">10. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Updates will be posted on this page with a revised &quot;Last Updated&quot; date.
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="mb-3 text-xl font-semibold text-slate-900">11. Contact Us</h2>
              <p>
                If you have questions or requests about this Privacy Policy, contact us at:<br />
                <span className="text-primary-600">support@mail.magic-headshot.com</span>
              </p>
            </Card>

            <p className="mt-8 text-sm text-slate-500">
              Last Updated: June 27, 2026
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
