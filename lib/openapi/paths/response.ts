import {OpenAPIContent} from './content';

export interface OpenAPIResponse {
    description?: string;
    content: OpenAPIContent;
}

export interface OpenAPIResponses {
    [statusCode: string]: OpenAPIResponse;
    default: OpenAPIResponse;
}

export const toOpenAPIResponse = (content: OpenAPIContent): OpenAPIResponse => ({
    content,
});
