import {FieldMeta, FieldType} from 'afraid';
import {getOpenAPIComponentRef} from '..';

export type JSONSchema = RefJSONSchema |
    ObjectJSONSchema |
    ArrayJSONSchema |
    IntegerJSONSchema |
    FloatJSONSchema |
    StringJSONSchema;

export interface BaseJSONSchema {
    description?: string;
}

interface RefJSONSchema {
    $ref: string;
}

export interface StringJSONSchema extends BaseJSONSchema {
    type: 'string';
}

export interface IntegerJSONSchema extends BaseJSONSchema {
    type: 'integer';
    format: 'int32';
}

export interface FloatJSONSchema extends BaseJSONSchema {
    type: ' number';
    format: 'float';
}

export type PropertiesJSONSchema = {
    [propertyKey: string]: JSONSchema
}

export interface ObjectJSONSchema extends BaseJSONSchema {
    type: 'object';
    properties: PropertiesJSONSchema;
    required: string[];
}

export interface ArrayJSONSchema extends BaseJSONSchema {
    type: 'array';
    items: JSONSchema;
}

const toJSONSchemaProperties = (meta: FieldMeta[]) =>
    meta.reduce((properties, meta) => {
        properties[meta.field] = meta.classRef
            ? toRefJSONSchema(getOpenAPIComponentRef(meta))
            : toJSONSchema(meta);
        return properties;
    }, {});

const toJSONSchemaRequiredList = (meta: FieldMeta[]) =>
    meta
        .filter(({isOptional}) => !isOptional)
        .map(({field}) => field);


export const toJSONSchema = (meta: FieldMeta) => {
    const metaType = meta.type;
    const descriptionsWrapper = meta.description ? {description: meta.description} : {};
    const schema: any = {...descriptionsWrapper};
    const jsonSchema = meta.isArray ? {type: 'array', items: schema} : schema;

    switch (metaType) {
        case FieldType.date:
            schema.type = 'string';
            schema.format = 'date-time';
            break;
        case FieldType.float:
            schema.type = 'number';
            schema.format = 'float';
            break;
        case FieldType.int:
            schema.type = 'integer';
            schema.format = 'int32';
            break;
        case FieldType.boolean:
            schema.type = 'boolean';
            break;
        case FieldType.object:
            schema.type = 'object';
            schema.properties = meta.fields ? toJSONSchemaProperties(meta.fields) : {};
            schema.required = meta.fields ? toJSONSchemaRequiredList(meta.fields) : {};
            break;
        case FieldType.string:
        default:
            schema.type = 'string';
    }
    return jsonSchema;
};

export const toRefJSONSchema = ($ref, isOneOfMany = false) =>
    isOneOfMany
        ? {oneOf: [{$ref}]}
        : ({$ref});
