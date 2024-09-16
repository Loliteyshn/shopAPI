const pool = require("../../../db");
const queries = require("../queries");
const fs = require("fs");
const res = require("express/lib/response");

const getProduct = (req, res) => {
    pool.query(queries.getProduct, (error, results) => {
        if (error) {
            return res.status(500).json(error);
        }
        return res.status(200).json(results.rows);
    });
};

const getProductNameByCategoryName = (req, res) => {
    const category_name = req.params.category_name;
    pool.query(queries.getProductNameByCategoryName, [category_name], (error, results) => {
        if (error) {
            return res.status(500).json(error);
        }
        return res.status(200).json(results.rows);
    });
};

const getProductById = (req, res) => {
    const id = parseInt(req.params.product_id);
    pool.query(queries.getProductById, [id], (error, results) => {
        if (error) {
            return res.status(500).json(error);
        }
        return res.status(200).json(results.rows);
    });
};

const getProductsByCategoryId = (req, res) => {
    const id = parseInt(req.params.category_id);
    pool.query(queries.getProductsByCategoryId, [id], (error, results) => {
        if (error) {
            return res.status(500).json(error);
        }
        return res.status(200).json(results.rows);
    });
};

function getProductsByCategoryNameFromDatabase(name) {
    return new Promise((r) => {
        pool.query(queries.getProductsListByCategoryName, [name], (error, results) => {
            try {
                const filteredProducts = results.rows.filter(
                    (product) => product.quantity >= 1
                );
                r(filteredProducts);
                return filteredProducts;
            } catch (err) {
                console.log(err);
            }
        });
    });
}

function getImagesByProductId(product_id) {
    return new Promise((r) => {
        pool.query(queries.getImagesByProductId, [product_id], (error, results) => {
            try {
                r(results.rows);
                return results.rows;
            } catch (err) {
                console.log(err);
            }
        });
    });
}

async function getProductsByCategoryName(req, res) {
    let filteredProducts = [];
    const name = req.params.category_name;
    const result = await getProductsByCategoryNameFromDatabase(name);

    for (let i = 0; i < result.length; i++) {
        // Get all products with the same Id
        const products = result.filter(x => x.product_id == result[i].product_id);

        // Check if we already have the same product in list
        if (!filteredProducts.find(x => x.product_id == result[i].product_id)) {
            let sizes = [];

            // Collect the sizes and quantities of product
            for (let j = 0; j < products.length; j++) {
                sizes.push({
                    product_size: products[j].product_size,
                    quantity: products[j].quantity,
                });
            }

            // Save product with sizes and quantities in list
            products[0].sizes = sizes;
            filteredProducts.push(products[0]);
        }
    }

    // Get images by Ids of the products
    for (let i = 0; i < filteredProducts.length; i++) {
        const convertedImages = [];
        // Get all images of a product
        const images = await getImagesByProductId(filteredProducts[i].product_id);
        for (let j = 0; j < images.length; j++) {
            // Convert each image into Base64 and save in list
            const imgBase64 = "data:image/jpeg;base64," + Buffer.from(images[j].img_bytes, "utf-8").toString("base64");
            convertedImages.push({
                imageId: images[j].img_id,
                imageBase64: imgBase64
            });
        }
        // Save converted images for product
        filteredProducts[i].imageBase64List = convertedImages;
    }
    return res.status(200).json(filteredProducts);
}

async function getInformationAboutProduct(req, res) {
    let productImages = [];
    let sizes = [];
    const id = parseInt(req.params.product_id);
    const result = await getProductInformationFromDatabase(id);

    // Convert images from bytes to base64
    for (let i = 0; i < result.length; i++) {
        if (result[i].img_bytes) {
            const imgBase64 = Buffer.from(result[i].img_bytes, "utf-8").toString(
                "base64"
            );
            if (!productImages.find(x => x == "data:image/jpeg;base64," + imgBase64)) {
                productImages.push("data:image/jpeg;base64," + imgBase64);
            }
        }
    }

    for (let i = 0; i < result.length; i++) {
        if (!sizes.find((x) => x.product_size == result[i].product_size)) {
            sizes.push({
                product_size: result[i].product_size,
                quantity: result[i].quantity,
            });
        }
    }

    const finalProduct = result[0];
    finalProduct.imageBase64List = productImages;
    finalProduct.sizes = sizes;

    return res.status(200).json(finalProduct);
}

