export function getEnv(key: string): string {
    if (typeof window !== 'undefined' && (window as any).__ENV__) {
        return (window as any).__ENV__[key] || process.env[key] || '';
    }
    return process.env[key] || '';
}
