const pool = require('../../../db');
const queries = require('../queries');
const nodemailer = require('nodemailer');

async function approveRegistration(req, res) {
    const email = req.params.email;
    await setAuthCompleted(email);
    return res.redirect('http://localhost:4200/user-approve')
}

function setAuthCompleted(email) {
    return new Promise(r => {
        pool.query(queries.setAuthCompleted, [email], (error, results) => {
            try {
                r(results.rows);
                return results.rows;
            } catch (err) {
                console.log(err);
            }
        });
    });
}

async function registration(req, res) {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const phoneNumber = req.body.phoneNumber;

        const isEmailExists = await getUserByEmail(email);
        if (isEmailExists) {
            return res.status(200).json({
                email: email,
                error: 'Електронна пошта ' + email + ' вже існує!'
            });
        }

        await addUserEmailAndPassword(email, password);
        const newUser = await getUserByEmail(email);

        const addedClient = {};
        await addClient(firstname, lastname, phoneNumber, newUser.user_id);

        mailOptions.to = email;
        mailOptions.html = `<p>Дякую, ${firstname} що вибрали нас!</p><p>Для підтвердження реєстрації перейдіть по <b><a href="http://localhost:3000/api/auth/approve-registration/${encodeURIComponent(email)}">посиланню</a></b></p>`;
        await transporter.sendMail(mailOptions);

        return res.status(200).json(addedClient);
    } catch (err) {
        console.log(err);
    }
}

function getUserByEmail(email) {
    return new Promise(r => {
        pool.query(queries.getUserByEmail, [email], (error, results) => {
            try {
                r(results.rows.at(0));
                return results.rows.at(0);
            } catch (err) {
                console.log(err);
            }
        });
    });
}

function addUserEmailAndPassword(email, password) {
    return new Promise(r => {
        pool.query(queries.addUser, [email, password], (error, results) => {
            try {
                r(results.rows);
                return results.rows;
            } catch (err) {
                console.log(err);
            }
        });
    });
}

function addClient(firstname, lastname, phoneNumber, userId) {
    return new Promise(r => {
        pool.query(queries.addClient, [firstname, lastname, phoneNumber, userId], (error, results) => {
            try {
                r(results.rows);
                return results.rows;
            } catch (err) {
                console.log(err);
            }
        });
    });
}

function loginUser(email, password) {
    return new Promise(r => {
        pool.query(queries.getUserByEmailAndPassword, [email, password], (error, results) => {
            try {
                r(results.rows);
                return results.rows;
            } catch (err) {
                console.log(err);
                return err;
            }
        });
    })
}

async function login(req, res) {
    const user = JSON.parse(req.query.client);
    const email = user.email;
    const password = user.password;
    const result = await loginUser(email, password);
    if (result.length == 0) {
        return res.status(404).json('Електронна адреса або пароль не був введенний');
    }

    console.log(result);
    if (!result[0].isauthcompleted) {
        return res.status(403).json('Зайдіть на вашу електронну пошту та підтвердіть свою особистість');
    }

    return res.status(200).json(result[0]);
}

function getClientByEmailAndPassword(email, password) {
    return new Promise(r => {
        pool.query(queries.getClientByEmailAndPassword, [email, password], (error, results) => {
            try {
                r(results.rows);
                return results.rows;
            } catch (err) {
                console.error(err);
            }
        })
    })
}

function getUserById(id) {
    return new Promise(r => {
        pool.query(queries.getUserByUserId, [id], (error, results) => {
            try {
                r(results.rows);
                return results.rows;
            } catch (err) {
                console.log(err);
            }
        });
    })
}

async function getUserByUserId(req, res) {
    const id = parseInt(req.params.user_id);
    const result = await getUserById(id);
    console.log(result);
    return res.status(200).json(result);
}

let transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    port: 587,
    host: 'smtp.gmail.com',
    auth: {
        user: 'sarafan.clothes@gmail.com',
        pass: 'bkau azku ywet tbyt'
    }
});

let mailOptions = {
    from: 'Sarafan Shop',
    subject: 'Sarafan Shop Registration',
};

module.exports = {
    login,
    registration,
    getClientByEmailAndPassword,
    getUserByUserId,
    approveRegistration
}