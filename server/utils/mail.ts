import { Resend } from 'resend';

const config = useRuntimeConfig();

/**
 * Resend email client
 */
export const resend = new Resend(config.resendApiKey);

const SITE_URL = config.public.appUrl;
const EMAIL_FROM = config.resendEmailFrom;
const EMAIL_ADMIN = config.resendEmailAdmin;

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  userName: string,
  email: string,
  token: string
) {
  const resetLink = `${SITE_URL}/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: 'Reset your password',
    html: `
      <h1>Reset your password</h1>
      <p>Hi ${userName},</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  });
}

/**
 * Send email verification
 */
export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `${SITE_URL}/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: 'Confirm your email',
    html: `
      <h1>Confirm your email</h1>
      <p>Click the link below to confirm your email:</p>
      <a href="${confirmLink}">${confirmLink}</a>
    `,
  });
}

/**
 * Send submission notification to user and admin
 */
export async function sendNotifySubmissionEmail(
  userName: string,
  userEmail: string,
  itemName: string,
  statusLink: string,
  reviewLink: string
) {
  // Notify user
  await resend.emails.send({
    from: EMAIL_FROM,
    to: userEmail,
    subject: 'Thank you for your submission',
    html: `
      <h1>Thank you for your submission!</h1>
      <p>Hi ${userName},</p>
      <p>Your submission "${itemName}" has been received.</p>
      <p>You can check the status here: <a href="${statusLink}">${statusLink}</a></p>
    `,
  });

  // Notify admin
  if (EMAIL_ADMIN) {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: EMAIL_ADMIN,
      subject: 'New submission',
      html: `
        <h1>New submission received</h1>
        <p>Item: ${itemName}</p>
        <p>Review: <a href="${reviewLink}">${reviewLink}</a></p>
      `,
    });
  }
}

/**
 * Send payment success email
 */
export async function sendPaymentSuccessEmail(
  userName: string,
  email: string,
  itemLink: string
) {
  await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: 'Thank you for your submission',
    html: `
      <h1>Payment Successful!</h1>
      <p>Hi ${userName},</p>
      <p>Your payment has been processed successfully.</p>
      <p>View your submission: <a href="${itemLink}">${itemLink}</a></p>
    `,
  });
}

/**
 * Send approval email
 */
export async function sendApprovalEmail(
  userName: string,
  email: string,
  itemLink: string
) {
  await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: 'Your submission has been approved',
    html: `
      <h1>Congratulations!</h1>
      <p>Hi ${userName},</p>
      <p>Your submission has been approved and is now live!</p>
      <p>View it here: <a href="${itemLink}">${itemLink}</a></p>
    `,
  });
}

/**
 * Send rejection email
 */
export async function sendRejectionEmail(
  userName: string,
  email: string,
  dashboardLink: string
) {
  await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: 'Please check your submission',
    html: `
      <h1>Submission Update</h1>
      <p>Hi ${userName},</p>
      <p>Your submission needs some changes. Please check your dashboard for details.</p>
      <p><a href="${dashboardLink}">${dashboardLink}</a></p>
    `,
  });
}
