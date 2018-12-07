export interface OpenAPIInfo {
    version: string;
    title: string;
    description?: string;
    termsOfService?: string;
    contact?: {
        name: string;
        email?: string;
        url?: string;
    },
    license?: {
        name: string;
        url?: string;
    }
}