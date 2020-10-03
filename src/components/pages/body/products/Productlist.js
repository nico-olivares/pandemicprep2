/** @format */

import React, { useState, useEffect } from "react";

import "./Productlist.css";
import "../MainBody.css";

import { Product } from "./Product";

import {
    getProductsByQuery,
    addNewProduct,
    getProductById,
    getProductsByCategory,
} from "../../../../api/products";
import { PageIndex } from "./PageIndex";

export const Productlist = ({
    products,
    setProducts,
    setProduct,
    NavLink,
    searchObject,
    searchString,
    category,
    pageType,
    setPageType,
}) => {
    const [categoryPage, setCategoryPage] = useState(1);
    const [searchPage, setSearchPage] = useState(1);

    return (
        <div className="productList">
            <p>List of Products</p>
            <h1>MainBody</h1>
            <div className="productContainer">
                {products.map((singleProduct, i) => {
                    return (
                        <NavLink className='product-card' key={i} to='/product' onClick={(event) => { setProduct(singleProduct) }}>
                            <div key={i} className="product" >
                                <div id='product' className="info">
                                    <p className="header">
                                        {singleProduct.title}
                                    </p>
                                    <img className="image" src={process.env.PUBLIC_URL + singleProduct.image} />
                                    <p className="description">
                                        {singleProduct.description}
                                    </p>
                                    <p className="price">
                                        $ {singleProduct.price}
                                    </p>
                                    
                                    {/* <button>Add to Cart</button> */}
                                </div>
                            </div>
                        </NavLink>
                    )
                })}
            </div>
            {/* <PageIndex
                searchObject={searchObject}
                pageType={pageType}
                setPageType={setPageType}
                setProducts={setProducts}
                products={products}
                category={category}
            /> */}
        </div>
    );
};