function getProductInformationFromDatabase(id) {
    return new Promise((r) => {
        pool.query(queries.getInformationAboutProduct, [id], (error, results) => {
            try {
                r(results.rows);
                return results.rows;
            } catch (err) {
                console.error(err);
            }
        });
    });
}

async function getProductByName(productName) {
    return new Promise((r) => {
        pool.query(queries.getProductByName, [productName], (error, results) => {
            try {
                r(results.rows);
                return results.rows;
            } catch (err) {
                console.error(err);
            }
        });
    });
}

async function getProductByNameAndCategoryId(productName, categoryId) {
    return new Promise((r) => {
        pool.query(
            queries.getProductByNameAndCategoryId, [productName, categoryId],
            (error, results) => {
                try {
                    r(results.rows);
                    return results.rows;
                } catch (err) {
                    console.error(err);
                }
            }
        );
    });
}

async function addProductInDatabase(product_name, price, color, category_id, weekly_offers) {
    return new Promise((r) => {
        pool.query(
            queries.addProduct, [product_name, price, color, category_id, weekly_offers],
            (error, results) => {
                try {
                    r(results.rows);
                } catch (err) {
                    console.error(err);
                }
            }
        );
    });
}

async function addProductWithSizeAndQuantity(
    product_id,
    product_size,
    quantity
) {
    return new Promise((r) => {
        pool.query(
            queries.addProductWithSizeAndQuantity, [product_id, product_size, quantity],
            (error, results) => {
                try {
                    r(results.rows);
                    return results.rows;
                } catch (err) {
                    console.error(err);
                }
            }
        );
    });
}

async function addProduct(req, res) {
    try {
        const { product_name, price, color, category_id, weekly_offers } = req.body;
        let result = {};
        let product_id = 0;
        const ids = await getProductByNameAndCategoryId(product_name, category_id);
        if (ids.length > 0) {
            product_id = await getProductByName(product_name);
            await addProductWithSizeAndQuantity(
                ids[0].product_id,
                req.body.product_size,
                req.body.quantity
            );
        } else {
            result = await addProductInDatabase(
                product_name,
                price,
                color,
                category_id,
                weekly_offers
            );

            product_id = await getProductByName(product_name);

            await addProductWithSizeAndQuantity(
                product_id[0].product_id,
                req.body.product_size,
                req.body.quantity
            );
        }
        const isNewAdded = ids.length > 0 ? false : true;
        result = {
            product_id: product_id[0].product_id,
            isNewAdded: isNewAdded
        };
        return res.send(result);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

const removeProduct = (req, res) => {
    const id = parseInt(req.params.product_id);

    pool.query(queries.removeProduct, [id], (error, results) => {
        const noProductFound = !results.rows.length;
        if (noProductFound) {
            res.send("Product does not exists, could not remove");
        }

        pool.query(queries.removeProduct, [id], (error, results) => {
            if (error) throw error;
            res.status(200).send("Product removed successfuly.");
        });
    });
};

async function updateProductInDB(product_name, price, color, category_id, weekly_offers, id) {
    return new Promise((r) => {
        pool.query(
            queries.updateProduct, [product_name, price, color, category_id, weekly_offers, id],
            (error, results) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json(error);
                }
                r(results.rows);
                return results.rows;
            }
        );
    })
}

async function updateProductSize(quantity, id, product_size) {
    return new Promise((r) => {
        pool.query(
            queries.updateProductSize, [quantity, id, product_size],
            (error, results) => {
                if (error) {
                    return res.status(500).json(error);
                }
                r(results.rows);
                return results.rows;
            }
        );
    })
}

async function deleteProductImages(imageId) {
    return new Promise((r) => {
        pool.query(
            queries.deleteImagesByImageId, [imageId],
            (error, results) => {
                if (error) {
                    return res.status(500).json(error);
                }
                r(results.rows);
                return results.rows;
            }
        );
    })
}

async function updateProduct(req, res) {
    try {
        const id = parseInt(req.body.product_id);
        const { product_name, price, color, category_id, product_size, quantity, weekly_offers, imageBase64List } = req.body;

        if (imageBase64List) {
            for (let i = 0; i < imageBase64List.length; i++) {
                await deleteProductImages(imageBase64List[i].imageId);
            }
        }

        await updateProductInDB(product_name, price, color, category_id, weekly_offers, id);

        await updateProductSize(quantity, id, product_size);
        return res.send();

    } catch {
        return res.status(500).send(error);
    }
};

