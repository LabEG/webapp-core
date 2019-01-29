export class ClientError {
    public message: string | null = null;
    public browser: string | null = null;
    public browserHash: number = 0;
    public error: string | null = null;
    public errorHash: number = 0;
    public errorBody: string | null = null;
    public count: number = 1;

    public updateHashes(): void {
        this.browserHash = this.hashCode(this.browser || "");
        this.errorHash = this.hashCode(this.error || "");
    }

    protected hashCode(string: string): number {
        var hash = 0, i, chr;
        if (string.length === 0) return hash;
        for (i = 0; i < string.length; i++) {
          chr   = string.charCodeAt(i);
          hash  = ((hash << 5) - hash) + chr;
          hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }
}
