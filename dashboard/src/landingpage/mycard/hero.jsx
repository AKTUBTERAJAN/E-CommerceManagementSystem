import React, { useState } from "react";
import { useCart } from "./cardconext";
import { useNavigate } from "react-router-dom";

function MyCart() {
  const navigate = useNavigate();
  const { cart, removeCart } = useCart();
  const cartData = cart;

  const checkoutAll = () => {
    alert("Proceeding to Checkout...");
  };

  return (
    <>
      <div className="text-center fs-2">
        Our{" "}
        <b className="txt-mycolor">
          <u>Cart Item</u>{" "}
          <i className="fa fa-shopping-cart" aria-hidden="true"></i>
        </b>
      </div>

      <h6 className="text-center">
        Your all added item in cart
      </h6>

      <div className="row p-3">
        <div className="col-9 mx-auto">

          {cartData.map((item) => (

            <div
              className="card mb-3 bg-mycolor"
              
              key={item.id}
            >
              <div className="row g-0 align-items-center">

                <div className="col-2 p-2">
                  <img
                    src={item.product_pic}
                    alt={item.product_name}
                    className="img-fluid rounded-start"
                    style={{
                      height: "130px",
                      width: "130px",
                      padding: "10px",
                      objectFit: "contain",
                    }}
                  />
                </div>

                <div className="col-md-10">

                  <div className="card-body">

                    <table className="table table-hover">

                      <thead>
                        <tr>
                          <th>Cart Id</th>
                          <th>Product</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Subtotal</th>
                          <th>Added Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr>

                          <td>{item.id}</td>

                          <td>
                            <b>{item.subcategory_name}</b>
                            <br />
                            <small>{item.product_quantity}</small>
                          </td>

                          <td>{item.quantity}</td>

                          <td>₹ {item.discount_price}/-</td>

                          <td>₹ {item.total_price}/-</td>

                          <td>{item.added_date}</td>

                          <td>

                              <button
                              className="btn btn-success btn-sm me-2"
                              onClick={() =>
                                navigate("/orderinformation", {
                                  state: {
                                    product: item,
                                  },
                                })
                              }
                            >
                              Place Order
                            </button>


                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => removeCart(item.id)}
                            >
                              Remove
                              <i className="fa fa-trash ms-1"></i>
                            </button>

                          </td>     

                        </tr>
                      </tbody>

                    </table>

                  </div>

                </div>

              </div>
            </div>

          ))}

          {cartData.length > 0 && (
            <button
              className="btn btn-danger"
              onClick={checkoutAll}
            >
              CHECKOUT ALL
            </button>
          )}

          {cartData.length === 0 && (
            <div className="alert alert-warning text-center">
              Your Cart is Empty
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default MyCart;