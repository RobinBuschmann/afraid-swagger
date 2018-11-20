import * as express from 'express';
import {Router} from 'express';
import {body, f, Field, params, query} from 'afraid';
import {swagger} from './lib/swagger';
import {createServer} from 'http';

const app = express();
const handler = (_, res) => res.sendStatus(200);

class UpdateUserDTO {
    @Field name: string;
    @Field birthday: Date;
}

app.get('/users', [
    query(
        f('limit').int().opt(),
        f('offset').int().opt(),
        f('filters').string().array().opt(),
    ),
], handler);
app.get('/users/:id', [params(f('id').int())], handler);
app.post('/users', [
    body(
        f('name').string(),
        f('age').int(),
    ),
], handler);
app.put('/users/:id', [
    params(f('id').int()),
    body(UpdateUserDTO),
], handler);

const friends = Router();

friends.get('/friends', handler);
friends.post('/friends', handler);

app.use(friends);

// app.use('/api-docs', serve, setup(document));
app.use('/api-docs', swagger(app, {
    title: 'express-transformer-swagger',
    version: '1.0',
}));

createServer(app).listen(3000, () => console.log('server runs'));