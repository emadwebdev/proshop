import React, {useEffect, useState} from 'react';
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../actions/productActions.js"
import Loader from "../components/Loader.js";
import Message from "../components/Message.js";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";
import Meta from "../components/Meta";
import { Link } from "react-router-dom";

const HomeScreen = ({match}) => {
    const keyword = match.params.keyword
    const pageNumber = match.params.pageNumber || 1
    const dispatch = useDispatch();
    const productList = useSelector(state => state.productList);
    const {loading, error, products, page, pages} = productList
    useEffect(() => {
      dispatch(listProducts(keyword, pageNumber));

    }, [dispatch, keyword, pageNumber])

    return (
        <>  
            <Meta />
            {!keyword ?<ProductCarousel /> : <Link to="/" className="btn btn-primary my-3">Go Back</Link>}
            <h1>Latest Products</h1>
             {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message>:(
               <>
             <Row>
             {products.map(product => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                  <Product product={product}/>
                </Col> 
             ))}
           </Row>
           <Paginate page={page} pages={pages} keyword={keyword ? keyword : ""}/>
           </>
            )}
            
        </>
    )
}

export default HomeScreen
