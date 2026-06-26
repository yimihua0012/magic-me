import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import Card from '@/components/ui/card'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Privacy Policy</h1>
          
          <div className="space-y-6 text-slate-600">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">1. Information We Collect</h2>
              <p className="mb-3">
                We collect information you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Account information (name, email, password) when you register</li>
                <li>Photos you upload for AI headshot generation</li>
                <li>Payment information processed through PayPal</li>
                <li>Communications and correspondence</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">2. How We Use Your Information</h2>
              <p className="mb-3">We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send you technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">3. Photo Handling</h2>
              <p className="mb-3">
                <strong>Your photos are your property.</strong> Here&apos;s how we handle them:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Uploaded photos are used solely for AI headshot generation</li>
                <li>Photos are automatically deleted after processing is complete</li>
                <li>We do not sell, share, or use your photos for any other purpose</li>
                <li>Generated headshots are yours to use commercially</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">4. Information Sharing</h2>
              <p>We do not sell, trade, or otherwise transfer your personal information to third parties except:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>With service providers (PayPal for payments, Supabase for auth)</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">5. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information, 
                including encryption, secure servers, and regular security assessments.
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">6. Cookies</h2>
              <p className="mb-3">We use cookies and similar technologies to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Remember your preferences and settings</li>
                <li>Understand how you use our website</li>
                <li>Provide essential functionality</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">7. Your Rights</h2>
              <p className="mb-3">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to certain processing</li>
                <li>Data portability</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">8. Children&apos;s Privacy</h2>
              <p>
                Our service is not intended for users under 18 years of age. We do not knowingly 
                collect personal information from children under 18.
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">9. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any 
                changes by posting the new policy on this page and updating the &quot;Last Updated&quot; date.
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">10. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:<br />
                <span className="text-primary-600">postmaster@magic-headshot.com</span>
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
