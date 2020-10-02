/** @format */

import React, { useState } from "react";

import "./Cart.css";

import { addNewCart, removeProductFromCart } from "../../../../api";
// import { Product } from '../products/Product';

export const Cart = ({ cart, setCart, setCartSize, user }) => {
    const [shipping, setShipping] = useState(5.0);
    const removeHandler = (productId) => {
        const updatedCart = cart;
        removeProductFromCart({ cartId: cart.id, products_cartsId: productId }, user.token)
            .then((response) => {
                updatedCart.items = response;
                setCart(updatedCart);
                setCartSize(updatedCart.items.length);
                console.log("new cart ", cart);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <div id="cart-component">
            <h1>{user.firstName !== "Guest" ? user.firstName + "'s" : ""} Cart</h1>
            <div id="tables-outer-container">
                <div id="cart-container">
                    <div className="cart-titles">
                        <div></div>
                        <span className="cart-title">Product</span>
                        <span className="cart-quantity">Quantity</span>
                        <div></div>
                        <span className="cart-price">Price</span>
                        <span className="cart-total">Total</span>
                    </div>
                    <div className="cart-grid">
                        {cart.items.map((product, i) => {
                            return (
                                <div key={i} id="cart-row-container">
                                    <img
                                        className="cart-image cart-field"
                                        src={process.env.PUBLIC_URL + product.image}
                                    />
                                    <label className="cart-field cart-product-title">
                                        {product.title}
                                    </label>
                                    <label className="cart-field cart-product-quantity">
                                        {product.quantity}
                                    </label>
                                    <div className="cart-buttons">
                                        <button className="uptick cart-field tick">&#11014;</button>
                                        <button className="downtick cart-field tick">
                                            &#11015;
                                        </button>
                                    </div>
                                    <label className="cart-field cart-product-price">
                                        {product.unitPrice}
                                    </label>
                                    <label className="cart-field cart-product-total">
                                        {product.itemTotal}
                                    </label>
                                    <button
                                        className="cart-field cart-delete"
                                        onClick={() => {
                                            removeHandler(product.jointId);
                                        }}
                                    >
                                        remove
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div id="total-outer-container">
                    <div id="total-container">
                        <span className="total-title total">Cart Summary</span>
                        <span className="total-label total">Sub-Total:</span>
                        <span className="total-amount total">${cart.total}</span>
                        <span className="total-label total">Shipping:</span>
                        <span className="total-shipping total">${shipping}</span>
                        <span className="total-label total">Total:</span>
                        <span className="total-total total">
                            ${parseFloat(cart.total) + shipping}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
