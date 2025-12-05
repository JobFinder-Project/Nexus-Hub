import express from 'express';
import {
  renderCatalog,
  renderHome,
  renderProductDetails,
} from '../controllers/catalogController.js';
const router = express.Router();

router.get('/', renderHome);
router.get('/catalog', renderCatalog);
router.get('/catalog/product/:productSlug', renderProductDetails);

export default router;
