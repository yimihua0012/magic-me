import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { appConfig } from '@/lib/config'
import { PLANS } from '@backend/config/plans'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') || appConfig.title
  const description = searchParams.get('description') || appConfig.description

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a',
          backgroundImage: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
          padding: '60px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.96)',
            borderRadius: '24px',
            padding: '60px',
            width: '1000px',
            height: '500px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
        >
          <h1
            style={{
              fontSize: '52px',
              fontWeight: 800,
              color: '#1d4ed8',
              margin: '0 0 24px 0',
            }}
          >
            {appConfig.name}
          </h1>

          <h2
            style={{
              fontSize: '42px',
              fontWeight: 800,
              color: '#0f172a',
              textAlign: 'center',
              margin: '0 0 20px 0',
              lineHeight: 1.2,
            }}
          >
            {title}
          </h2>

          <p
            style={{
              fontSize: '24px',
              color: '#475569',
              textAlign: 'center',
              margin: '0 0 40px 0',
              maxWidth: '820px',
              lineHeight: 1.35,
            }}
          >
            {description}
          </p>

          <div
            style={{
              display: 'flex',
              gap: '28px',
              fontSize: '20px',
              color: '#334155',
            }}
          >
            <span>Fast generation</span>
            <span>{PLANS.basic.credits} credits</span>
            <span>From ${PLANS.basic.price}</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
