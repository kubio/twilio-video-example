require('babel-register');
require('dotenv').config();

const path = require('path');
const Koa = require('koa');
const serve = require('koa-static');
const Router = require('koa-router');
const app = new Koa();
const router = new Router();

const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

// response
router.get('/token/:room/:identity', (ctx) => {
    const token = new AccessToken(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_API_KEY, process.env.TWILIO_API_SECRET);
    token.identity = ctx.params.identity;
    const videoGrant = new VideoGrant({
        room: ctx.params.room
    });
    
    // Add the grant to the token
    token.addGrant(videoGrant);
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    ctx.body = {
        token: token.toJwt()
    };
});

app.use(serve(path.join(__dirname, 'client/build')))

app
    .use(router.routes())
    .use(router.allowedMethods());


app.listen(3001);