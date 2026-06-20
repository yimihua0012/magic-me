# Backend Directory Structure

```
backend/
├── config/                 # Configuration files
│   ├── index.ts            # Main config exports
│   ├── supabase.ts         # Supabase client config
│   └── stripe.ts            # Stripe config
│
├── db/                     # Database layer
│   ├── schema.sql          # Database schema
│   ├── migrations/          # Database migrations
│   │   └── 001_initial_schema.sql
│   └── repositories/       # Data access layer
│       ├── user.repository.ts
│       ├── generation.repository.ts
│       └── index.ts
│
├── services/               # Business logic layer
│   ├── auth.service.ts     # Authentication logic
│   ├── generation.service.ts  # Headshot generation logic
│   ├── payment.service.ts  # Payment/Stripe logic
│   ├── email.service.ts    # Email notifications
│   └── index.ts
│
├── middleware/             # Express/Next.js middleware
│   ├── auth.middleware.ts
│   ├── rate-limit.middleware.ts
│   └── index.ts
│
├── types/                  # Backend type definitions
│   ├── user.types.ts
│   ├── generation.types.ts
│   ├── payment.types.ts
│   └── index.ts
│
├── utils/                  # Utility functions
│   ├── validation.ts       # Input validation
│   ├── errors.ts           # Error handling
│   ├── logger.ts           # Logging utility
│   └── index.ts
│
└── index.ts                # Backend exports
```

## API Endpoints Structure

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/auth/callback` | OAuth callback |
| GET | `/api/auth/me` | Get current user |

### Generations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/generations` | List user generations |
| POST | `/api/generations` | Create new generation |
| GET | `/api/generations/:id` | Get generation details |
| PATCH | `/api/generations/:id` | Update generation |
| DELETE | `/api/generations/:id` | Delete generation |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/stripe/create-checkout` | Create Stripe checkout |
| POST | `/api/stripe/webhook` | Stripe webhook handler |
| GET | `/api/stripe/customer-portal` | Customer billing portal |
