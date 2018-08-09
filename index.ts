import * as express from 'express';
import {Router} from 'express';
import {serve, setup} from 'swagger-ui-express';
import {param, query} from 'express-transformer';
import {createServer} from 'http';
import {createSwaggerDocument} from './lib/document';
import {description} from './lib/path';

const app = express();
const handler = (_, res) => res.sendStatus(200);

app.get('/users', [
    query('limit').int().opt(),
    query('offset').int().opt(),
    query('filters').string().array().opt(),
    description('test bla'),
], handler);
app.get('/users/:id', [param('id').int()], handler);
app.post('/users', handler);

const friends = Router();

friends.get('/friends', handler);
friends.post('/friends', handler);

app.use(friends);

const document = createSwaggerDocument({
    swagger: '2.0',
    app,
    description: 'Generates swagger documentation from express-transformer middlewares.',
    produces: ['application/json'],
    title: 'express-transformer-swagger',
    version: '1.0',
});

app.use('/api-docs', serve, setup(document));

createServer(app).listen(3000, () => console.log('server runs'));