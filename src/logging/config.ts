const ignoreUrls = ['/healthcheck'];

export default function isLoggableUrl(url: string): boolean {
  return ignoreUrls.indexOf(url) === -1;
}

export const sensitiveFields = [
  'token',
  'authToken',
  'authorization',
  'email',
  'password',
  'password_confirmation',
  'new_password',
  'hqo-authorization',
];

const basePathThirdSegments = new Set(['my', 'email']);

export function getBasePath(path: string): string {
  const [url] = path.split('?');
  const parts = url.split('/');

  if (parts.length === 4 && !basePathThirdSegments.has(parts[3])) {
    return parts.slice(0, 3).join('/');
  }

  return url;
}
