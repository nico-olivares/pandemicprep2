const { client } = require('../client');


async function addProduct_Categories(prodId, catId) {
try {
    const { rows: [product_categoriesItem]} = client.query(
        `
INSERT INTO products_categories ("productId", "categoryId")
VALUES ($1, $2);
`,
        [newProductId, catId],
    )
    if (product_categoriesItem) {
        return product_categoriesItem;
    } else {
        return false;
    }
} catch (error) {
    throw error;
}

}

module.exports = { addProduct_Categories};