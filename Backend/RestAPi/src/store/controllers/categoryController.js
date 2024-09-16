const pool = require("../../../db");
const queries = require("../queries");

const getCategories = (req, res) => {
    pool.query(queries.getCategories, (error, results) => {
        if (error) {
            return res.status(500).json(error);
        }
        return res.status(200).json(results.rows);
    });
};

const getCategoryById = (req, res) => {
    const id = parseInt(req.body.category_id);
    pool.query(queries.getCategoryById, [id], (error, results) => {
        if (error) {
            return res.status(500).json(error);
        }
        return res.status(200).json(results.rows);
    });
};

const getCategoriesName = (req, res) => {
    pool.query(queries.getCategoryName, (error, results) => {
        if (error) {
            return res.status(500).json(error);
        }
        return res.status(200).json(results.rows);
    });
}

const updateCategory = (req, res) => {
    const translated_name = req.body.translated_name;
    const category_id = parseInt(req.body.category_id);
    pool.query(
        queries.updateCategory, [translated_name, category_id],
        (error, results) => {
            if (error) {
                return res.status(500).json(error);
            }
            return res.status(200).send(results.rows);
        }
    );
};

const addCategory = (req, res) => {
    const category_name = req.body.category_name;
    const translated_name = req.body.translated_name;
    pool.query(
        queries.addCategory, [category_name, translated_name],
        (error, results) => {
            if (error) {
                return res.status(500).json(error);
            }
            return res.status(200).send(results.rows);
        }
    );
};

const deleteCategory = (req, res) => {
    const category_id = parseInt(req.body.category_id);
    pool.query(
        queries.getProductsByCategoryId, [category_id],
        (error, results) => {
            if (error) {
                return res.status(500).json(error);
            }
            for (let i = 0; i < results.rows.length; i++) {
                if (!results.rows[i].soft_deleted) {
                    return res.status(500).send("Category contains products");
                }
            }
            pool.query(queries.deleteCategory, [category_id], (error, results) => {
                if (error) {
                    return res.status(500).json(error);
                }
                return res.status(200).send(results.rows);
            });
        }
    );
};

module.exports = {
    getCategories,
    getCategoryById,
    updateCategory,
    addCategory,
    deleteCategory,
    getCategoriesName
};