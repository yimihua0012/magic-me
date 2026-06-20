'use client'

import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import Card from '@/components/ui/card'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Terms of Service</h1>
          
          <div className="space-y-6 text-slate-600">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing or using HeadshotAI (&quot;the Service&quot;), you agree to be bound by these 
                Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, do not use the Service.
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">2. Description of Service</h2>
              <p>
                HeadshotAI provides AI-powered professional headshot generation services. 
                Users can upload selfies and receive AI-generated professional headshots in 
                various styles.
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">3. User Accounts</h2>
              <p className="mb-3">To use our Service, you must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Be at least 18 years old</li>
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account</li>
                <li>Notify us of any unauthorized use</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">4. Acceptable Use</h2>
              <p className="mb-3">You agree NOT to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Upload photos of others without their consent</li>
                <li>Use the Service for illegal purposes</li>
                <li>Generate harmful, offensive, or inappropriate content</li>
                <li>Attempt to breach our AI systems</li>
                <li>Resell or redistribute generated content</li>
                <li>Upload low-quality or inappropriate photos</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">5. Intellectual Property</h2>
              <p className="mb-3">
                <strong>Generated Headshots:</strong> You own all rights to the AI-generated headshots 
                you create using our Service. You may use them for personal and commercial purposes, 
                including LinkedIn, social media, websites, and marketing materials.
              </p>
              <p className="mt-3">
                <strong>Our IP:</strong> We retain ownership of our AI technology, logos, trademarks, 
                and any pre-existing intellectual property.
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">6. Payment Terms</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>All prices are in USD unless otherwise stated</li>
                <li>Payments are processed securely through Stripe</li>
                <li>One-time payments grant permanent access to generated content</li>
                <li>All sales are final unless otherwise stated in our refund policy</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">7. Refund Policy</h2>
              <p className="mb-3">
                We offer a 30-day money-back guarantee. If you&apos;re not satisfied with your 
                headshots, contact us within 30 days for a full refund.
              </p>
              <p>
                Refunds are not available if:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>More than 30 days have passed since purchase</li>
                <li>You have previously received a refund</li>
                <li>Abuse of the refund policy</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">8. Photo Guidelines</h2>
              <p className="mb-3">For best results and compliance:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Upload clear, front-facing selfies</li>
                <li>Ensure good lighting conditions</li>
                <li>Only upload photos where you have rights</li>
                <li>Do not upload photos containing multiple people without consent</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">9. Service Availability</h2>
              <p>
                We strive to provide uninterrupted service, but we do not guarantee 100% uptime. 
                We reserve the right to modify, suspend, or discontinue the Service at any time 
                with reasonable notice.
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">10. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, HeadshotAI shall not be liable for any 
                indirect, incidental, special, consequential, or punitive damages resulting from 
                your use of or inability to use the Service.
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">11. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless HeadshotAI and its affiliates from any 
                claims, damages, or expenses arising from your violation of these Terms or your 
                use of the Service.
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">12. Governing Law</h2>
              <p>
                These Terms shall be governed by the laws of the United States, without regard 
                to conflict of law principles.
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">13. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify users 
                of significant changes via email or prominent notice on our website.
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">14. Contact</h2>
              <p>
                For questions about these Terms, please contact us at:<br />
                <span className="text-primary-600">legal@headshotai.com</span>
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
