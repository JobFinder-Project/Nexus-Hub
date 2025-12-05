import express from 'express';
import { isAuthenticated } from '../middlewares/authMiddleware.js';
import {
  renderCart,
  renderCheckout,
  renderLibrary,
  addToCart,
  removeFromCart,
  processCheckout,
  displayKeys,
} from '../controllers/userController.js';

const router = express.Router();

router.use(isAuthenticated);

router.get('/cart', renderCart);
router.get('/checkout', renderCheckout);
router.get('/library', renderLibrary);
router.post('/cart/add/:productId', addToCart);
router.post('/cart/remove/:productId', removeFromCart);
router.post('/checkout', processCheckout);
router.get('/library/keys/:purchaseId', displayKeys);

export default router;
