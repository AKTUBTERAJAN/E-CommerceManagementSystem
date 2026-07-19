import React, { useState } from "react";
import { useWallet } from "../wallet/walletcontext";
import { useOrder } from "./ordercontext";
import { useCart } from "../mycard/cardconext";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { getCurrentUser } from "../../api/user";

function OrderInformation() {
  const navigate = useNavigate();

  const { balance, deductMoney } = useWallet();

  const { addOrder } = useOrder();

  const { removeCart } = useCart();

  const location = useLocation();

  const product = location.state?.product;

  const [userInfo, setUserInfo] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
  });

  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await getCurrentUser();
        setUserInfo({
          name: user.name || "",
          mobile: user.mobile || "",
          email: user.email || "",
          address: user.address || "",
        });
      } catch (error) {
        console.error("Failed to load user info", error);
      }
    };

    loadUser();
  }, []);

  const handleChange = (e) => {

    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });

  };

const placeOrder = async () => {

  if (
    userInfo.name === "" ||
    userInfo.mobile === "" ||
    userInfo.email === "" ||
    userInfo.address === ""
  ) {
    alert("Please Fill All Details");
    return;
  }

  if (balance < product.total_price) {
    alert("Insufficient Wallet Balance");
    return;
  }

  // Wallet se amount cut
 deductMoney(product.total_price);

  // Order save
  try {
    await addOrder(product, userInfo);
  } catch (error) {
    alert(error.message || "Order save failed");
    return;
  }

  // Cart se remove
  removeCart(product.id);

  alert("Order Placed Successfully");

  navigate("/myorder");

};

  return (
    <>
      <div className="container mt-4">

        <div className="text-center fs-2">
          Order <b className="txt-mycolor"><u>Information</u></b>
        </div>

        <h6 className="text-center mb-4">
          Fill your delivery details
        </h6>

        <div className="row">

          {/* Left Side */}

          <div className="col-md-7">

            <div className="card shadow">

              <div className="card-header bg-mycolor text-light">

                <b>Delivery Information</b>

              </div>

              <div className="card-body">

                <label>Name</label>

                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Enter Name"
                  name="name"
                  value={userInfo.name}
                  onChange={handleChange}
                />

                <label>Mobile Number</label>

                <input
                  type="number"
                  className="form-control mb-3"
                  placeholder="Enter Mobile Number"
                  name="mobile"
                  value={userInfo.mobile}
                  onChange={handleChange}
                />

                <label>Email</label>

                <input
                  type="email"
                  className="form-control mb-3"
                  placeholder="Enter Email"
                  name="email"
                  value={userInfo.email}
                  onChange={handleChange}
                />

                <label>Delivery Address</label>

                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Enter Complete Address"
                  name="address"
                  value={userInfo.address}
                  onChange={handleChange}
                ></textarea>

              </div>

            </div>

          </div>

          {/* Right Side */}

          <div className="col-md-5">

            <div className="card shadow">

              <div className="card-header bg-success text-light">

                <b>Order Summary</b>

              </div>

              <div className="card-body text-center">

                <img
                  src={product?.product_pic}
                  alt=""
                  style={{
                    height: "170px",
                    objectFit: "contain",
                  }}
                />

                <h5 className="mt-3">
                  {product?.subcategory_name}
                </h5>

                <p>
                  {product?.product_quantity}
                </p>

                <h5 className="text-danger">
                  ₹ {product?.discount_price}
                </h5>

                <h6>
                  Quantity : {product?.quantity}
                </h6>

                <hr />

                <h4>

                  Total : ₹ {product?.total_price}

                </h4>

                <button
                  className="btn bg-mycolor text-light w-100 mt-3"
                  onClick={placeOrder}
                >

                  Place Your Order

                </button>

              </div>

            </div>

          </div>

        </div>

      </div>
    </>
  );
}

export default OrderInformation;
