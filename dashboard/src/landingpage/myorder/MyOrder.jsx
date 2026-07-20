import React from "react";
import { useOrder } from "./ordercontext";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../wallet/walletcontext";
import downloadInvoice from "./invoice";


function MyOrder() {
  const navigate = useNavigate();
  const { refundMoney } = useWallet();
  const { orders, updateOrderStatus } = useOrder();

  return (
    <>
      <div className="container ">

        <div className="text-center fs-2">
          My <b className="txt-mycolor"><u>Orders</u> <i class="fa fa-shopping-bag me-1" aria-hidden="true"></i></b>
        </div>

        <h6 className="text-center mb-4">
          Track your placed orders
        </h6>

        {orders.length === 0 ? (

          <div className="alert alert-warning text-center">
            No Orders Found
          </div>

        ) : (

          <div className="row ">

            {orders.map((item) => (

              <div
                className="col-md-10 mx-auto "
                key={item.id}
              >

                <div className="card shadow mb-4 ">

                  <div className="row g-0">

                    <div className="col-md-3 text-center p-3" style={{background:"#ccc"}}>

                      <img
                        src={item.product_pic}
                        alt={item.subcategory_name}
                        className="img-fluid"
                        style={{
                          height: "170px",
                          objectFit: "contain"
                        }}
                      />
                      <h6 className="mt-2 text-primary">
                        Order ID : {item.orderId}
                      </h6>

                    </div>

                    <div className="col-md-9">

                      <div className="card-body bg-mycolor text-white">

                      <h5 className="fw-bold mb-2">
                        {item.subcategory_name}
                      </h5>

                    <div className="row">

                      <div className="col-md-6">

                        <p className="mb-1">
                          <b>Quantity :</b> {item.quantity}
                        </p>

                        <p className="mb-1">
                          <b>Price :</b> ₹ {item.discount_price}
                        </p>

                        <p className="mb-1">
                          <b>Total :</b> ₹ {item.total_price}
                        </p>

                        <p className="mb-1">
                          <b>Order Date :</b> {item.added_date}
                        </p>

                      </div>

                      <div className="col-md-6">

                        <p className="mb-1">
                          <b>Name :</b> {item.customer.name}
                        </p>

                        <p className="mb-1">
                          <b>Mobile :</b> {item.customer.mobile}
                        </p>

                        <p className="mb-2">
                          <b>Address :</b> {item.customer.address}
                        </p>
                        <hr className="border border-light opacity-50 my-4" />

                          <div className="row">

                            <div className="col-md-6">

                              <p className="mb-1">
                                <b>Payment :</b> Wallet
                              </p>

                              <p className="mb-1">
                                <b>Order ID :</b> {item.orderId}
                              </p>

                            </div>

                            <div className="col-md-6">

                              <p className="mb-1">
                                <b>Email :</b> {item.customer.email}
                              </p>

                            </div>

                          </div>
                              </div>

                            </div>

                          <hr className="border border-light opacity-50 my-4" />

                          <span
                          className={`badge fs-6 ${
                          item.status==="Delivered"
                          ?"bg-success"
                          :item.status==="Cancelled"
                          ?"bg-danger"
                          :"bg-warning text-dark"
                          }`}
                          >

                          {item.status}

                          </span>
                          <div className="mt-3">

                            <button
                          className="btn btn-primary btn-sm me-2"
                          onClick={() =>
                          navigate("/trackorder",{
                          state:{
                          order:item
                          }
                          })
                          }
                          >
                          <i class="fa fa-truck me-1" aria-hidden="true"></i>
                          Track Order

                          </button>

                            <button
                          className="btn btn-info btn-sm me-2 text-white"
                          onClick={() =>
                          navigate("/orderdetails",{
                          state:{
                          order:item
                          }
                          })
                          }
                          >
                          <i class="fa fa-eye me-1" aria-hidden="true"></i>
                          View Details

                          </button>

                          <button
                          className="btn btn-danger btn-sm me-2"
                          onClick={() => {

                          if (item.status === "Delivered") {
                            alert("Your Product is Delivered.\nNow you cannot cancel this order.");
                            return;
                          }

                          if (item.status === "Cancelled") {
                            alert("Order Already Cancelled");
                            return;
                          }

                          refundMoney(item.total_price);

                          updateOrderStatus(
                            item.orderId,
                            "Cancelled",
                            -1
                          );

                          alert("Order Cancelled Successfully");

                          }}
                          >
                          <i class="fa fa-times-circle me-1" aria-hidden="true"></i>
                          Cancel Order

                          </button>
                          <button
                          className="btn btn-dark btn-sm"
                          onClick={() => downloadInvoice(item)}
                          >
                          <i className="fa fa-download me-1"></i>

                          Download Invoice

                          </button>
                          </div>
                          {
                          item.status==="Delivered"

                          ?

                          <p className="mt-3 text-success fw-bold fs-5">

                          <i className="fa fa-check-circle me-2"></i>

                          Your Product is Delivered Successfully

                          </p>

                          :

                          <p className="mt-3 text-white fw-bold">

                          Expected Delivery :

                          {new Date(
                          Date.now()+4*24*60*60*1000
                          ).toLocaleDateString()}

                          </p>

                          }

                          </div>
                          <div className="progress mt-3" style={{ height: "10px" }}>
                            <div
                              className={`progress-bar ${
                                item.status === "Cancelled"
                                  ? "bg-danger"
                                  : "bg-success"
                              }`}
                              style={{
                                width:
                                  item.status === "Cancelled"
                                    ? "100%"
                                    : `${item.statusStep * 20}%`,
                                transition: "0.8s",
                              }}
                            ></div>
                          </div>

                          <div className="d-flex justify-content-between mt-2 m-4">

                            <small
                              className={item.statusStep >= 0 ? "text-warning fw-bold fa fa-check-circle " : ""}
                            >
                              Confirmed
                            </small>

                            <small
                              className={item.statusStep >= 1 ? "text-info fw-bold fa fa-cog" : ""}
                            >
                              Processing
                            </small>

                            <small
                              className={item.statusStep >= 2 ? "text-primary fw-bold fa fa-dropbox" : ""}
                            >
                              Packed
                            </small>

                            <small
                              className={item.statusStep >= 3 ? "text-warning fw-bold fa fa-truck" : ""}
                            >
                              Shipped
                            </small>

                            <small
                              className={item.statusStep >= 5 ? "text-success fw-bold fa fa-check-square" : ""}
                            >
                              Delivered
                              {
                          item.status==="Cancelled" && (

                          <div className="text-center mt-3">

                          <span className="badge bg-danger fs-6">

                          <i className="fa fa-times-circle me-2"></i>

                          Order Cancelled

                          </span>

                          </div>

                          )
                          }
                            </small>

                          </div>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>
    </>
  );
}

export default MyOrder;