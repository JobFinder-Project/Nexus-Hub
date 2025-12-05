import dotenv from 'dotenv';

dotenv.config();

export default {
  secret: process.env.SESSION_SECRET || 'chave_secreta_padrao_insegura',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
  },
};
