import {ExpressLayer, ExpressValidatorSanitizer} from './express-types';

export interface SwaggerParameter {
    name: string;
    in: 'formData' | 'query' | 'path' | 'header' | 'cookie';
    required?: boolean;
    type: string;
    format?: string;
    items?: {
        type: string;
    }
}

const parameterLocationMap = {
    query: 'query',
    body: 'body',
    params: 'path',
};

export const getSwaggerParameterFromLayer = (layer: ExpressLayer): SwaggerParameter => {
    const context = layer.handle._context;
    const parameterLocation = context.locations[0];
    return {
        name: context.fields[0] as string,
        in: parameterLocationMap[parameterLocation] || parameterLocation,
        required: !context.optional,
        ...getSwaggerType_FormatFromExpressValidatorSanitizers(context.sanitizers) as { type },
    }
};

const sanitizerTypeMap = {
    toInt: {type: 'integer', format: 'int32'},
    toFloat: {type: 'number', format: 'float'},
    toBoolean: {type: 'boolean'},
    toDate: {type: 'string', format: 'date'},
    toArray: {type: 'array'},
};

const getSwaggerType_FormatFromExpressValidatorSanitizers = (sanitizers: ExpressValidatorSanitizer[]) => {
    const defaultType = {type: 'string'};
    const normalize = (prev: Partial<SwaggerParameter>, curr: Partial<SwaggerParameter>) =>
        prev.type === 'array'
            ? {...defaultType, ...prev, items: {...defaultType, ...curr}}
            : (
                curr.type === 'array'
                    ? {...defaultType, ...curr, items: {...defaultType, ...prev}}
                    : {...defaultType, ...prev, ...curr}
            );
    return sanitizers.reverse().reduce((acc, sanitizer) =>
        normalize(acc, sanitizerTypeMap[sanitizer.sanitizer.name] || {}), {} as Partial<SwaggerParameter>);
};