import type { Metadata } from 'next'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import Card from '@/components/ui/card'
import { WebPageJsonLd } from '@/components/seo/page-json-ld'
import { languageAlternatesForPath } from '@/lib/i18n'

export const metadata: Metadata = {
  title: 'Magic-Headshot Refund Policy for AI Headshots and Professional Photos',
  description:
    'Read Magic-Headshot refund eligibility, unused credit handling, processing times, and support steps for AI headshot purchases and professional portraits.',
  keywords: [
    'Magic-Headshot refund',
    'AI headshot refund policy',
    'unused credit refund',
  ],
  alternates: {
    canonical: '/refund',
    languages: languageAlternatesForPath('/refund'),
  },
}

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <WebPageJsonLd
        locale="en"
        path="/refund"
        title="Magic-Headshot Refund Policy for AI Headshots and Professional Photos"
        description="Read Magic-Headshot refund eligibility, unused credit handling, processing times, and support steps for AI headshot purchases and professional portraits."
      />
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="mb-8 text-3xl font-bold text-slate-900">Magic-Headshot AI Headshot Refund Policy</h1>

          <div className="space-y-6 text-slate-600">
            <Card className="p-6">
              <h2 className="mb-3 text-xl font-semibold text-slate-900">30-Day Satisfaction Guarantee</h2>
              <p>
                We want you to be happy with your AI headshots. If you are not satisfied with your purchase, you may request a refund within 30 days of the purchase date, subject to the eligibility terms below.
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="mb-3 text-xl font-semibold text-slate-900">How to Request a Refund</h2>
              <p className="mb-3">To request a refund, email us at support@mail.magic-headshot.com and include:</p>
              <ol className="list-decimal space-y-2 pl-6">
                <li>The email address used for your Magic-Headshot account.</li>
                <li>Your order ID, PayPal transaction ID, Stripe receipt, or other payment reference.</li>
                <li>The plan purchased and purchase date.</li>
                <li>A brief description of the issue so we can improve the service.</li>
              </ol>
            </Card>

            <Card className="p-6">
              <h2 className="mb-3 text-xl font-semibold text-slate-900">Refund Eligibility</h2>
              <p className="mb-3">Refunds may be approved when:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>The request is made within 30 days of purchase.</li>
                <li>The purchase has not already been refunded, charged back, or reversed.</li>
                <li>The request is from the account owner or payment owner.</li>
                <li>The account does not show abuse, fraud, excessive automated usage, or violation of our Terms.</li>
                <li>The request is consistent with our one-refund-per-customer policy.</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h2 className="mb-3 text-xl font-semibold text-slate-900">Non-Eligible Situations</h2>
              <p className="mb-3">Refunds may be declined if:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>More than 30 days have passed since the purchase.</li>
                <li>You have previously received a refund from us.</li>
                <li>The account shows signs of fraud, abuse, shared access, or policy violations.</li>
                <li>You cannot provide enough information for us to locate the transaction.</li>
                <li>The payment processor, bank, or card network has already reversed or disputed the payment.</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h2 className="mb-3 text-xl font-semibold text-slate-900">Credits and Generated Images After Refund</h2>
              <p>
                If a refund is approved, unused credits from the refunded purchase may be removed from your account. We may also disable access to generation results associated with the refunded purchase where appropriate.
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="mb-3 text-xl font-semibold text-slate-900">Processing Time</h2>
              <p>
                Approved refunds are submitted to the original payment method when possible. Refunds are usually processed within 5-10 business days after approval, but your bank, card issuer, PayPal, Stripe, or other payment provider may take additional time.
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="mb-3 text-xl font-semibold text-slate-900">Chargebacks and Disputes</h2>
              <p>
                If you open a chargeback or payment dispute, we may be unable to process a direct refund while the dispute is pending. Please contact us first so we can try to resolve the issue quickly.
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="mb-3 text-xl font-semibold text-slate-900">Contact Us</h2>
              <p>
                Email: support@mail.magic-headshot.com<br />
                Support hours: Monday-Friday, 9 AM-6 PM EST
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
