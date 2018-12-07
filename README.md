[![NPM](https://img.shields.io/npm/v/afraid-swagger.svg)](https://www.npmjs.com/package/afraid-swagger)
[![Build Status](https://travis-ci.org/RobinBuschmann/afraid-swagger.svg?branch=master)](https://travis-ci.org/RobinBuschmann/afraid-swagger)

# afraid-swagger
> You already described all you routes with afraid? Fear the redundancy? Let's get a swagger documentation with nearly no effort!

## Installation
```bash
npm install afraid --save --no-optional
npm install afraid-swagger --save
```

## Usage
```typescript
import {query, f, fail} from 'afraid';
import {swagger, responseBody} from 'afraid-swagger';
import * as express from 'express';

const app = express();

app.use('/api-docs', swagger({version: '1.0', title: 'API Docs'})); // 🎉

app.get('/users', [
    query(
        f('limit').int(),
        f('offset').int(),
        f('filters').string().array().opt(),
    ),
    responseBody(
        f('id').int(),
        f('name').string(),
    ),
    fail,
], (req, res, next) => {
    // ...
});
```

## Using classes for validation and transformation (optional)

#### Installation
Omitting `--no-optional` will install required packages `class-transformer` and `reflect-metadata` automatically
```
npm install afraid --save 
```
#### Configuration
The following flags in `tsconfig.json`:
```json
{
  "experimentalDecorators": true,
  "emitDecoratorMetadata": true
}
```

#### Usage
```typescript
import {body, Field, IsInt, fail} from 'afraid';
import {swagger, responseBody} from 'afraid-swagger';
import * as express from 'express';

const app = express();

class CreateUserDTO {
    @Field name: string;
    @IsInt() @Field age: number;
}

class UserDTO {
    @Field id: number;
    @Field name: string;
    @IsInt() @Field age: number;
}

app.use('/api-docs', swagger({version: '2.0', title: 'API Docs'}));  // 🎉

app.post('/users', [
    body(CreateUserDTO),
    responseBody(UserDTO),
    fail,
], (req, res, next) => {
    // ...
});
```
