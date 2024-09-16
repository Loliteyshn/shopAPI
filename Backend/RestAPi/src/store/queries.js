// Product
const getProduct =
    "select * from product inner join product_category ON product_category.category_id = product.category_id";
const getProductById =
    "SELECT * FROM product WHERE product_id = $1";
const checkNameExists =
    "SELECT p FROM product p WHERE p.product_name = $1";
const removeProduct =
    "DELETE FROM product WHERE product_id = $1";
const addProduct =
    "INSERT INTO product (product_name, price, color, category_id, soft_deleted, weekly_offers) VALUES ($1, $2, $3, $4, false, $5)";
const updateProduct =
    "UPDATE product SET product_name = $1, price = $2, color = $3, category_id = $4, weekly_offers = $5 WHERE product_id = $6";
const updateProductSize =
    "UPDATE product_size SET quantity = $1 WHERE product_id = $2 and product_size = $3";
const deleteProduct =
    "UPDATE product SET soft_deleted = true WHERE product_id = $1";
const getProductByName =
    "SELECT product_id from product where product_name = $1"
const addProductWithSizeAndQuantity =
    "INSERT INTO product_size(product_id, product_size, quantity) VALUES ($1, $2, $3)";
const getProductByNameAndCategoryId =
    "SELECT product_id FROM product WHERE product_name = $1 AND category_id = $2 AND soft_deleted != true";
const addImages =
    "insert into product_img(product_id, img_bytes) values($1, $2)";
const getImagesByProductId =
    "SELECT * from product_img where product_id = $1 ";
const deleteImageByProductId =
    "DELETE FROM img_bytes WHERE product_id = $1";
const deleteImagesByImageId =
    "DELETE FROM product_img WHERE img_id = $1";
const weeklyOffersProducts =
    "SELECT product.product_id, product_img.img_bytes, product.product_name, product.price FROM product left join product_img ON product_img.product_id = product.product_id WHERE weekly_offers=$1";
const getProductsByCategoryId =
    "SELECT * FROM product INNER JOIN product_size ON product_size.product_id = product.product_id WHERE product.category_id = $1";
const getProductsByCategoryName =
    "SELECT * FROM product INNER JOIN product_category ON product_category.category_id = product.category_id LEFT JOIN product_size ON product_size.product_id = product.product_id LEFT JOIN product_img ON product_img.product_id = product.product_id WHERE category_name = $1 AND soft_deleted = false";
const getInformationAboutProduct =
    "SELECT * FROM product INNER JOIN product_size ON product_size.product_id = product.product_id INNER JOIN product_img ON product_img.product_id = product.product_id WHERE product.product_id = $1";
const getProductNameByCategoryName =
    "SELECT product.product_name, product.weekly_offers, product.product_id, product_category.category_id, product_category.category_name, product_category.translated_name FROM product INNER JOIN product_category ON product_category.category_id = product.category_id WHERE category_name =$1 AND soft_deleted = false";
const updateWeeklyOffer =
    "UPDATE product SET weekly_offers = $1 where product_id = $2";
const getProductsListByCategoryName =
    "SELECT * FROM product INNER JOIN product_category ON product_category.category_id=product.category_id LEFT JOIN product_size ON product_size.product_id = product.product_id WHERE category_name=$1 AND soft_deleted=FALSE";

// Category
const getCategories =
    "SELECT * FROM product_category WHERE is_soft_deleted = false";
const getCategoryById =
    "SELECT * FROM product_category WHERE category_id = $1";
const updateCategory =
    "UPDATE product_category SET translated_name = $1 WHERE category_id = $2";
const addCategory =
    "INSERT INTO product_category (category_name, translated_name, is_soft_deleted) VALUES ($1, $2, false)";
const deleteCategory =
    "UPDATE product_category SET is_soft_deleted = true WHERE category_id = $1";
const getCategoryName =
    "SELECT category_id, category_name, translated_name FROM product_category WHERE is_soft_deleted = false";

// User
const getUserByEmailAndPassword =
    "select client.client_name, user_.user_email, user_role.role_value, user_.user_id, user_.isauthcompleted from client inner join user_ ON user_.user_id = client.user_id inner join user_role ON user_role.role_id = user_.role_id WHERE user_.user_email = $1 AND user_.user_password = $2";
const getUserByEmail =
    "select user_id, user_email from user_ WHERE user_email = $1";
const addUser =
    "INSERT INTO user_(user_email, user_password, role_id) VALUES($1, $2, 1)";
const addClient =
    "INSERT INTO client(client_name, client_surname, phone_number, user_id) VALUES($1, $2, $3, $4)";
const getUserByUserId =
    "select * from client where user_id = $1";
const updateClient =
    "UPDATE client SET client_name=$1, client_surname=$2, phone_number=$3 WHERE user_id=$4";
const setAuthCompleted =
    "UPDATE user_ SET isAuthCompleted=true WHERE user_email=$1";

// Checkout
const addOrder =
    "insert into order_(client_id, order_date, total_amount, shipping_city, shipping_address, is_paid) values ($1, $2, $3, $4, $5, $6)";
const addOrderBody =
    "insert into order_body(order_id, product_id, quantity, price_per_unit, total_price) values ($1, $2, $3, $4, $5)";
const getOrderId =
    "select order_id from order_ where client_id = $1 and order_date = $2";
const getAllOrderedProducts =
    "select * from order_ inner join order_body on order_body.order_id = order_.order_id inner join product ON product.product_id = order_body.product_id inner join product_img ON product_img.product_id = product.product_id where client_id = $1";

module.exports = {
    getProduct,
    getProductById,
    checkNameExists,
    addProduct,
    removeProduct,
    updateProduct,
    getCategories,
    getCategoryById,
    getProductsByCategoryId,
    getProductsByCategoryName,
    getInformationAboutProduct,
    getUserByEmailAndPassword,
    addUser,
    addClient,
    getUserByEmail,
    updateCategory,
    addCategory,
    deleteCategory,
    deleteProduct,
    getProductByName,
    addProductWithSizeAndQuantity,
    getProductByNameAndCategoryId,
    addImages,
    updateProductSize,
    getImagesByProductId,
    deleteImageByProductId,
    weeklyOffersProducts,
    getCategoryName,
    getProductNameByCategoryName,
    getProductsListByCategoryName,
    updateWeeklyOffer,
    getUserByUserId,
    addOrder,
    addOrderBody,
    getOrderId,
    updateClient,
    getAllOrderedProducts,
    deleteImagesByImageId,
    setAuthCompleted
};