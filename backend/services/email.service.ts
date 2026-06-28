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
  creditsUsed: number
  remainingCredits: number
  nearestExpiresAt?: string
}

interface CreditPackageEmailData {
  email: string
  name?: string
  planType: 'basic' | 'pro' | 'premium'
  totalCredits: number
  validityDays: number
  amountPaid?: number
}

interface CreditPackageActivationEmailData {
  email: string
  name?: string
  planType: 'basic' | 'pro' | 'premium'
  remainingCredits: number
  expiresAt: string
}

interface OrderSuccessNotificationData {
  email: string
  customerEmail?: string
  customerName?: string
  packageId: string
  userId: string
  planType: 'basic' | 'pro' | 'premium'
  totalCredits: number
  validityDays: number
  amountPaid?: number
  currency?: string
  paymentProvider: string
  paymentId?: string
}

interface ExpirationReminderData {
  email: string
  name?: string
  remainingCredits: number
  expiresAt: string
  daysRemaining: number
}

interface InboundEmailForwardData {
  from?: string
  to?: string
  cc?: string
  replyTo?: string
  subject?: string
  text?: string
  html?: string
  receivedAt?: string
  messageId?: string
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

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
            <p>We appreciate your trust and will do our best to make the experience simple, reliable, and worth your time.</p>
            <p>Here's what you can do next:</p>
            <ol>
              <li>Upload 1-3 clear selfies of the same person with good lighting</li>
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
    const expirationLabel = data.nearestExpiresAt
      ? new Date(data.nearestExpiresAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : 'No active expiration date yet'
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${appName} - Your Headshots Are Ready</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #10B981;">${appName}: Your Headshots Are Ready</h1>
            <p>Hi ${data.name || 'there'},</p>
            <p>Great news. Your AI headshots have been generated and are ready for download.</p>
            <p>You created ${data.styleCount} different style${data.styleCount === 1 ? '' : 's'} to choose from.</p>
            <p>Thank you for choosing ${appName}. If anything looks off, our support team is here to help you get a better result.</p>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Credits Used:</strong> ${data.creditsUsed}</p>
              <p style="margin: 10px 0;"><strong>Remaining Credits:</strong> ${data.remainingCredits}</p>
              <p style="margin: 10px 0 0;"><strong>Nearest Expiration:</strong> ${expirationLabel}</p>
            </div>
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
      subject: `${appName} - Your AI Headshots Are Ready`,
      html,
    })
  }

  async sendPaymentConfirmationEmail(data: CreditPackageEmailData): Promise<void> {
    const appName = config.email.fromName
    const plan = PLANS[data.planType]
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${appName} - Payment Confirmation</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #10B981;">${appName}: Payment Confirmed</h1>
            <p>Hi ${data.name || 'there'},</p>
            <p>Thank you for your purchase. Your credit package is ready to use.</p>
            <p>We sincerely appreciate your support and will keep working to make every generated headshot feel polished and useful.</p>
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
      subject: `${appName} - Payment Confirmation - ${plan.name}`,
      html,
    })
  }

  async sendCreditPackageActivationEmail(data: CreditPackageActivationEmailData): Promise<void> {
    const appName = config.email.fromName
    const plan = PLANS[data.planType]
    const expirationDate = new Date(data.expiresAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${appName} - Your Credit Validity Has Started</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #4F46E5;">${appName}: Your Credit Validity Has Started</h1>
            <p>Hi ${data.name || 'there'},</p>
            <p>Your first generation has started, so the validity period for your ${plan.name} credit package is now active.</p>
            <p>We want you to have a smooth experience from here. If you need help choosing styles or improving results, please contact our support team.</p>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Plan:</strong> ${plan.name}</p>
              <p style="margin: 10px 0;"><strong>Remaining Credits:</strong> ${data.remainingCredits} headshots</p>
              <p style="margin: 10px 0 0;"><strong>Expires On:</strong> ${expirationDate}</p>
            </div>
            <p>You can keep generating selected styles until your credits are used or the validity period ends.</p>
            <a href="${config.app.url}/upload" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 10px;">
              Generate More Headshots
            </a>
          </div>
        </body>
      </html>
    `

    await this.sendEmail({
      to: data.email,
      subject: `${appName} - Your ${plan.name} Credit Validity Has Started`,
      html,
    })
  }

  async sendOrderSuccessNotificationEmail(data: OrderSuccessNotificationData): Promise<void> {
    const appName = config.email.fromName
    const plan = PLANS[data.planType]
    const currency = (data.currency || 'USD').toUpperCase()
    const amount = typeof data.amountPaid === 'number'
      ? `${currency} ${data.amountPaid.toFixed(2)}`
      : 'N/A'
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${appName} - Order Success Notification</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #10B981;">${appName}: Order Successful</h1>
            <p>A new credit package order has been completed.</p>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Plan:</strong> ${plan.name}</p>
              <p style="margin: 10px 0;"><strong>Total Credits:</strong> ${data.totalCredits}</p>
              <p style="margin: 10px 0;"><strong>Validity:</strong> ${data.validityDays} days after first generation</p>
              <p style="margin: 10px 0;"><strong>Amount:</strong> ${amount}</p>
              <p style="margin: 10px 0;"><strong>Payment Provider:</strong> ${data.paymentProvider}</p>
              ${data.paymentId ? `<p style="margin: 10px 0;"><strong>Payment ID:</strong> ${data.paymentId}</p>` : ''}
              <p style="margin: 10px 0;"><strong>Package ID:</strong> ${data.packageId}</p>
              <p style="margin: 10px 0;"><strong>User ID:</strong> ${data.userId}</p>
              ${data.customerEmail ? `<p style="margin: 10px 0;"><strong>Customer Email:</strong> ${data.customerEmail}</p>` : ''}
              ${data.customerName ? `<p style="margin: 10px 0 0;"><strong>Customer Name:</strong> ${data.customerName}</p>` : ''}
            </div>
            <p style="color: #666; font-size: 12px;">
              This notification was sent automatically after a successful payment created a new credit package.
            </p>
          </div>
        </body>
      </html>
    `

    await this.sendEmail({
      to: data.email,
      subject: `${appName} - Order Successful - ${plan.name}`,
      html,
    })
  }

  async sendExpirationReminderEmail(data: ExpirationReminderData): Promise<void> {
    const appName = config.email.fromName
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${appName} - Your Credits Expire Soon</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #f59e0b;">${appName}: Your Credits Expire Soon</h1>
            <p>Hi ${data.name || 'there'},</p>
            <p>Just a friendly reminder that your credit package will expire in <strong>${data.daysRemaining} day${data.daysRemaining > 1 ? 's' : ''}</strong>.</p>
            <p>We are sending this early so you still have time to use your remaining credits and avoid losing value.</p>
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
      subject: `${appName} - Reminder: Your Credits Expire in ${data.daysRemaining} Day${data.daysRemaining > 1 ? 's' : ''}`,
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
          <title>${appName} - Your Credits Have Expired</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #ef4444;">${appName}: Your Credits Have Expired</h1>
            <p>Hi ${data.name || 'there'},</p>
            <p>We're writing to let you know that your credit package has expired.</p>
            <p>We're sorry if you were not able to use them in time. If you have questions about your account, our support team will be glad to review it with you.</p>
            <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
              <p style="margin: 0;"><strong>Expired On:</strong> ${new Date(data.expiresAt).toLocaleDateString()}</p>
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
      subject: `${appName} - Your Credits Have Expired`,
      html,
    })
  }

  async forwardInboundEmail(data: InboundEmailForwardData): Promise<void> {
    const appName = config.email.fromName
    const originalSubject = data.subject || '(No subject)'
    const receivedAt = data.receivedAt
      ? new Date(data.receivedAt).toLocaleString('en-US')
      : new Date().toLocaleString('en-US')
    const safeText = data.text
      ? escapeHtml(data.text).replace(/\n/g, '<br>')
      : ''
    const safeHtmlPreview = data.html
      ? escapeHtml(data.html)
      : ''
    const bodyContent = safeText || safeHtmlPreview || 'No readable email body was provided by the inbound webhook.'
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${appName} - Inbound Email Forward</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 720px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #4F46E5;">${appName}: New Inbound Email</h1>
            <p>A new email was received by ${appName} and forwarded automatically.</p>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0;"><strong>From:</strong> ${escapeHtml(data.from || 'Unknown')}</p>
              <p style="margin: 10px 0;"><strong>To:</strong> ${escapeHtml(data.to || 'Unknown')}</p>
              ${data.cc ? `<p style="margin: 10px 0;"><strong>CC:</strong> ${escapeHtml(data.cc)}</p>` : ''}
              ${data.replyTo ? `<p style="margin: 10px 0;"><strong>Reply-To:</strong> ${escapeHtml(data.replyTo)}</p>` : ''}
              <p style="margin: 10px 0;"><strong>Subject:</strong> ${escapeHtml(originalSubject)}</p>
              <p style="margin: 10px 0;"><strong>Received:</strong> ${escapeHtml(receivedAt)}</p>
              ${data.messageId ? `<p style="margin: 10px 0 0;"><strong>Message ID:</strong> ${escapeHtml(data.messageId)}</p>` : ''}
            </div>
            <div style="background: #ffffff; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px;">
              <h2 style="font-size: 16px; margin-top: 0;">Email Content</h2>
              <div style="font-size: 14px; white-space: normal;">${bodyContent}</div>
            </div>
          </div>
        </body>
      </html>
    `

    await this.sendEmail({
      to: '896783781@qq.com',
      subject: `${appName} - Inbound Email - ${originalSubject}`,
      html,
    })
  }
}

export const emailService = new EmailService()