const deleteProduct = (req, res) => {
    const product_id = parseInt(req.body.product_id);
    pool.query(queries.deleteProduct, [product_id], (error, results) => {
        if (error) {
            return res.status(500).json(error);
        }
        return res.status(200).send(results.rows);
    });
};

function getWeeklyProducts(isWeeklyOffer) {
    return new Promise((r) => {
        pool.query(queries.weeklyOffersProducts, [isWeeklyOffer], (error, results) => {
            try {
                r(results.rows);
                return results.rows;
            } catch (err) {
                console.log(err);
            }
        });
    });
}

async function weeklyOffersProducts(req, res) {
    const result = await getWeeklyProducts(true);
    let productsList = [];
    for (let i = 0; i < result.length; i++) {
        if (!productsList.find(x => x.product_id == result[i].product_id)) {
            let productImages = [];
            if (result[i].img_bytes) {
                const imgBase64 = Buffer.from(result[i].img_bytes, "utf-8").toString(
                    "base64"
                );
                productImages.push("data:image/jpeg;base64," + imgBase64);
                result[i].imageBase64List = productImages;
                productsList.push(result[i]);
            }
        }
    }

    return res.status(200).json(productsList);
}

const updateWeeklyOffer = (req, res) => {
    const id = parseInt(req.body.product_id);
    const weekly_offers = req.body.weekly_offers;
    pool.query(queries.updateWeeklyOffer, [weekly_offers, id], (error, results) => {
        if (error) {
            return res.status(500).json(error);
        }
        return res.status(200).send(results.rows);
    })
}


async function updateWeekOfferInDatabase(product_id, weekly_offers) {
    return new Promise((r) => {
        pool.query(
            queries.updateWeeklyOffer, [weekly_offers, product_id],
            (error, results) => {
                if (error) {
                    return res.status(500).json(error);
                }
                r(results.rows);
                return results.rows;
            }
        )
    })
}

async function updateWeeklyOffersList(req, res) {
    try {
        const list = req.body.list;
        if (list.length == 1) {
            const { product_id, product_name, weekly_offers } = list[0];
            await updateWeekOfferInDatabase(product_id, weekly_offers);
            return res.status(200);
        }
        for (let i = 0; i < list.length; i++) {
            const { product_id, product_name, weekly_offers } = list[i];
            await updateWeekOfferInDatabase(product_id, weekly_offers);
        }

        return res.status(200);
    } catch {
        return res.status(500).send('Error while updating weekly products');
    }
}

function AllOrderedProducts(client_id) {
    return new Promise((r) => {
        pool.query(
            queries.getAllOrderedProducts, [client_id], (error, results) => {
                try {
                    r(results.rows);
                    return results.rows;
                } catch (err) {
                    console.log(err);
                }
            }
        )
    })
}

async function getAllOrderedProducts(req, res) {
    const client_id = parseInt(req.params.client_id);
    const result = await AllOrderedProducts(client_id);
    console.log(result);
    let product_list = [];

    for (let i = 0; i < result.length; i++) {
        if (!product_list.find(x => x.product_id == result[i].product_id)) {
            let productImages = [];
            if (result[i].img_bytes) {
                const imgBase64 = Buffer.from(result[i].img_bytes, "utf-8").toString(
                    "base64"
                );
                productImages.push("data:image/jpeg;base64," + imgBase64);
                result[i].imageBase64List = productImages;
                product_list.push(result[i]);
            }
        }
    }

    for (let i = 0; i < product_list.length; i++) {
        product_list[i].order_date = product_list[i].order_date.split(',')[0];
    }

    return res.status(200).send(product_list);
};

module.exports = {
    getProduct,
    getProductById,
    getProductsByCategoryId,
    getProductsByCategoryName,
    addProduct,
    removeProduct,
    updateProduct,
    getInformationAboutProduct,
    deleteProduct,
    weeklyOffersProducts,
    getProductNameByCategoryName,
    updateWeeklyOffer,
    updateWeeklyOffersList,
    getAllOrderedProducts
};