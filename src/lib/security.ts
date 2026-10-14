/**
 * Security & Input Sanitization Utility Module
 * GOIZET GESTION — Enterprise Security Protection
 */

/**
 * Sanitize strings to prevent XSS (Cross-Site Scripting) attacks
 * Encodes dangerous characters: <, >, &, ", ', /
 */
export function sanitizeXSS(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/onload/gi, '')
    .replace(/onerror/gi, '')
    .trim();
}

/**
 * Sanitize inputs against SQL / NoSQL / Command Injection patterns
 */
export function sanitizeInjection(input: string): string {
  if (typeof input !== 'string') return '';

  return sanitizeXSS(input)
    .replace(/SELECT|INSERT|DELETE|UPDATE|DROP|UNION|EXEC|ALTER/gi, '')
    .replace(/[\$\{\}\[\]\\]/g, '')
    .replace(/--/g, '')
    .replace(/;/g, '');
}

/**
 * Validate email address format strictly
 */
export function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Validate French / International phone format strictly
 */
export function isValidPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.replace(/[\s\.\-\(\)]/g, '');
  
  // French numbers: standard 10-digit starting with 0[1-9], or international +33 / 0033 followed by 9 digits ([1-9]XXXXXXXX)
  const frenchRegex = /^(0[1-9]\d{8}|\+33[1-9]\d{8}|0033[1-9]\d{8})$/;
  if (frenchRegex.test(cleaned)) return true;

  // Rejects invalid French attempts like +330... or malformed +33
  if (cleaned.startsWith('+33') || cleaned.startsWith('0033')) {
    return false;
  }

  // International numbers with + (E.164: + followed by 7 to 14 digits)
  const intlRegex = /^\+[1-9]\d{6,14}$/;
  if (intlRegex.test(cleaned)) return true;

  // Standard non-French numbers with 00 prefix (e.g. 0044...)
  const intlPrefixRegex = /^00[1-9]\d{6,14}$/;
  if (intlPrefixRegex.test(cleaned)) return true;

  return false;
}

/**
 * Sanitize and clamp numeric values to prevent buffer overflow or negative exploits
 */
export function sanitizeNumber(value: any, min: number = 0, max: number = 10000000): number {
  const num = parseInt(value, 10);
  if (isNaN(num)) return min;
  return Math.min(Math.max(num, min), max);
}

/**
 * In-Memory Simple Rate Limiter for Server API Routes
 */
const ipStore = new Map<string, { count: number; firstAccess: number }>();

export function checkRateLimit(ip: string, limit: number = 5, windowMs: number = 60000): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = ipStore.get(ip);

  if (!record) {
    ipStore.set(ip, { count: 1, firstAccess: now });
    return { allowed: true, remaining: limit - 1 };
  }

  if (now - record.firstAccess > windowMs) {
    // Reset window
    ipStore.set(ip, { count: 1, firstAccess: now });
    return { allowed: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  ipStore.set(ip, record);
  return { allowed: true, remaining: limit - record.count };
}

/**
 * Mask sensitive data for logging to prevent data leakage
 */
export function maskSensitive(text: string): string {
  if (!text) return '';
  if (isValidEmail(text)) {
    const [user, domain] = text.split('@');
    return `${user.substring(0, 2)}***@${domain}`;
  }
  if (text.length > 6) {
    return `${text.substring(0, 3)}***${text.substring(text.length - 2)}`;
  }
  return '***';
}

/**
 * Translate server error messages to user's active language
 */
export function getLocalizedErrorMessage(rawMsg: string, lang: 'fr' | 'en'): string {
  if (!rawMsg) {
    return lang === 'fr' ? 'Une erreur est survenue.' : 'An error occurred.';
  }
  if (/téléphone.*obligatoire|phone.*required/i.test(rawMsg)) {
    return lang === 'fr' ? 'Le numéro de téléphone est obligatoire.' : 'Phone number is required.';
  }
  if (/téléphone|phone/i.test(rawMsg)) {
    return lang === 'fr' ? 'Numéro de téléphone invalide.' : 'Invalid phone number.';
  }
  if (/nom.*obligatoire|name.*required|renseigner votre nom|saisir votre nom/i.test(rawMsg)) {
    return lang === 'fr' ? 'Le nom complet est obligatoire.' : 'Full name is required.';
  }
  if (/identifiant/i.test(rawMsg)) {
    return lang === 'fr' ? 'Identifiants ou informations invalides.' : 'Invalid details provided.';
  }
  if (/email.*obligatoire|email.*required/i.test(rawMsg)) {
    return lang === 'fr' ? 'L\'adresse email est obligatoire.' : 'Email address is required.';
  }
  if (/email/i.test(rawMsg)) {
    return lang === 'fr' ? 'Adresse email invalide.' : 'Invalid email address.';
  }
  if (/message/i.test(rawMsg) && (/caractère|character|court|short|obligatoire/i.test(rawMsg))) {
    return lang === 'fr' ? 'Votre message doit contenir au moins 10 caractères.' : 'Your message must contain at least 10 characters.';
  }
  if (/requête|request|rate limit|trop de/i.test(rawMsg)) {
    return lang === 'fr' ? 'Trop de requêtes. Veuillez patienter un instant.' : 'Too many requests. Please wait a moment.';
  }
  if (/serveur|server/i.test(rawMsg)) {
    return lang === 'fr' ? 'Une erreur serveur est survenue.' : 'A server error occurred. Please try again.';
  }
  if (/soumission|submission|envoi|transmission|enregistrement/i.test(rawMsg)) {
    return lang === 'fr' ? 'Erreur lors de la soumission. Veuillez réessayer.' : 'Submission error. Please try again.';
  }
  if (/erreur/i.test(rawMsg)) {
    return lang === 'fr' ? rawMsg : 'An error occurred. Please try again.';
  }
  return rawMsg;
}
