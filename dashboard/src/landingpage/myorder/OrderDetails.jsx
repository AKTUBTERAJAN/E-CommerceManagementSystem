import React from "react";
import { useLocation } from "react-router-dom";

function OrderDetails() {

  const location = useLocation();

  const order = location.state?.order;

  if (!order) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          Order Not Found
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mt-4">

        <div className="text-center fs-2">
          Order <b className="txt-mycolor"><u>Details</u><i class="fa fa-eye p-2" aria-hidden="true"></i></b>
        </div>

        <h6 className="text-center mb-4">
          Complete information about your order
        </h6>

        <div className="card shadow bg-mycolor text-white ">

          <div className="row g-0">

            <div className="col-md-4 text-center p-3">

              <img
                src={order.product_pic}
                className="img-fluid"
                style={{
                  height: "250px",
                  objectFit: "contain"
                }}
                alt=""
              />

            </div>

            <div className="col-md-8">

              <div className="card-body">

                <h3>{order.subcategory_name}</h3>

               <hr className="border border-light opacity-50 my-4" />

                <p><b>Order ID :</b> {order.orderId}</p>

                <p><b>Price :</b> ₹ {order.discount_price}</p>

                <p><b>Quantity :</b> {order.quantity}</p>

                <p><b>Total :</b> ₹ {order.total_price}</p>

                <p><b>Payment :</b> Wallet</p>

                <p><b>Status :</b>

                  <span className="badge bg-success ms-2">

                    {order.status}

                  </span>

                </p>

               <hr className="border border-light opacity-50 my-4" />

                <h5>Customer Information</h5>

                <p><b>Name :</b> {order.customer.name}</p>

                <p><b>Mobile :</b> {order.customer.mobile}</p>

                <p><b>Email :</b> {order.customer.email}</p>

                <p><b>Address :</b> {order.customer.address}</p>

               <hr className="border border-light opacity-50 my-4" />

                <h5>Delivery Information</h5>

                <p>

                  <b>Expected Delivery :</b>

                  {" "}

                  {new Date(
                    Date.now() + 4 * 24 * 60 * 60 * 1000
                  ).toLocaleDateString()}

                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </>
  );
}

export default OrderDetails;