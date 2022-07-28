import Koa from 'koa';
import banner from './banner';
import cors from '@koa/cors';
import logger from 'koa-logger';
import Router from '@koa/router';

const app = new Koa();
const router = new Router();
router.get('/', function (ctx) {
  ctx.body = banner;
});

app.use(cors()).use(logger()).use(router.routes());
const port = process.env.npm_package_port;
app.listen(port);
console.log(banner);
console.log(`Started: http://localhost:${port}`);
