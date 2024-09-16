const pool = require('../../../db');
const queries = require('../queries');

function updateClientInDatabase(name, surname, email, userId) {
    return new Promise((r) => {
        pool.query(
            queries.updateClient, [name, surname, email, userId],
            (error, results) => {
                if (error) {
                    console.log(error);
                    return;
                }
                r(results.rows);
                return results.rows;
            }
        );
    })
}

async function updateClient(req, res) {
    const { user_id, client_name, client_surname, phone_number } = req.body;
    const result = await updateClientInDatabase(client_name, client_surname, phone_number, user_id);
    return res.status(200).json(req.body);
}

module.exports = {
    updateClient
}