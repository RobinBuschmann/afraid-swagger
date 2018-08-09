import {IRoute} from 'express';

export interface ExpressRoute extends IRoute {
    methods: { [method: string]: boolean };
    stack: ExpressLayer[];
}

export interface ExpressLayer {
    handle: ExpressValidatorHandle & SwaggerHandle;
    keys: any[];
    method: string;
}

export interface ExpressValidatorSanitizer {
    sanitizer: {
        sanitizer: Function;
        name: string;
    }
}

export interface ExpressValidatorHandle extends Function {
    _context: {
        fields: string[];
        locations: string[];
        sanitizers: ExpressValidatorSanitizer[];
        optional: any | undefined;
    }
}

export interface SwaggerHandle extends Function {
    swagger: {
        description;
    }
}