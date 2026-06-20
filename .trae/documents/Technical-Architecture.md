# AI Headshot Generator - Technical Architecture

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│                    Next.js 14 (App Router)                  │
│              Tailwind CSS + Lucide Icons                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     External Services                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  Supabase   │  │   Stripe    │  │      Resend          │ │
│  │   Auth      │  │   Payments  │  │   (Email)            │ │
│  │   Database  │  │             │  │                      │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 2. Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | Next.js 14 | App Router, SSR, API Routes |
| Styling | Tailwind CSS | Utility-first styling |
| Icons | Lucide React | Consistent icon system |
| Auth | Supabase Auth | Email + Google OAuth |
| Database | Supabase PostgreSQL | User data, generations |
| Payments | Stripe Checkout | One-time payments |
| Email | Resend | Transactional emails |
| Face Detection | face-api.js | Client-side validation |

## 3. Route Definitions

| Route | Purpose | Auth Required |
|-------|---------|---------------|
| `/` | Landing page with marketing content | No |
| `/upload` | Photo upload with face detection | Yes |
| `/generate/[id]` | Generation progress & results | Yes |
| `/dashboard` | Past generations management | Yes |
| `/pricing` | Plan selection | No |
| `/api/auth/*` | Supabase auth callbacks | No |
| `/api/stripe/*` | Stripe webhook handlers | No |
| `/api/generations/*` | CRUD for generations | Yes |

## 4. Database Schema

### Users Table (managed by Supabase Auth)
```sql
-- Supabase handles this automatically via auth.users
```

### Profiles Table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  full_name TEXT,
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Generations Table
```sql
CREATE TABLE generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'pending',
  -- pending, processing, completed, failed
  plan_type TEXT NOT NULL, -- basic, pro
  style_count INTEGER NOT NULL,
  input_photos TEXT[] NOT NULL, -- array of storage paths
  output_photos TEXT[], -- array of generated photo URLs
  stripe_payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);
```

## 5. API Definitions

### Auth Endpoints (via Supabase)
- `POST /auth/signup` - Email registration
- `POST /auth/login` - Email login
- `POST /auth/google` - Google OAuth
- `POST /auth/logout` - Sign out
- `GET /auth/callback` - OAuth callback handler

### Generation Endpoints
```
POST /api/generations
  Request: { plan_type: 'basic' | 'pro', photo_count: 1-3 }
  Response: { id: string, status: 'pending' }

GET /api/generations/[id]
  Response: { id, status, progress, output_photos? }

PATCH /api/generations/[id]
  Request: { status?, output_photos? }
  Response: { updated generation }
```

### Stripe Endpoints
```
POST /api/stripe/create-checkout
  Request: { plan_type: 'basic' | 'pro', generation_id }
  Response: { checkout_url }

POST /api/stripe/webhook
  Handles: checkout.session.completed, payment_intent.succeeded
```

## 6. Component Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with nav/footer
│   ├── page.tsx            # Landing page
│   ├── upload/
│   │   └── page.tsx        # Upload interface
│   ├── generate/
│   │   └── [id]/
│   │       └── page.tsx    # Generation progress/results
│   ├── dashboard/
│   │   └── page.tsx        # Past generations
│   ├── pricing/
│   │   └── page.tsx        # Pricing page
│   └── api/                # API routes
├── components/
│   ├── ui/                 # Base UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── modal.tsx
│   ├── layout/
│   │   ├── navbar.tsx
│   │   └── footer.tsx
│   ├── auth/
│   │   ├── auth-modal.tsx
│   │   └── auth-form.tsx
│   ├── upload/
│   │   ├── upload-zone.tsx
│   │   ├── face-detection.tsx
│   │   └── photo-grid.tsx
│   ├── generation/
│   │   ├── progress.tsx
│   │   └── style-grid.tsx
│   └── pricing/
│       └── pricing-card.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts       # Browser client
│   │   └── server.ts       # Server client
│   ├── stripe.ts           # Stripe utilities
│   └── utils.ts            # Helper functions
└── types/
    └── index.ts             # TypeScript types
```

## 7. Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Resend
RESEND_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 8. Key Implementation Details

### Face Detection (Client-side)
- Use face-api.js with TinyFaceDetector model
- Run detection on file input change
- Validate: single face, front-facing, adequate size, good lighting
- Show specific error messages for each failure type

### Progress Simulation (MVP)
- Since actual AI generation is post-MVP, simulate progress:
  - 0-30%: "Analyzing photos..."
  - 30-60%: "Generating styles..."
  - 60-90%: "Applying finishing touches..."
  - 90-100%: "Finalizing your headshots..."

### Stripe Checkout Flow
1. User selects plan on pricing page
2. Click "Buy Now" → POST to `/api/stripe/create-checkout`
3. Redirect to Stripe Checkout
4. On success → redirect to `/generate/[id]`
5. Stripe webhook updates generation status

### Email Notifications (via Resend)
- Welcome email on registration
- Generation complete notification
- Payment confirmation receipt

## 9. Performance Targets

| Metric | Target |
|--------|--------|
| LCP | < 2.5s |
| FID | < 100ms |
| CLS | < 0.1 |
| TTI | < 3.5s |

## 10. Security Considerations

- Supabase Row Level Security (RLS) enabled on all tables
- API routes validate user session via Supabase
- Stripe webhook signature verification
- CSRF protection via Next.js
- Rate limiting on API routes
- File upload validation (type, size, dimensions)
