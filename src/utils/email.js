import email from 'emailjs';
import { smtp } from './config';

export default function sendMail({ to, subject, text }) {
  console.log(`Sending email to: <${to}> Subject: ${subject}\nBody: ${text}\n`);

  if (!smtp || !smtp.host) {
    return console.log('ERROR: SMTP server not configured, not sending e-mail!');
  }

  const server = email.server.connect(smtp);

  return server.send({
    from: smtp.user,
    to,
    subject,
    text,
  }, (err, message) => {
    if (err) {
      console.log('Failed sending message, got error:', err);
    } else {
      console.log(`Sent message ${message.header['message-id']}`);
    }
  });
}
