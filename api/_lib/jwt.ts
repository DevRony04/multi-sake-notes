import crypto from 'crypto';

const DEFAULT_TTL_SECONDS = 60 * 60 * 24; // 24h
const JWT_SECRET: string = process.env.JWT_SECRET || 'dev-secret-change-me';

function base64url(input: string | Buffer): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

export interface JwtPayloadBase {
  iat?: number;
  exp?: number;
  [key: string]: unknown;
}

export function sign<TPayload extends Record<string, unknown>>(payload: TPayload, options: { ttlSeconds?: number } = {}): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const exp = now + (options.ttlSeconds || DEFAULT_TTL_SECONDS);
  const body: JwtPayloadBase & TPayload = { ...payload, iat: now, exp } as JwtPayloadBase & TPayload;

  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(body));
  const data = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(data)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${data}.${signature}`;
}

export function verify(token: string): Record<string, unknown> {
  if (!token || typeof token !== 'string') throw new Error('Invalid token');
  const [encodedHeader, encodedPayload, signature] = token.split('.');
  if (!encodedHeader || !encodedPayload || !signature) throw new Error('Malformed token');

  const data = `${encodedHeader}.${encodedPayload}`;
  const expectedSig = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(data)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  if (expectedSig !== signature) throw new Error('Signature mismatch');

  const payloadJson = Buffer.from(encodedPayload, 'base64').toString('utf8');
  const payload = JSON.parse(payloadJson) as Record<string, unknown> & JwtPayloadBase;
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && now > payload.exp) throw new Error('Token expired');
  return payload;
}


