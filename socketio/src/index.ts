import cors from 'cors';
import 'dotenv/config';
import express, { Express, NextFunction, Request, Response } from 'express';
import { createServer } from 'http';
import jwt from 'jsonwebtoken';
import jwks, { SigningKey } from 'jwks-rsa';
import { Server } from 'socket.io';

const app: Express = express();
app.use(cors());

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const jwtCheck = (req: Request, res: Response | null, next: NextFunction): void => {
  if (!req.headers.authorization) {
    next(new Error('unauthorized'));
    return;
  }

  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.decode(token, { complete: true });

  if (!decodedToken || typeof decodedToken === 'string') {
    next(new Error('unauthorized'));
    return;
  }

  const kid = decodedToken.header.kid;

  const client = jwks({
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  });

  client.getSigningKey(kid, (err: Error | null, key: SigningKey | undefined) => {
    if (err || !key) {
      next(new Error('unauthorized'));
    } else {
      const signingKey = key.getPublicKey();
      jwt.verify(token, signingKey, (err, decoded) => {
        if (err) {
          next(new Error('unauthorized'));
        } else {
          (req as any).user = decoded;
          next();
        }
      });
    }
  });
};

io.use((socket, next) => {
  if (socket.handshake.auth && socket.handshake.auth.token) {
    jwtCheck(socket.handshake as unknown as Request, null, next as NextFunction);
  } else {
    next(new Error('unauthorized'));
  }
});

httpServer.listen(5000);