import {OpenAPIContent} from './content';
import {FieldMeta} from 'afraid';

export interface OpenAPIRequestBody {
    description?: string;
    required: boolean;
    content: OpenAPIContent;
}

export const toOpenAPIRequestBody = (meta: FieldMeta,
                                     content: OpenAPIContent): OpenAPIRequestBody => ({
    required: !meta.isOptional,
    content,
});
