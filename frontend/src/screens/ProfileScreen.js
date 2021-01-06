import React, { useState, useEffect} from 'react';
import { Form, Button, Row, Col, Table} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { getUserDetails, userUpdateProfile } from "../actions/userActions";
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';
import { listMyOrders } from "../actions/orderActions"
import { LinkContainer } from "react-router-bootstrap"

const ProfileScreen = ({location, history}) => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState(null);
    const [successLocalState ,setSuccessLocalState] = useState(false)
    const dispatch = useDispatch();
    const userDetails = useSelector(state => state.userDetails)
    const userLogin = useSelector(state => state.userLogin)
    const userUpdateProfileState = useSelector(state => state.userUpdateProfile)
    const { userInfo } = userLogin
    const { loading, error, success, userUpdatedInfo} = userUpdateProfileState
    const orderListMy = useSelector(state => state.orderListMy)
    const {loading:loadingOrders, error:errorOrders, orders} = orderListMy
    useEffect(() => {
        if (!userInfo) {
          history.push('/login')
        } else {
          if (!userUpdatedInfo) {
            // dispatch({ type: USER_UPDATE_PROFILE_RESET })
            // dispatch(getUserDetails('profile'))
            dispatch(listMyOrders())
            setName(userInfo.name)
            setEmail(userInfo.email)
          } else {
            setName(userUpdatedInfo.name)
            setEmail(userUpdatedInfo.email)
          }
        }
      }, [dispatch, history, userInfo, userUpdatedInfo])
    
      

    const submitHandler = async (e) => {
        e.preventDefault();
        if(password !== confirmPassword){
            setMessage("Passwords do not match")
        } else {
          await dispatch(userUpdateProfile({
            id:userInfo._id,
            name,
            email,
            password
        }));
           setSuccessLocalState(true);
        }
    }

    return (
        <Row>
            {console.log(success)}
            {console.log(successLocalState)}
            <Col md={3}>
            <h2>User's Profile</h2>
            {message && <Message variant="danger">{message}</Message>}
            {error && <Message variant="danger">{error}</Message>}
            {successLocalState && <Message variant="success">Profile updated</Message>}
            {loading ? <Loader /> : (
               <Form onSubmit={submitHandler}>
               <Form.Group controlId = "name">
                       <Form.Label>Name</Form.Label>
                       <Form.Control 
                       type="text" 
                       placeholder="Enter your name" 
                       value={name} 
                       onChange={(e) => {
                        setName(e.target.value);
                        setSuccessLocalState(false);
                       }}>
                       </Form.Control>
                   </Form.Group>
   
                   <Form.Group controlId = "email">
                       <Form.Label>Email Adress</Form.Label>
                       <Form.Control 
                       type="email" 
                       placeholder="Enter Email" 
                       value={email} 
                       onChange={(e) => {
                         setEmail(e.target.value)
                         setSuccessLocalState(false);
                         }}>
                       </Form.Control>
                   </Form.Group>
   
                   <Form.Group controlId = "password">
                       <Form.Label>Password</Form.Label>
                       <Form.Control 
                       type="password" 
                       placeholder="Enter Password" 
                       value={password} 
                       onChange={(e) => {
                         setPassword(e.target.value)
                         setSuccessLocalState(false)
                         setMessage(null)
                         }}>
                       </Form.Control>
                       </Form.Group>
   
                       <Form.Group controlId = "confirmPassword">
                       <Form.Label>Confirm Password</Form.Label>
                       <Form.Control 
                       type="password" 
                       placeholder="Confirm Password" 
                       value={confirmPassword} 
                       onChange={(e) => {
                         setConfirmPassword(e.target.value)
                         setSuccessLocalState(false);
                         setMessage(null)}}>
                       </Form.Control>
                   </Form.Group>
                   <Button type="submit" variant="primary">Update</Button>
               </Form>
            )}
            
            </Col>
            <Col md={9}>
              <h2>My Orders</h2>
                       {loadingOrders ? <Loader /> : errorOrders ? <Message variant="danger">{error}</Message>:(
                         <Table striped bordered hover responsive className="table-sm">
                           <thead>
                             <tr>
                               <th>ID</th>
                               <th>DATE</th>
                               <th>TOTAL</th>
                               <th>PAID</th>
                               <th>DELIVERED</th>
                               <th></th>
                             </tr>
                           </thead>
                           <tbody>
                             {!orders ? <Loader /> : orders.map(order => (
                               <tr>
                                 <td>{order._id}</td>
                                 <td>{order.createdAt.substring(0, 10)}</td>
                                 <td>{order.totalPrice}</td>
                                 <td>{order.isPaid ? order.paidAt.substring(0, 10):(
                                   <i className="fas fa-times" style={{color: "red"}}></i>
                                 )}</td>
                                 <td>{order.isDelivered ? order.deliveredAt.substring(0, 10):(
                                   <i className="fas fa-times" style={{color: "red"}}></i>
                                 )}</td>
                                 <td>
                                   <LinkContainer to={`/order/${order._id}`}>
                                     <Button className="btn-sm" variant="light">Details</Button>
                                   </LinkContainer>
                                 </td>
                               </tr>
                             ))}
                           </tbody>
                         </Table>
                       )}
            </Col>
        </Row>
    )
}

export default ProfileScreen
