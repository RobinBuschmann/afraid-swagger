import {IRoute} from 'express';
import {FieldMeta} from 'afraid';

export interface ExpressRoute extends IRoute {
    methods: { [method: string]: boolean };
    stack: ExpressLayer[];
}

export interface ExpressLayer {
    handle: SwaggerHandle & TransformerHandle & ExpressRoute;
    route: any;
    name: string;
    regexp: RegExp;
    keys: any[];
    method: string;
}


export interface TransformerHandle {
    meta: FieldMeta;
}

export interface SwaggerHandle extends Function {
    swagger: {
        description;
    }
}
