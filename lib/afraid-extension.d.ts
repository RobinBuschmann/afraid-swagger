import {FieldMeta, Chain} from 'afraid';

declare module 'afraid/lib/meta/field-meta' {

    export interface FieldMeta {
        httpCode: number;
    }
}

declare module 'afraid/lib/meta/functional/chain' {

    export interface Chain<OBJ extends {}> {
        httpCode(code: number): Chain<OBJ>;
    }
}