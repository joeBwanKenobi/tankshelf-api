import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import passport from 'passport';
import { v4 as uuid } from 'uuid';
import { config } from './config';
import { tanksRouter } from './tanks/tanks.router';
import { authRouter } from './auth/auth.router';
import { isLoggedIn } from './middleware/auth.middleware';
import userRouter from './users/user.router';
import mediaRouter from './media/media.router';
const session = require('express-session');

if (!config.server.PORT) {
    process.exit();
}

const PORT: number = parseInt(config.server.PORT as string, 10);

const app = express();
// Setup cookie session
app.use(session({
    genid: (req: Request) => {
        return uuid();
    },
    name: 'tankSesh',
    resave: false,
    saveUninitialized: true,
    secret: config.auth.PASSPORT_SESSION_SECRET
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,POST,DELETE",
    credentials: true
}));
app.use(express.json());

app.use("/api/tanks/", tanksRouter);
app.use("/api/media/", mediaRouter);
app.use("/auth/", authRouter);
app.use("/user/", userRouter);

app.get('/failed', (req: Request, res: Response) => res.send('You failed to login'));
app.get('/good', isLoggedIn, (req: Request, res: Response) => res.send(`Welcome ${req.user.displayName}`));


app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});