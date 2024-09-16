const { Router } = require("express");
const productController = require("./controllers/productController");
const router = Router();

router.get("/", productController.getProduct);
router.get("/home", productController.weeklyOffersProducts);
router.get("/:category_name", productController.getProductsByCategoryName);
router.get("/byCategory/:category_id", productController.getProductsByCategoryId);
router.get("/:product_id", productController.getProductById);
router.get("/details/:product_id", productController.getInformationAboutProduct);
router.get("/product/bycategory/:category_name", productController.getProductNameByCategoryName);
router.delete("/:product_id", productController.removeProduct);
router.post("/add", productController.addProduct);
router.post("/edit", productController.updateProduct);
router.put("/delete", productController.deleteProduct);
router.put("/update/weeklyoffer", productController.updateWeeklyOffer);
router.put("/update/weeklyofferslist", productController.updateWeeklyOffersList);
router.get("/orderedproducts/:client_id", productController.getAllOrderedProducts);

module.exports = router;