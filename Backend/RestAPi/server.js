const express = require("express");
const bodyParser = require("body-parser");
const productRoutes = require("./src/store/productRoutes");
const categoryRoutes = require("./src/store/categoryRoutes");
const authRoutes = require("./src/store/authRoutes");
const checkoutRoutes = require("./src/store/checkoutRoutes");
const clientRoutes = require("./src/store/clientRoutes");
const pool = require("./db");
const queries = require('./src/store/queries');
const cors = require("cors");
const multer = require("multer");
const { checkout } = require("./src/store/authRoutes");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/client", clientRoutes);

app.post('/multipleFiles', upload.array('files'), (req, res, next) => {
    const files = req.files;
    const product_id = req.body.product_id;
    if (!files) {
        const error = new Error('No file');
        error.httpStatusCode = 400;
        return next(error);
    }

    for (let i = 0; i < files.length; i++) {
        const buffer = Buffer.from(files[i].buffer, 'utf-8');
        pool.query(queries.addImages, [product_id, buffer], (error, results) => {
            if (error) {
                return res.status(500).json(error);
            }
        });
    }
    res.send({ status: 'ok' });
})

app.listen(port, () => console.log(`app listening on port ${port}`));