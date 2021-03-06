const { client } = require('../client');

/**
 * Gets category ID by category Name
 * @param {string} name 
 */
async function categoryIdByName(name) {
    try {
        if (name) {
            if (name.length > 0) {
                const {
                    rows: [index],
                } = await client.query(
                    `
    SELECT id 
    FROM categories
    WHERE name=$1;
`,
                    [name],
                );

                if (index) {

                    return index.id;
                } else {
                    const { rows: [newIndex] } = await client.query(`
            INSERT INTO categories (name)
            VALUES ($1)
            ON CONFLICT DO NOTHING
            RETURNING *;
            `, [name]);
                    if (newIndex) {
                        return newIndex.id;
                    } else {
                        return false;
                    }
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    } catch (error) {
        throw error;
    }
}


/**
 * Gets category by Name
 * @param {string} name 
 */
async function getCategoryByName(name) {
    try {
        const {
            rows: [category]
        } = await client.query(`
            SELECT * FROM categories
            WHERE name=$1;
        `, [name]);

        return category;
    } catch (error) {
        throw error;
    }
}

/**
 * Gets all categories
 */
async function getAllCategories() {
    try {
        const {
            rows
        } = await client.query(`
            SELECT * FROM categories;
        `);

        return rows;
    } catch (error) {
        throw error;
    }
}

module.exports = { categoryIdByName, getCategoryByName, getAllCategories };