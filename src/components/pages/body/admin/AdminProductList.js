import React, { useState, useEffect } from 'react';

import './AdminProductList.css';

import { getAllProducts, addNewProduct, updateProduct } from '../../../../api/index';

export const AdminProductList = ({user}) => {
    const [adminProductList, setAdminProductList] = useState([]);
    const [adminPage, setAdminPage] = useState(1);
    const [adminPageLimit, setAdminPageLimit] = useState(0);
    const [adminView, setAdminView] = useState('none');
    const [clickedIndex, setClickedIndex] = useState(-1);
    // input values for adding new product
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState(''); 
    const [price, setPrice] = useState(''); 
    const [imageURL, setImageURL] = useState(''); 
    // input values for editing a product
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState(''); 
    const [editPrice, setEditPrice] = useState(''); 
    const [editImageURL, setEditImageURL] = useState(''); 

    
    useEffect(() => {
        setAdminView('none');
        setTitle('');
        setDescription('');
        setPrice('');
        setImageURL('');
        getAllProducts(adminPage, user.token)
            .then((response) => {
                console.log('response and adminPage', response, adminPage)
                setAdminProductList(response[1]);
                setAdminPageLimit(response[0]);
            })
            .catch((error) => {
                console.error(error);
            })
    }, [adminPage])

    // Input value handlers
    const handleTitle = (event) => {
        setTitle(event.target.value);
    }
    const handleDescription = (event) => {
        setDescription(event.target.value);
    }
    const handlePrice = (event) => {
        setPrice(event.target.value);
    }
    const handleImageURL = (event) => {
        setImageURL(event.target.value);
    }
    const adminAddProduct = async (event) => {
        event.preventDefault();
        console.log('getting into add product subimt', imageURL)

        try {
            const newProduct = await addNewProduct({
                name: title,
                description,
                price,
                imageURL
            })
            console.log(newProduct, 'newProduct in addproduct submit')
            return newProduct;
        } catch (error) {
            throw error;
        }
    }

    const enableEditMode = (index, item) => {
        setClickedIndex(index);
        setTitle(item.title)
        if (adminView === 'none') {
            setAdminView('editOneProduct');
        }
    }
    const editProduct = async (event, item) => {
        event.preventDefault()
        try {
            const fields = {
                title: '' ? item.title : editTitle,
                description: '' ? item.description : editDescription,
                price: '' ? item.price : editPrice,
                image: ''? item.imageURL : editImageURL
            }

            const updatedProduct = await updateProduct({id: item.id, fields: fields, token: user.token});
            console.log(updatedProduct, 'updatedProduct in front end')
           
        } catch (error) {
            throw error;
        }
    }

    // Pagination handlers
    const firstHandler = () => {
        setClickedIndex(-1);
        if (adminPage > 1) {
            setAdminPage(1);
        }
    }
    const prevHandler = () => {
        setClickedIndex(-1);
        if (adminPage > 1) {
            setAdminPage(adminPage - 1);
        }
    }
    const nextHandler = () => {
        setClickedIndex(-1);
        if (adminPage < adminPageLimit) {
            setAdminPage(adminPage + 1);
        }
    }
    const lastHandler = () => {
        setClickedIndex(-1);
        if (adminPage < adminPageLimit) {
            setAdminPage(adminPageLimit);
        }
    }


    return (
        <div id='admin'>
            <form id='admin-list' onSubmit={adminAddProduct}>
                <span id='each-input'>Title:
                    <input type='text' placeholder='title' value={title} onChange={handleTitle}></input>
                </span>
            
                <span id='each-input'>Description:
                    <input type='text' placeholder='description' value={description} onChange={handleDescription}></input>
                </span>
            
                <span id='each-input'>Price:
                    <input type='text' placeholder='price' value={price} onChange={handlePrice}></input>
                </span>
            
                <span id='each-input'>ImageURL:
                    <input id='checkbox' placeholder='imageUrl' value={imageURL} onChange={handleImageURL}></input>
                </span>
                
                <button>Add New</button>
            </form>
            { adminProductList.map((item, index) => {
                    return (
                    <span key={index}>
                        
                            { adminView === 'editOneProduct' &&  clickedIndex === index ? /**edit mode ternary */  
                            <form id='admin-list' onSubmit={(event) => editProduct(event, item)}>                         
                                <span id='each-input'>Title:
                                    <input type='text' placeholder={item.title} 
                                    value={editTitle} onChange={(event) => {setEditTitle(event.target.value)}}></input>
                                </span>
                            
                                <span id='each-input'>Description:
                                    <input type='text'placeholder={item.description}
                                    value={editDescription} onChange={(event) => {setEditDescription(event.target.value)}} ></input>
                                </span>
                            
                                <span id='each-input'>Price:
                                    <input type='text' id='price-input' placeholder={item.price} 
                                    value={editPrice} onChange={(event) => {setEditPrice(event.target.value)}}></input>
                                </span>
                            
                                <span id='each-input'>ImageURL:
                                    <input id='checkbox' placeholder={item.image} 
                                    value={item.image} onChange={(event) => {setEditImageURL(event.target.value)}}></input>
                                </span>

                                <button type='button' onClick={enableEditMode} >Edit</button>
                                {adminView === 'editOneProduct' ? <button >Authorize</button> : ''}
                                
                            </form>
                            :
                            <form id='admin-list'>
                                <span id='each-input'>Title:
                                    <input type='text' readOnly placeholder={item.title} value={item.title}></input>
                                </span>
                            
                                <span id='each-input'>Description:
                                    <input type='text' readOnly placeholder={item.description} value={item.description}></input>
                                </span>
                            
                                <span id='each-input'>Price:
                                    <input type='text' id='price-input' readOnly placeholder={item.price} value={item.price}></input>
                                </span>
                            
                                <span id='each-input'>ImageURL:
                                    <input id='checkbox' readOnly placeholder={item.image} value={item.imageURL}></input>
                                </span>

                                <button type='button' onClick={() => {enableEditMode(index, item)}} >Edit</button>
                                {adminView === 'editOneProduct' ? <button >Authorize</button> : ''}
                                
                            </form>
                            }
                            
                            
                    </span>
                    )
                })
           
            }
            <div id='pagination'>
                { adminPage === 1 ? ''
                :
                <>
                    <a href='#' onClick={firstHandler}>❮❮</a>
                    <a href='#' onClick={prevHandler}>❮</a>
                </>
                }  
                <a href='#'>{adminPage}</a>
                { adminPage === adminPageLimit ? ''
                : 
                <>
                    <a href='#' onClick={nextHandler}>❯</a>
                    <a href='#' onClick={lastHandler}>❯❯</a>
                </>
                }
                
            </div>
        </div>
    )

}