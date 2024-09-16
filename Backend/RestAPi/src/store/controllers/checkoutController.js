const pool = require("../../../db");
const queries = require("../queries");

async function setOrder(client_id, order_date, total_amount, shipping_city, shipping_address, is_paid) {
    return new Promise((r) => {
        pool.query(
            queries.addOrder, [client_id, order_date, total_amount, shipping_city, shipping_address, is_paid],
            (error, results) => {
                try {
                    r(results.rows);
                    return results.rows;
                } catch (err) {
                    console.log(err);
                }
            }
        )
    });
}

async function setOrderBody(order_id, product_id, quantity, price_per_unit, total_price) {
    return new Promise((r) => {
        pool.query(
            queries.addOrderBody, [order_id, product_id, quantity, price_per_unit, total_price],
            (error, results) => {
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

async function getOrderId(client_id, order_date) {
    return new Promise((r) => {
        pool.query(
            queries.getOrderId, [client_id, order_date],
            (error, results) => {
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

async function addOrder(req, res) {
    try {
        const { client_id, order_date, total_amount, shipping_city, shipping_address, is_paid, products } = req.body;

        await setOrder(client_id, order_date, total_amount, shipping_city, shipping_address, is_paid);

        const order_ids = await getOrderId(client_id, order_date);
        const order_id = order_ids[0].order_id

        for (let i = 0; i < products.length; i++) {
            const { product_id, quantity, price_per_unit, total_price } = products[i];
            await setOrderBody(order_id, product_id, quantity, price_per_unit, total_price)
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    addOrder
}