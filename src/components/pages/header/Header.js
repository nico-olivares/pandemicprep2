/** @format */

import React from "react";

import "./Header.css";

import { Login, Register } from "../../index";

export const Header = () => {
    return (
        <div className="headerContainer">
            <p>Header</p>
            <p className="span">LOG IN - LOG OUT - CART - SIGN UP</p>
        </div>
    );
};