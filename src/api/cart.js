/** @format */

import axios from "axios";

/**
 * Adds Product to Cart
 * @param {object} product 
 * @param {string} token 
 */
export async function addProductToCart(product, token) {
    console.log('getting to addProduct to cart at api with ', product);
    try {
        const { data: addedProduct } = await axios.post("/api/cart/", product, {
            headers: { Authorization: "Bearer " + token },
        });
        return addedProduct;
    } catch (error) {
        console.error(error);
    }
}

/**
 * Removes Product from Cart
 * @param {object} param0 
 * @param {string} token 
 */
export async function removeProductFromCart({ cartId, products_cartsId }, token) {
    console.log("getting to remove at api ", cartId, products_cartsId);
    const query = cartId + "/product/" + products_cartsId;
    try {
        const { data: newItems } = await axios.delete("/api/cart/" + query, {
            headers: { Authorization: "Bearer " + token },
        });
        return newItems;
    } catch (error) {
        console.error(error);
    }
}

/**
 * Adjusts Item QTY in Cart
 * @param {integer} jointId 
 * @param {integer} quantity 
 * @param {string} token 
 */
export async function patchCartItemQuantity(jointId, quantity, token) {
    try {

    } catch (error) {
        console.error(error);
    }
}
