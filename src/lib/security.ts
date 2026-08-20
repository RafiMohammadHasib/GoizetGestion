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
  if (!phone) return false;
  const cleaned = phone.replace(/[\s\.\-\(\)]/g, '');
  const phoneRegex = /^(\+33|0)[1-9]\d{8}$/;
  return phoneRegex.test(cleaned);
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
