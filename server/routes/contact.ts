import { Router } from 'express';
import { z } from 'zod';

export const contactRouter = Router();

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(254),
  subject: z.string().min(3).max(200),
  message: z.string().min(20).max(5000),
});

/**
 * POST /api/contact
 * Receives contact form submissions.
 * In production, integrate with an email service (e.g. Resend, SendGrid, Nodemailer).
 * For now, logs the message server-side and returns success.
 */
contactRouter.post('/', (req, res) => {
  const result = contactSchema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    res.status(400).json({ error: 'Invalid form data.', details: errors });
    return;
  }

  const { name, email, subject, message } = result.data;

  // Log the contact request (never log full message in production; use proper logging)
  console.log('[contact] New message from:', email, '| Subject:', subject);

  // TODO: In production, send email using your preferred service:
  //   import { Resend } from 'resend';
  //   const resend = new Resend(process.env.RESEND_API_KEY);
  //   await resend.emails.send({ from: 'noreply@convertflow.app', to: process.env.CONTACT_EMAIL, ... });
  //
  // For now we simulate success:
  void Promise.resolve({ name, subject, message }); // prevent unused-var lint error

  res.status(200).json({
    success: true,
    message: 'Thank you for your message. We will get back to you shortly.',
  });
});
