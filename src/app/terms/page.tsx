import type { Metadata } from 'next'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import Card from '@/components/ui/card'
import { WebPageJsonLd } from '@/components/seo/page-json-ld'
import { appConfig } from '@/lib/config'
import { languageAlternatesForPath } from '@/lib/i18n'

export const metadata: Metadata = {
  title: 'Magic-Headshot Terms for AI Headshots, Professional Photos, and LinkedIn Photos',
  description:
    'Review Magic-Headshot terms for AI headshot generation, uploaded photos, payments, refunds, commercial use rights, account rules, and acceptable use.',
  keywords: [
    'Magic-Headshot terms',
    'AI headshot terms',
    'commercial use rights',
  ],
  alternates: {
    canonical: '/terms',
    languages: languageAlternatesForPath('/terms'),
  },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <WebPageJsonLd
        locale="en"
        path="/terms"
        title="Magic-Headshot Terms for AI Headshots, Professional Photos, and LinkedIn Photos"
        description="Review Magic-Headshot terms for AI headshot generation, uploaded photos, payments, refunds, commercial use rights, account rules, and acceptable use."
      />
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Magic-Headshot AI Headshot Terms of Service</h1>
          
          <div className="space-y-6 text-slate-600">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing or using {appConfig.name}, you agree to be bound by these 
                Terms of Service. If you do not agree to these Terms, do not use the Service.
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">2. Description of Service</h2>
              <p>
                {appConfig.name} provides AI-powered professional headshot generation services. 
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
                Generated Headshots: You own all rights to the AI-generated headshots 
                you create using our Service. You may use them for personal and commercial purposes.
              </p>
              <p className="mt-3">
                Our IP: We retain ownership of our AI technology, logos, trademarks, 
                and any pre-existing intellectual property.
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">6. Payment Terms</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>All prices are in USD unless otherwise stated</li>
                <li>Payments are processed securely through PayPal</li>
                <li>One-time payments grant permanent access to generated content</li>
                <li>All sales are final unless otherwise stated in our refund policy</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">7. Refund Policy</h2>
              <p className="mb-3">
                We offer a 30-day money-back guarantee. If you are not satisfied with your 
                headshots, contact us within 30 days for a full refund.
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">8. Contact</h2>
              <p>
                For questions about these Terms, please contact us at: support@mail.magic-headshot.com
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
