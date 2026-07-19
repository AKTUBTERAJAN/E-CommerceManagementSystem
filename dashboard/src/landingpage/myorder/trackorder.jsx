import React from "react";
import { useLocation } from "react-router-dom";

function TrackOrder() {

  const location = useLocation();

  const order = location.state?.order;

  if (!order) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning text-center">
          Order Not Found
        </div>
      </div>
    );
  }

  const steps = [
  { title: "Order Confirmed", icon: "fa fa-check-circle" },
  { title: "Processing", icon: "fa-cog" },
  { title: "Packed", icon: "fa fa-dropbox" },
  { title: "Shipped", icon: "fa fa-truck" },
  { title: "Out For Delivery", icon: "fa-motorcycle" },
  { title: "Delivered", icon: "fa-home" },
];

  return (
    <>
      <div className="container mt-4">

        <div className="text-center fs-2">
          Track <b className="txt-mycolor"><u>Order</u><i class="fa fa-truck me-1" aria-hidden="true"></i></b>
        </div>

        <h6 className="text-center mb-4">
          Live Order Tracking
        </h6>

        <div className="card shadow bg-mycolor text-white">

          <div className="card-body">

            <div className="row">

              <div className="col-md-4 text-center">

                <img
                  src={order.product_pic}
                  alt=""
                  className="img-fluid"
                  style={{
                    height: "220px",
                    objectFit: "contain"
                  }}
                />

                <h4 className="mt-3">
                  {order.subcategory_name}
                </h4>

              </div>

              <div className="col-md-8">

                <h5>Tracking Details</h5>

                <hr />

                <p>
                  <b>Order ID :</b> {order.orderId}
                </p>

                <p>
                  <b>Status :</b>

                  <span className="badge bg-success ms-2">

                    {order.status}

                  </span>

                </p>

                <div className="progress mt-3">

                  <div
                    className="progress-bar progress-bar-striped progress-bar-animated bg-success"
                    style={{
                      width: `${(order.statusStep / 5) * 100}%`
                    }}
                  ></div>

                </div>

                <div className="mt-4">

               {
  steps.map((step, index) => (

    <div
      key={index}
      className="d-flex align-items-center mb-3"
    >

      <div
        style={{
          width: "35px",
          height: "35px",
          borderRadius: "50%",
          background:
            index <= order.statusStep
              ? "green"
              : "#ccc",
          color: "white",
          textAlign: "center",
          lineHeight: "35px",
          marginRight: "15px",
          fontSize: "18px"
        }}
      >

        <i className={`fa ${step.icon}`}></i>

      </div>

      <div>

        <b>{step.title}</b>

      </div>

    </div>

  ))
}

                </div>

                <hr />

                <p>

                  <b>Expected Delivery :</b>

                  {" "}

                  {new Date(
                    Date.now() +
                      4 * 24 * 60 * 60 * 1000
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

export default TrackOrder;