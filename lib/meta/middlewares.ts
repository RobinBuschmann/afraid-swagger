import {createMiddleware, f, createChain, options as chainOptions} from 'afraid';

const chain = createChain({
    ...chainOptions,
    httpCode: (httpCode) => ({httpCode}),
});
const options = {createHandler: () => (req, res, next) => next(), chain};

export const responseBody = createMiddleware('responseBody', options);
export const responseHeaders = createMiddleware('responseHeaders', options);

