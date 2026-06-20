# AI Headshot Generator - Product Requirements Document

## 1. Product Overview

**One-line description:** Upload 1 selfie, get 30 professional AI headshot styles in 3 minutes.

**Core value proposition:** Professional headshots for $9.90 instead of $200-$500 for a photographer, delivered in 3 minutes instead of days.

### Target Users
- Overseas professionals (LinkedIn profile pictures)
- Social media power users (Instagram, TikTok)
- Online dating app users (Tinder, Bumble)
- Freelancers and entrepreneurs (personal branding)

### Pricing Tiers
| Plan | Price | Features |
|------|-------|----------|
| Basic | $9.90/one-time | 30 styles, 1024x1024 resolution |
| Pro | $19.90/one-time | 100 styles, 2048x2048 resolution |
| Enterprise | $99/one-time | Custom style training + API access (post-MVP) |

## 2. Core Features

### 2.1 User Roles
| Role | Registration | Core Permissions |
|------|--------------|------------------|
| Guest | None | Browse landing page, limited generation (3 previews) |
| Registered User | Email + Google OAuth | Full generation, download, payment |

### 2.2 Feature Modules
1. **Landing Page**: Hero, features, pricing, testimonials, CTA
2. **Auth Modal**: Email registration/login, Google OAuth
3. **Upload Page**: Photo upload with face detection, guidance
4. **Generation Page**: Real-time progress, style previews
5. **Dashboard**: View past generations, download, reorder
6. **Payment Flow**: Stripe checkout integration

### 2.3 Page Structure
| Page | Route | Purpose |
|------|-------|---------|
| Landing | `/` | Marketing page with SEO |
| Upload | `/upload` | Photo upload interface |
| Generate | `/generate/[id]` | Generation progress & results |
| Dashboard | `/dashboard` | Past generations management |
| Pricing | `/pricing` | Plan selection & payment |

## 3. Core User Flows

### Registration Flow
```
Landing → "Generate Headshots" CTA → Auth Modal → 
Email Register or Google Login → Email Verification (if email) →
Welcome Tutorial (3 steps) → Upload Page
```

### Photo Upload Flow
```
Upload Page → Drag/Drop or Click →
File Validation (type, size) → Face Detection (face-api.js) →
Validation Result → 
  Fail: Show specific error message with retry
  Pass: Green checkmark animation → "Perfect!" → Continue
```

### Generation Flow
```
Upload Complete → Select Plan → Stripe Payment →
Redirect to Generation Page → Real-time Progress (0-100%) →
30 Style Thumbnails Appear → Click to expand/download →
Email Notification when complete
```

### Download Flow
```
Results Grid → Select single or batch → 
Download Original Quality → 
Stripe receipt → Email confirmation
```

## 4. User Interface Design

### 4.1 Design Style
- **Aesthetic**: Clean, professional, trustworthy - "Premium but Accessible"
- **Color Palette**:
  - Primary: Deep Indigo `#4F46E5`
  - Secondary: Slate Gray `#64748B`
  - Accent: Emerald Green `#10B981` (for success states)
  - Background: Pure White `#FFFFFF` with subtle gray sections `#F8FAFC`
  - Text: Slate `#1E293B` primary, `#64748B` secondary
- **Typography**: 
  - Headlines: Inter (700 weight) - modern, professional
  - Body: Inter (400/500 weight)
- **Button Style**: Rounded corners (rounded-xl), subtle shadows, smooth hover transitions
- **Icon Style**: Lucide icons - clean, consistent line icons

### 4.2 Component Specifications

#### Navigation Bar
- Logo left, nav links center, CTA button right
- Sticky on scroll with blur backdrop
- Mobile: hamburger menu

#### Hero Section
- Large headline with gradient text effect
- Subheadline explaining value prop
- Dual CTA: "Generate Headshots - $9.90" + "See Examples"
- Floating headshot mockup images

#### Upload Zone
- Dashed border with animated hover state
- Drag-drop active state: border becomes solid indigo
- Progress bar during upload
- Thumbnail grid for uploaded photos (1-3)

#### Face Detection Feedback
- Real-time validation messages
- Success: Green checkmark with bounce animation
- Error: Red X with specific guidance text

#### Style Grid
- 6x5 grid of style previews
- Hover: Scale up slightly, show style name
- Click: Opens lightbox with full-size preview

#### Pricing Cards
- Three tiers side-by-side (desktop)
- Highlighted "Best Value" card
- Feature checklist with checkmarks
- CTA button matching tier

### 4.3 Responsiveness
- Desktop-first design
- Breakpoints: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)
- Mobile navigation collapses to hamburger
- Pricing cards stack vertically on mobile
- Upload zone adapts to mobile camera

## 5. SEO Requirements

### Meta Tags
- Title: "AI Headshot Generator - Professional Photos in 3 Minutes | HeadshotAI"
- Description: "Upload a selfie and get 30 professional AI headshot styles in minutes. Perfect for LinkedIn, Instagram, dating apps. Starting at $9.90."
- Open Graph tags for social sharing

### Performance
- Core Web Vitals optimized
- Next.js Image optimization
- Lazy loading for below-fold content
- Target: LCP < 2.5s, FID < 100ms, CLS < 0.1

## 6. Technical Stack

### Frontend
- Next.js 14 (App Router)
- Tailwind CSS
- Lucide React icons
- face-api.js for face detection
- React Hook Form for forms

### Backend
- Next.js API Routes
- Supabase for Auth + Database
- Stripe for payments

### External Services
- Supabase Auth (Email + Google OAuth)
- Supabase Database (PostgreSQL)
- Stripe Checkout
- Resend for transactional emails

## 7. MVP Scope

### Must Have (MVP)
- Landing page with marketing copy
- User registration/login (email + Google)
- Photo upload (1-3 selfies)
- Face detection validation
- 30 style generation (mock/UI only for MVP)
- Real-time progress UI
- Single/batch download UI
- Basic pricing page
- Stripe payment integration (test mode)
- Email notifications (via Resend)

### Post-MVP
- Actual AI model integration
- 100 style option (Pro)
- Enterprise custom training
- API access
- Advanced analytics dashboard
