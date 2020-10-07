/** @format */

const { client } = require("../client");
const bcrypt = require("bcrypt");
const { addCart, getActiveCart } = require("../singletables/cart.js");
//LIMIT is the number of users per page in the Admin tab
const LIMIT = 10;

/**
 * Create new user by registration (first, last, email, pass minimum),
 * by guest purchase (all fields except for password),
 * @param {Object} {requires firstName, lastName, email}
 * returns a single object with { id, firstName, lastName, isAdmin, isUser, email, password,
 * addressLine1, addressLine2, city, state, zipcode, country, phone, creditcard } or
 * an object with an error message { message: 'the error' }
 */
async function addUser({
    firstName,
    lastName,
    isAdmin = false,
    isUser = false,
    email = null,
    password = "",
    addressLine1 = "",
    addressLine2 = "",
    city = "",
    state = "",
    zipcode = "",
    country = "",
    phone = null,
    creditCard = null,
}) {
    const SALT_COUNT = 13;
    let securedPassword = null;
    let securedCreditCard = null;

    try {
        if (email) {
            if (password.length > 0) {
                securedPassword = await bcrypt.hash(password, SALT_COUNT);
            }
            if (creditCard > 0) {
                securedCreditCard = await bcrypt.hash("" + creditCard, SALT_COUNT);
            }
            console.log("last check of secured password ", securedPassword);
            const {
                rows: [newUser],
            } = await client.query(
                `
            INSERT INTO users("isAdmin", "isUser", email, password, "firstName", "lastName", "addressLine1", "addressLine2", city, state, zipcode, country, phone, "creditCard")
            VALUES ($1, $2 ,$3 ,$4 ,$5 ,$6 ,$7 ,$8 ,$9 ,$10 ,$11 ,$12 ,$13, $14)
            ON CONFLICT DO NOTHING
            RETURNING *;
        `,

                [
                    isAdmin,
                    isUser,
                    email,
                    securedPassword,
                    firstName,
                    lastName,
                    addressLine1,
                    addressLine2,
                    city,
                    state,
                    zipcode,
                    country,
                    phone,
                    securedCreditCard,
                ]
            );

            if (newUser) {
                const activeCart = await addCart({
                    status: "active",
                    lastUpdated: new Date(),
                    total: 0,
                    userId: newUser.id,
                });
                activeCart.items = [];
                newUser.activeCart = activeCart;
                return newUser;
            } else {
                return { message: "email or credit card already exists" }; //See if need to change later
            }
        } else {
            return { message: "must enter unique email" };
        }
    } catch (error) {
        throw error;
    }
}

//retrieve a user (check if admin)

/**
 * Gets all users
 * @param {integer} pageNumber
 */
async function getAllUsers(pageNumber = 1) {
    try {
        const OFFSET = LIMIT * (pageNumber - 1);

        const { rowCount } = await client.query(`
            SELECT * FROM users;
        `);

        const { rows } = await client.query(`
            SELECT * FROM users
            LIMIT ${LIMIT} OFFSET ${OFFSET};
        `);

        const pageCount = Math.ceil(rowCount / LIMIT);
        console.log(pageCount, "pagecount in db");

        return [pageCount, rows];
    } catch (error) {
        throw error;
    }
}

/**
 * Patches (updates) the user by ID & Fields
 * @param {integer} id
 * @param {object} fields
 */
async function updateUser(id, fields = {}) {
    // Builds the set string
    const setString = Object.keys(fields)
        .map((key, index) => `"${key}"=$${index + 1}`)
        .join(", ");
    // Returns early if this is called without fields
    if (setString.length === 0) {
        return;
    }
    try {
        const {
            rows: [user],
        } = await client.query(
            `
      UPDATE users
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `,
            Object.values(fields)
        );

        return user;
    } catch (error) {
        throw error;
    }
}

/**
 * Gets the user by the userID
 * @param {integer} id
 */
async function getUserById(id) {
    try {
        const {
            rows: [user],
        } = await client.query(
            `
		SELECT * FROM users
		WHERE id = $1;`,
            [id]
        );
        if (user) {
            return user;
        } else {
            return { message: "no user by that id" };
        }
    } catch (error) {
        throw error;
    }
}

/**
 * Gets the User by their Email
 * @param {string} email
 */
async function getUserByEmail(email) {
    try {
        const {
            rows: [user],
        } = await client.query(
            `
        SELECT *
        FROM users
        WHERE email=$1;
        `,
            [email]
        );

        if (user) {
            const activeCart = await getActiveCart(user.id);
            user.activeCart = activeCart;
            console.log("from get user by email at the db ", user);
            return user;
        } else {
            return { message: "no user by that email" };
        }
    } catch (error) {
        throw error;
    }
}

module.exports = {
    addUser,
    getAllUsers,
    updateUser,
    getUserById,
    getUserByEmail,
};
