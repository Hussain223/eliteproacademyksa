/**
 * A WhatsApp chat link to the academy's published number.
 *
 * The public site's contact actions all go through WhatsApp for now: it is the
 * academy's real, working channel, and it needs no form, no inbox and no data
 * stored on our side. `text` pre-fills the visitor's first message so the
 * academy knows what the chat is about; the visitor can edit it before sending.
 *
 * This is deliberately NOT the internal reservation module. A public visitor
 * asking for a meeting is a request, handled by a person — not a booking.
 */
export function whatsappUrl(phone: string, text?: string): string {
  const digits = phone.replace(/[^0-9]/g, '');
  return text
    ? `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
    : `https://wa.me/${digits}`;
}
