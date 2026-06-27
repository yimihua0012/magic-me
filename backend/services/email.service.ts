import { config } from '@backend/config'
import { PLANS } from '@backend/config/plans'

interface EmailOptions {
  to: string
  subject: string
  html: string
  from?: string
}

interface WelcomeEmailData {
  name: string
  email: string
}

interface GenerationCompleteData {
  name?: string
  email: string
  generationId: string
  styleCount: number
}

interface CreditPackageEmailData {
  email: string
  name?: string
  planType: 'basic' | 'pro' | 'premium'
  totalCredits: number
  validityDays: number
  amountPaid?: number
}

interface ExpirationReminderData {
  email: string
  name?: string
  remainingCredits: number
  expiresAt: string
  daysRemaining: number
}

export class EmailService {
  private async sendEmail(options: EmailOptions): Promise<void> {
    if (!config.email.enabled) {
      console.info('[Email] Email delivery is disabled; skipping email:', {
        to: options.to,
        subject: options.subject,
      })
      return
    }

    const apiKey = config.email.resendApiKey
    const isConfigured = Boolean(apiKey) && apiKey !== 're_demo'

    if (!isConfigured) {
      console.warn('[Email] Resend is not configured; skipping email:', {
        to: options.to,
        subject: options.subject,
      })
      return
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: options.from || `${config.email.fromName} <${config.email.fromEmail}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(`Resend email failed: ${response.status} ${errorBody}`)
    }

    console.log('[Email] Email sent:', {
      to: options.to,
      subject: options.subject,
    })
  }

  async sendWelcomeEmail(data: WelcomeEmailData): Promise<void> {
    const appName = config.email.fromName
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to ${appName}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #4F46E5;">Welcome to ${appName}!</h1>
            <p>Hi ${data.name || 'there'},</p>
            <p>Thanks for joining ${appName}. We're excited to help you create professional AI headshots.</p>
            <p>Here's what you can do next:</p>
            <ol>
              <li>Upload 1-3 selfies with good lighting</li>
              <li>Choose your preferred styles</li>
              <li>Download your professional headshots in minutes</li>
            </ol>
            <a href="${config.app.url}/upload" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px;">
              Get Started
            </a>
            <p style="margin-top: 30px; color: #666; font-size: 12px;">
              If you did not create this account, please ignore this email.
            </p>
          </div>
        </body>
      </html>
    `

    await this.sendEmail({
      to: data.email,
      subject: `Welcome to ${appName} - Your AI Headshot Journey Starts Here`,
      html,
    })
  }

  async sendGenerationCompleteEmail(data: GenerationCompleteData): Promise<void> {
    const appName = config.email.fromName
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Your Headshots Are Ready</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #10B981;">Your Headshots Are Ready</h1>
            <p>Hi ${data.name || 'there'},</p>
            <p>Great news. Your AI headshots have been generated and are ready for download.</p>
            <p>You created ${data.styleCount} different style${data.styleCount === 1 ? '' : 's'} to choose from.</p>
            <a href="${config.app.url}/generate/${data.generationId}" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px;">
              View Your Headshots
            </a>
            <p style="margin-top: 30px;">Best regards,<br>The ${appName} Team</p>
          </div>
        </body>
      </html>
    `

    await this.sendEmail({
      to: data.email,
      subject: 'Your AI Headshots Are Ready',
      html,
    })
  }

  async sendPaymentConfirmationEmail(data: CreditPackageEmailData): Promise<void> {
    const plan = PLANS[data.planType]
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Payment Confirmation</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #10B981;">Payment Confirmed</h1>
            <p>Hi ${data.name || 'there'},</p>
            <p>Thank you for your purchase. Your credit package is ready to use.</p>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Plan:</strong> ${plan.name}</p>
              <p style="margin: 10px 0;"><strong>Total Credits:</strong> ${data.totalCredits} headshots</p>
              <p style="margin: 10px 0;"><strong>Validity:</strong> ${data.validityDays} days</p>
              ${data.amountPaid ? `<p style="margin: 10px 0 0;"><strong>Amount:</strong> $${data.amountPaid.toFixed(2)}</p>` : ''}
            </div>
            <div style="background: #fffbeb; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
              <p style="margin: 0; color: #92400e;">
                <strong>Important:</strong> Your validity period starts from your <strong>first generation</strong>, not from the purchase date. Your credits remain safe until you begin using them.
              </p>
            </div>
            <p>Ready to create your professional headshots?</p>
            <a href="${config.app.url}/upload" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 10px;">
              Start Generating
            </a>
          </div>
        </body>
      </html>
    `

    await this.sendEmail({
      to: data.email,
      subject: `Payment Confirmation - ${plan.name} Plan`,
      html,
    })
  }

  async sendExpirationReminderEmail(data: ExpirationReminderData): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Your Credits Expire Soon</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #f59e0b;">Your Credits Expire Soon</h1>
            <p>Hi ${data.name || 'there'},</p>
            <p>Just a friendly reminder that your credit package will expire in <strong>${data.daysRemaining} day${data.daysRemaining > 1 ? 's' : ''}</strong>.</p>
            <div style="background: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
              <p style="margin: 0;"><strong>Remaining Credits:</strong> ${data.remainingCredits} headshots</p>
              <p style="margin: 10px 0 0;"><strong>Expiration Date:</strong> ${new Date(data.expiresAt).toLocaleDateString()}</p>
            </div>
            <p>Unused credits will become void after the expiration date. Make sure to use them before they expire.</p>
            <a href="${config.app.url}/upload" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px;">
              Use Your Credits Now
            </a>
            <p style="margin-top: 30px; color: #666; font-size: 14px;">
              Need to extend your validity period? Contact our support team for extension options.
            </p>
          </div>
        </body>
      </html>
    `

    await this.sendEmail({
      to: data.email,
      subject: `Reminder: Your Credits Expire in ${data.daysRemaining} Day${data.daysRemaining > 1 ? 's' : ''}`,
      html,
    })
  }

  async sendExpiredEmail(data: ExpirationReminderData): Promise<void> {
    const appName = config.email.fromName
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Your Credits Have Expired</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #ef4444;">Your Credits Have Expired</h1>
            <p>Hi ${data.name || 'there'},</p>
            <p>We're writing to let you know that your credit package has expired.</p>
            <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
              <p style="margin: 0;"><strong>Expired Credits:</strong> ${data.remainingCredits} headshots</p>
              <p style="margin: 10px 0 0;"><strong>Expired On:</strong> ${new Date(data.expiresAt).toLocaleDateString()}</p>
            </div>
            <p>Unused credits have become void and cannot be used.</p>
            <p>Need to generate more headshots? Purchase a new package to continue creating professional AI headshots.</p>
            <a href="${config.app.url}/pricing" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px;">
              View Plans
            </a>
            <p style="margin-top: 30px; color: #666; font-size: 14px;">
              Have questions about extending your validity period? Contact our support team.
            </p>
          </div>
        </body>
      </html>
    `

    await this.sendEmail({
      to: data.email,
      subject: `Your ${appName} Credits Have Expired`,
      html,
    })
  }
}

export const emailService = new EmailService()
