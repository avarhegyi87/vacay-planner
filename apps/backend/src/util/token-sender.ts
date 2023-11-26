import sgMail from '@sendgrid/mail';

export async function sendToken(userEmail: string, token: string) {
  try {
    if (!process.env.SENDGRID_API_KEY)
      throw Error('Sendgrid API key missing, no email sent');

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const mailOptions = {
      from: process.env.SENDGRID_EMAIL ?? 'avarhegyi87@gmail.com',
      to: userEmail,
      subject: 'VacayPlanner - confirm your registration',
      html: `<h1>Hi!</h1>
    <p>Thanks for registering to VacayPlanner.</p>
    <p>
    Please follow <a href="${process.env.APP_URL}/api/auth/verify/${token}">
    <strong>THIS LINK</strong>
    </a> to verify your email address. See you around!
    </p>`,
    };

    await sgMail.send(mailOptions);
    console.log('Verification email sent');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    throw Error(error.message);
  }
}

export default sendToken;
