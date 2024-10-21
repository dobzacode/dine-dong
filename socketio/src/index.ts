import axios from 'axios';
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
  path: '/ws',
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
  console.log(socket.handshake.auth);
  const token = socket.handshake.auth?.token || null;
  if (token) {
    const req = { headers: { authorization: `Bearer ${token}` } } as Request;
    jwtCheck(req, null, next as NextFunction);
  } else {
    next(new Error('unauthorized'));
  }
});

io.on('connection', (socket) => {
  socket.on('sendMessage', async (message) => {
    console.log('Received message:', message);
    const token = socket.handshake.auth?.token;
    if (token) {
      try {
        const res = await axios.post('http://localhost:8000/api/messages', {
          message,
          token
        });
        console.log('Message sent:', res.data);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    } else {
      console.error('No token found');      
    }
  });
});

httpServer.listen(5000, () => {
  console.log('listening on port 5000');
});