import React, { useEffect, useState } from "react";
import { getCancelledOrders } from "../../api/orders";

function CancelledOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadCancelledOrders();
  }, []);

  const loadCancelledOrders = async () => {
    try {
      const data = await getCancelledOrders();
      setOrders(data);
    } catch (error) {
      console.error("Failed to load cancelled orders", error);
    }
  };

  return (
    <div className="container mt-4">

      <h2 className="text-center">
        <span className="text-danger">
          Cancelled <u>Orders</u><i className="fa fa-times-circle ms-2"></i>
        </span>
      </h2>
      <h6 className="text-center mb-4">
          All  Cancel orders
        </h6>

      {orders.length === 0 ? (
        <div className="alert alert-warning text-center">
          No Cancelled Orders Found
        </div>
      ) : (
        <div className="row  mb-4">
          {orders.map((item) => (
            <div className="col-md-10 mx-auto mb-4" key={item._id}>

              <div className="card shadow">
                <div className="row g-0">

                  <div className="col-md-3 text-center p-3">
                    <img
                      src={item.product_pic}
                      alt={item.subcategory_name}
                      className="img-fluid"
                      style={{ height: "170px", objectFit: "contain" }}
                    />
                  </div>

                  <div className="col-md-9">
                    <div className="card-body bg-mycolor">

                      <h5>{item.subcategory_name}</h5>

                      <p>
                        <b>Order ID :</b> {item.orderId}
                      </p>

                      <p>
                        <b>Quantity :</b> {item.quantity}
                      </p>

                      <p>
                        <b>Total Price :</b> ₹ {item.total_price}
                      </p>

                      <p>
                        <b>Cancelled On :</b>{" "}
                        {new Date(item.cancelledAt).toLocaleString()}
                      </p>

                      <span className="badge bg-danger fs-6">
                        Cancelled
                      </span>

                    </div>
                  </div>

                </div>

              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default CancelledOrders;