'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import Button from '@/components/ui/button'
import Card from '@/components/ui/card'
import AuthModal from '@/components/auth/auth-modal'
import { 
  Camera, 
  Zap, 
  Shield, 
  Download, 
  Clock, 
  Sparkles,
  Check,
  Star,
  Users,
  Linkedin,
  Instagram,
  Twitter
} from 'lucide-react'

const features = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Lightning Fast',
    description: 'Get your professional headshots in just 3 minutes. No waiting days for a photographer.',
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: '30 Unique Styles',
    description: 'From corporate to creative, choose from 30 different professional styles.',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Privacy First',
    description: 'Your photos are deleted after generation. Your data stays yours.',
  },
  {
    icon: <Download className="w-6 h-6" />,
    title: 'HD Downloads',
    description: 'Get high-resolution 1024x1024 images perfect for any platform.',
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: '24/7 Available',
    description: 'Generate headshots anytime, anywhere. No appointment needed.',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: '10,000+ Users',
    description: 'Trusted by professionals worldwide for their personal branding.',
  },
]

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Product Manager at Google',
    content: 'Got my LinkedIn headshot done in 3 minutes. The quality is insane - looks like I hired a professional photographer!',
    avatar: 'SC',
  },
  {
    name: 'Marcus Johnson',
    role: 'Startup Founder',
    content: 'Needed headshots for our team page. This saved us hundreds of dollars and so much time. Highly recommend!',
    avatar: 'MJ',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Marketing Director',
    content: 'The variety of styles is amazing. I found the perfect look for my personal brand across all platforms.',
    avatar: 'ER',
  },
]

const styles = [
  { name: 'Corporate Professional', category: 'Business' },
  { name: 'Creative Studio', category: 'Artistic' },
  { name: 'Warm Natural', category: 'Lifestyle' },
  { name: 'Bold & Modern', category: 'Contemporary' },
  { name: 'Classic Portrait', category: 'Traditional' },
  { name: 'Urban Edge', category: 'Street' },
]

export default function HomePage() {
  const [showAuthModal, setShowAuthModal] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-200 rounded-full blur-3xl opacity-30" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                AI-Powered Professional Headshots
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight">
                Upload a Selfie,{' '}
                <span className="gradient-text">Get 30 Styles</span>
              </h1>
              
              <p className="mt-6 text-xl text-slate-600 max-w-xl mx-auto lg:mx-0">
                Skip the $500 photographer. Get professional AI headshots in 3 minutes for just $9.90. Perfect for LinkedIn, Instagram, and dating apps.
              </p>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" onClick={() => setShowAuthModal(true)}>
                  <Camera className="w-5 h-5 mr-2" />
                  Generate Headshots - $9.90
                </Button>
                <Link href="#examples">
                  <Button variant="secondary" size="lg">
                    See Examples
                  </Button>
                </Link>
              </div>
              
              <div className="mt-8 flex items-center gap-6 justify-center lg:justify-start text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-accent-500" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-accent-500" />
                  1024x1024 HD
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <div className="grid grid-cols-3 gap-3">
                  {['bg-gradient-to-br from-blue-400 to-blue-600', 'bg-gradient-to-br from-purple-400 to-purple-600', 'bg-gradient-to-br from-pink-400 to-pink-600'].map((bg, i) => (
                    <div 
                      key={i}
                      className={`aspect-square rounded-2xl ${bg} shadow-xl animate-pulse-slow`}
                      style={{ animationDelay: `${i * 200}ms` }}
                    />
                  ))}
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-accent-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">30 Styles Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading">How It Works</h2>
            <p className="section-subheading mx-auto mt-4">
              Three simple steps to professional headshots
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', icon: <Camera className="w-8 h-8" />, title: 'Upload Your Selfie', desc: 'Take or upload 1-3 selfies with good lighting and a clear view of your face.' },
              { step: '2', icon: <Sparkles className="w-8 h-8" />, title: 'AI Magic Happens', desc: 'Our AI analyzes your photos and generates 30 professional styles in 3 minutes.' },
              { step: '3', icon: <Download className="w-8 h-8" />, title: 'Download & Shine', desc: 'Pick your favorites and download in high resolution for any platform.' },
            ].map((item, i) => (
              <div key={i} className="relative">
                <Card className="p-8 text-center h-full">
                  <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary-600">
                    {item.icon}
                  </div>
                  <div className="absolute top-4 right-4 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600">{item.desc}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading">Why Choose Us</h2>
            <p className="section-subheading mx-auto mt-4">
              Everything you need for the perfect professional headshot
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card key={i} hover className="p-6">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4 text-primary-600">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Style Examples */}
      <section id="examples" className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">30 Styles to Match Your Brand</h2>
            <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
              From corporate polish to creative flair, find the perfect headshot style for every platform and purpose.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {styles.map((style, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-square rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-700 group-hover:border-primary-500 transition-colors overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-slate-600 rounded-full" />
                  </div>
                </div>
                <p className="mt-2 text-sm font-medium text-center">{style.name}</p>
                <p className="text-xs text-slate-500 text-center">{style.category}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" onClick={() => setShowAuthModal(true)}>
              <Sparkles className="w-5 h-5 mr-2" />
              Try All 30 Styles - $9.90
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading">Loved by Professionals</h2>
            <p className="section-subheading mx-auto mt-4">
              Join thousands of happy users who upgraded their professional image
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <Card key={i} hover className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-600 mb-6">&ldquo;{testimonial.content}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{testimonial.name}</p>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading">Simple, Transparent Pricing</h2>
            <p className="section-subheading mx-auto mt-4">
              No subscriptions. No hidden fees. Pay only for what you need.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Basic</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-slate-900">$9.90</span>
                <span className="text-slate-500">/one-time</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-accent-500" /> 30 unique styles
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-accent-500" /> 1024x1024 resolution
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-accent-500" /> Unlimited downloads
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-accent-500" /> Commercial use
                </li>
              </ul>
              <Button className="w-full" onClick={() => setShowAuthModal(true)}>
                Get Started
              </Button>
            </Card>

            <Card className="p-8 border-2 border-primary-500 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Most Popular
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Pro</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-slate-900">$19.90</span>
                <span className="text-slate-500">/one-time</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-accent-500" /> 100 unique styles
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-accent-500" /> 2048x2048 resolution
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-accent-500" /> Priority processing
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-accent-500" /> All Basic features
                </li>
              </ul>
              <Button className="w-full" onClick={() => setShowAuthModal(true)}>
                Go Pro
              </Button>
            </Card>

            <Card className="p-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Enterprise</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-slate-900">$99</span>
                <span className="text-slate-500">/one-time</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-accent-500" /> Custom style training
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-accent-500" /> API access
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-accent-500" /> Dedicated support
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-accent-500" /> Team management
                </li>
              </ul>
              <Button variant="secondary" className="w-full" onClick={() => setShowAuthModal(true)}>
                Contact Sales
              </Button>
            </Card>
          </div>

          <p className="text-center text-slate-500 mt-8">
            Compare all features <Link href="/pricing" className="text-primary-600 hover:underline">here</Link>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Upgrade Your Professional Image?
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
            Join 10,000+ professionals who trust HeadshotAI for their personal branding needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary-600 hover:bg-primary-50 shadow-xl"
              onClick={() => setShowAuthModal(true)}
            >
              <Camera className="w-5 h-5 mr-2" />
              Generate Headshots Now
            </Button>
            <Link href="/pricing">
              <Button 
                size="lg" 
                variant="ghost" 
                className="text-white hover:bg-white/10"
              >
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
