import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import Card from '@/components/ui/card'

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Refund Policy</h1>
          
          <div className="space-y-6 text-slate-600">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">30-Day Money-Back Guarantee</h2>
              <p>
                We want you to be completely satisfied with your AI headshots. If you&apos;re not happy 
                with the results, we offer a full refund within 30 days of your purchase.
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">How to Request a Refund</h2>
              <p className="mb-3">To request a refund:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Email us at postmaster@magic-headshot.com</li>
                <li>Include your order number and email address</li>
                <li>Briefly explain why you&apos;re not satisfied (optional)</li>
                <li>We&apos;ll process your refund within 5-7 business days</li>
              </ol>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">Refund Eligibility</h2>
              <p className="mb-3">Refunds are available under the following conditions:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Requested within 30 days of purchase</li>
                <li>First-time customer (one refund per customer)</li>
                <li>Order was not already refunded</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">Non-Eligible Situations</h2>
              <p className="mb-3">Refunds may not be available if:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>More than 30 days have passed since purchase</li>
                <li>You&apos;ve previously received a refund from us</li>
                <li>Account shows signs of abuse</li>
                <li>Payment was made through a non-refundable method</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">Processing Time</h2>
              <p>
                Once your refund is approved, the amount will be credited back to your original 
                payment method within 5-7 business days. Please note that your bank may take 
                additional time to process the refund.
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">Contact Us</h2>
              <p className="mb-3">
                If you have any questions about our refund policy, please contact us:
              </p>
              <p>
                Email: postmaster@magic-headshot.com<br />
                Support Hours: Monday - Friday, 9 AM - 6 PM EST
              </p>
            </Card>

            <p className="text-sm text-slate-500 mt-8">
              Last Updated: June 19, 2024
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
