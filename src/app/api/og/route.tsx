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
          backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '60px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '24px',
            padding: '60px',
            width: '1000px',
            height: '500px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '30px',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '20px',
              }}
            >
              <svg width="50" height="50" viewBox="0 0 100 100">
                <circle cx="50" cy="40" r="15" fill="#ffffff" opacity="0.9"/>
                <path d="M 25 75 Q 50 60 75 75" stroke="#ffffff" stroke-width="4" fill="none" opacity="0.9"/>
              </svg>
            </div>
            <h1
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                color: 'transparent',
                margin: 0,
              }}
            >
              {appConfig.name}
            </h1>
          </div>

          <h2
            style={{
              fontSize: '42px',
              fontWeight: 'bold',
              color: '#1e293b',
              textAlign: 'center',
              margin: '0 0 20px 0',
              lineHeight: '1.2',
            }}
          >
            {title}
          </h2>

          <p
            style={{
              fontSize: '24px',
              color: '#64748b',
              textAlign: 'center',
              margin: '0 0 40px 0',
              maxWidth: '800px',
            }}
          >
            {description}
          </p>

          <div
            style={{
              display: 'flex',
              gap: '30px',
              fontSize: '20px',
              color: '#475569',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '10px', fontSize: '24px' }}>⚡</span>
              <span>3 Minutes</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '10px', fontSize: '24px' }}>🎨</span>
              <span>{PLANS.basic.credits} Headshots</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '10px', fontSize: '24px' }}>💰</span>
              <span>From ${PLANS.basic.price}</span>
            </div>
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
