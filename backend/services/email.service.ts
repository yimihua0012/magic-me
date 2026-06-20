import { config } from '@backend/config'

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
  name: string
  email: string
  generationId: string
  styleCount: number
}

export class EmailService {
  private async sendEmail(options: EmailOptions): Promise<void> {
    // In production, integrate with Resend
    // const resend = new Resend(config.email.resendApiKey)
    // await resend.emails.send({
    //   from: options.from || `${config.email.fromName} <${config.email.fromEmail}>`,
    //   to: options.to,
    //   subject: options.subject,
    //   html: options.html,
    // })

    console.log('Email sent:', {
      to: options.to,
      subject: options.subject,
    })
  }

  async sendWelcomeEmail(data: WelcomeEmailData): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to HeadshotAI</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #4F46E5;">Welcome to HeadshotAI!</h1>
            <p>Hi ${data.name || 'there'},</p>
            <p>Thanks for joining HeadshotAI! We're excited to help you create professional AI headshots.</p>
            <p>Here's what you can do next:</p>
            <ol>
              <li>Upload 1-3 selfies with good lighting</li>
              <li>Choose your preferred style套餐</li>
              <li>Download your professional headshots in minutes!</li>
            </ol>
            <a href="${config.app.url}/upload" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px;">
              Get Started
            </a>
            <p style="margin-top: 30px; color: #666; font-size: 12px;">
              If you didn't create this account, please ignore this email.
            </p>
          </div>
        </body>
      </html>
    `

    await this.sendEmail({
      to: data.email,
      subject: 'Welcome to HeadshotAI - Your AI Headshot Journey Starts Here!',
      html,
    })
  }

  async sendGenerationCompleteEmail(data: GenerationCompleteData): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Your Headshots Are Ready!</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #10B981;">Your Headshots Are Ready! 🎉</h1>
            <p>Hi ${data.name || 'there'},</p>
            <p>Great news! Your AI headshots have been generated and are ready for download.</p>
            <p>You created ${data.styleCount} different styles to choose from!</p>
            <a href="${config.app.url}/generate/${data.generationId}" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px;">
              View Your Headshots
            </a>
            <p style="margin-top: 30px;">Best regards,<br>The HeadshotAI Team</p>
          </div>
        </body>
      </html>
    `

    await this.sendEmail({
      to: data.email,
      subject: '🎉 Your AI Headshots Are Ready!',
      html,
    })
  }

  async sendPaymentConfirmationEmail(
    email: string,
    amount: number,
    planName: string
  ): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Payment Confirmation</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #10B981;">Payment Confirmed ✓</h1>
            <p>Thank you for your purchase!</p>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Plan:</strong> ${planName}</p>
              <p style="margin: 10px 0 0;"><strong>Amount:</strong> $${amount.toFixed(2)}</p>
            </div>
            <p>Your receipt is attached below. You can also view your purchase history in your dashboard.</p>
            <a href="${config.app.url}/dashboard" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px;">
              Go to Dashboard
            </a>
          </div>
        </body>
      </html>
    `

    await this.sendEmail({
      to: email,
      subject: `Payment Confirmation - ${planName}`,
      html,
    })
  }
}

export const emailService = new EmailService()
