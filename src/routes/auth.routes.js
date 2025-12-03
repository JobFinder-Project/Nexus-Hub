import express from 'express';
import {
  renderLogin,
  renderRegister,
  processLogin,
  processRegister,
  logout,
} from '../controllers/authController.js';

const router = express.Router();

router.get('/login', renderLogin);
router.get('/register', renderRegister);
router.post('/login', processLogin);
router.post('/register', processRegister);
router.get('/logout', logout);

export default router;
