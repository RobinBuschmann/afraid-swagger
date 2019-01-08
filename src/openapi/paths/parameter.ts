import {JSONSchema, toJSONSchema} from '../../json-schema/json-schema';
import {FieldMeta} from 'afraid';

type OpenAPIInLiteral = 'query' | 'path' | 'header' | 'cookie';

export interface OpenAPIParameter {
    name: string;
    in: OpenAPIInLiteral;
    description?: string;
    required: boolean;
    schema: JSONSchema;
}

export const toOpenAPIParameters = (rootMeta: FieldMeta): OpenAPIParameter[] => {
    const base = {
        in: toOpenAPIIn(rootMeta.field),
    };
    if(!rootMeta.fields) {
        throw new Error(`"${rootMeta.field}" meta is empty`);
    }
    return rootMeta.fields.map(meta => ({
        ...base,
        name: meta.field,
        schema: toJSONSchema(meta),

        // If nthOneOfMany exists, we're setting all to optional,
        // because something like the oneOf notation from body
        // definition is not supported in OpenAPI 3;
        // See open discussion
        // https://github.com/OAI/OpenAPI-Specification/issues/256
        required: !!rootMeta.nthOneOfMany
            ? false
            : !meta.isOptional,
    }))
};

const toOpenAPIIn = (target: string): OpenAPIInLiteral => {
    switch (target) {
        case 'params':
            return 'path';
        case 'headers':
            return 'header';
        case 'cookies':
            return 'cookie';
        case 'query':
            return 'query';
        default:
            throw new Error(`In value "${target}" not supported`);
    }
};
