///<reference path="lib/afraid-extension.d.ts"/>

import * as express from 'express';
import {Router} from 'express';
import {body, f, Field, params, query} from 'afraid';
import {swagger} from './lib/swagger';
import {createServer} from 'http';
import {responseBody, responseHeaders} from './lib/meta/middlewares';

const app = express();
const handler = (_, res) => res.sendStatus(200);

class UpdateUserDTO {
    @Field name: string;
    @Field birthday: Date;
}

class UserDTO {
    @Field id: string;
    @Field name: string;
    @Field birthday: Date;
}

app.use('/api-docs', swagger({
    title: 'afraid-swagger',
    version: '1.0',
}));

app.get('/users', [
    query(
        f('limit').int().opt(),
        f('offset').int().opt(),
        f('filters').string().array().opt(),
    ),
    responseBody(UserDTO).array(),
], handler);
app.get('/users/:id', [params(f('id').int())], handler);

app.post('/users', [
        body(
            f('name').string(),
            f('age').int(),
        ),
        responseBody(
            f('id').string(),
            f('name').string(),
            f('age').int(),
        ).httpCode(200),
        responseHeaders(
            f('X-Auth-Header').string()
                .description('Auth token')
        ).httpCode(200),
    ],
    (req, res, next) => {

    });


app.put('/users/:id', [
    params(f('id').int()),
    body(UpdateUserDTO),
], handler);

const friends = Router();

friends.get('/friends', handler);
friends.post('/friends', handler);

app.use(friends);

app.use((err, req, res, next) => {
   res.send(err);
});

createServer(app).listen(3000, () => console.log('server runs'));