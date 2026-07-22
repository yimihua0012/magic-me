'use strict'

const https = require('https')

const DEFAULT_ENDPOINT = 'https://magic-headshot.com/api/cron/fast-content'

exports.main = async function main(event) {
  const endpoint = process.env.FAST_CONTENT_CRON_ENDPOINT || DEFAULT_ENDPOINT
  const secret = process.env.FAST_CONTENT_CRON_SECRET || process.env.CRON_SECRET
  const locale = readLocale(event)

  if (!secret) {
    return {
      success: false,
      error: 'Missing FAST_CONTENT_CRON_SECRET or CRON_SECRET in cloud function environment variables.',
    }
  }

  const url = new URL(endpoint)
  if (locale) {
    url.searchParams.set('locale', locale)
  }

  try {
    const result = await requestJson(url, secret)
    return {
      success: result.statusCode >= 200 && result.statusCode < 300,
      statusCode: result.statusCode,
      endpoint: url.toString(),
      data: result.body,
    }
  } catch (error) {
    return {
      success: false,
      endpoint: url.toString(),
      error: error instanceof Error ? error.message : 'Unknown request error',
    }
  }
}

function requestJson(url, secret) {
  return new Promise((resolve, reject) => {
    const request = https.request(
      url,
      {
        method: 'POST',
        timeout: 180000,
        headers: {
          Authorization: `Bearer ${secret}`,
          'Content-Type': 'application/json',
        },
      },
      (response) => {
        let raw = ''
        response.setEncoding('utf8')
        response.on('data', (chunk) => {
          raw += chunk
        })
        response.on('end', () => {
          resolve({
            statusCode: response.statusCode || 0,
            body: parseJson(raw),
          })
        })
      },
    )

    request.on('timeout', () => {
      request.destroy(new Error('Request timed out while calling fast content cron endpoint.'))
    })
    request.on('error', reject)
    request.end(JSON.stringify({ source: 'tencent_scf' }))
  })
}

function parseJson(value) {
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

function readLocale(event) {
  const value = event && typeof event === 'object' ? event.locale : ''
  return ['en', 'es', 'fr', 'de', 'ja'].includes(value) ? value : ''
}
