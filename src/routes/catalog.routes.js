import express from 'express';
import { renderCatalog, renderCatalogByGenre, renderCatalogByPlatform, renderHome, renderProductDetails } from '../controllers/catalogController.js';
const router = express.Router();

router.get('/', renderHome);
router.get('/catalog', renderCatalog);
router.get('/catalog/platform/:platformSlug', renderCatalogByPlatform);
router.get('/catalog/genre/:genreSlug', renderCatalogByGenre);
router.get('/catalog/product/:productSlug', renderProductDetails);

export default router;