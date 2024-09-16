const { Router } = require('express');
const categoryController = require('./controllers/categoryController');
const router = Router();

router.get('/', categoryController.getCategories);
router.get('/:category_id', categoryController.getCategoryById);
router.get('/weekly/name', categoryController.getCategoriesName);
router.put('/update', categoryController.updateCategory);
router.post('/add', categoryController.addCategory);
router.put('/delete', categoryController.deleteCategory);

module.exports = router;