export function normalizeURL (found_URL: string): string {
const myURL = new URL(`${found_URL}`)
    return `${myURL.host}${myURL.pathname.replace(/\/+$/, '')}`;
};