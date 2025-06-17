import emailjs from 'emailjs-com';

const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

// Check if EmailJS is properly configured
const isEmailJSConfigured = () => {
  return (
    serviceId && 
    templateId && 
    publicKey &&
    serviceId !== 'your_emailjs_service_id' &&
    templateId !== 'your_emailjs_template_id' &&
    publicKey !== 'your_emailjs_public_key'
  );
};

// Validate email address
const isValidEmail = (email: string) => {
  if (!email || typeof email !== 'string' || email.trim() === '') {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const sendEventConfirmation = async (
  userEmail: string,
  eventTitle: string,
  eventDate: string
) => {
  if (!isEmailJSConfigured()) {
    console.warn('EmailJS not configured - skipping email notification. Please update your .env file with valid EmailJS credentials.');
    return;
  }

  if (!isValidEmail(userEmail)) {
    console.warn('Invalid or empty email address - skipping email notification.');
    return;
  }

  try {
    const templateParams = {
      to_email: userEmail.trim(),
      event_title: eventTitle,
      event_date: eventDate,
      message: `Your event "${eventTitle}" has been successfully created for ${eventDate}.`,
    };

    await emailjs.send(serviceId, templateId, templateParams, publicKey);
    console.log('Event confirmation email sent successfully');
  } catch (error) {
    console.error('Failed to send event confirmation email:', error);
  }
};

export const sendEventReminder = async (
  userEmail: string,
  eventTitle: string,
  eventDate: string
) => {
  if (!isEmailJSConfigured()) {
    console.warn('EmailJS not configured - skipping email notification. Please update your .env file with valid EmailJS credentials.');
    return;
  }

  if (!isValidEmail(userEmail)) {
    console.warn('Invalid or empty email address - skipping email notification.');
    return;
  }

  try {
    const templateParams = {
      to_email: userEmail.trim(),
      event_title: eventTitle,
      event_date: eventDate,
      message: `Reminder: Your event "${eventTitle}" is starting soon at ${eventDate}.`,
    };

    await emailjs.send(serviceId, templateId, templateParams, publicKey);
    console.log('Event reminder email sent successfully');
  } catch (error) {
    console.error('Failed to send event reminder email:', error);
  }
};