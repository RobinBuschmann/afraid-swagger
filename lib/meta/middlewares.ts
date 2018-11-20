import {createMiddleware} from 'afraid';

const noopHandler = (req, res, next) => next();
const options = {createHandler: () => noopHandler};

export const responseBody = createMiddleware('responseBody', options);
export const responseHeaders = createMiddleware('responseHeaders', options);