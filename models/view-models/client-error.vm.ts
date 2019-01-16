export class ClientError {
    public message: string | null = null;
    public browser: string | null = null;
    public browserHash: string | null = null;
    public error: string | null = null;
    public errorHash: string | null = null;
    public errorBody: string | null = null;
    public count: number = 1;
}
