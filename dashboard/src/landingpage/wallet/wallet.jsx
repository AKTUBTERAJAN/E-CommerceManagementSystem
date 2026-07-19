import React from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "./walletcontext";

function Wallet() {

  const navigate = useNavigate();

  const {
    balance,
    paymentAmount,
    setPaymentAmount,
    transactions,
  } = useWallet();

  return (
    <>
      <div className="text-center fs-2">
        My{" "}
        <b className="txt-mycolor"><u>Wallet</u><i class="fa fa-money p-2" aria-hidden="true"></i></b>
      </div>

      <h6 className="text-center">
        Add money securely to your BigMall Wallet
      </h6>

      <div className="row mt-4">

        <div className="col-sm-6 mx-auto">

          <div
            className="card shadow p-4"
            style={{
              background:
                "linear-gradient(60deg,#ffea00e6,#cc0041,#77cc00)",
              color: "white",
              borderRadius: "12px",
            }}
          >

            <h4 className="text-center">
              Available Balance
            </h4>

            <h1 className="text-center mt-3">
              ₹ {balance}
            </h1>

            <hr />

            <label className="fw-bold">
              Enter Amount
            </label>

            <input
              type="number"
              className="form-control mt-2"
              placeholder="Enter Amount"
              value={paymentAmount}
              onChange={(e) =>
                setPaymentAmount(e.target.value)
              }
            />
            <div className="mt-3">
  <label className="fw-bold">Quick Add</label>

  <div className="d-flex flex-wrap gap-2 mt-2">

    <button
      className="btn btn-outline-light"
      onClick={() => setPaymentAmount(100)}
    >
      ₹100
    </button>

    <button
      className="btn btn-outline-light"
      onClick={() => setPaymentAmount(200)}
    >
      ₹200
    </button>

    <button
      className="btn btn-outline-light"
      onClick={() => setPaymentAmount(500)}
    >
      ₹500
    </button>

    <button
      className="btn btn-outline-light"
      onClick={() => setPaymentAmount(1000)}
    >
      ₹1000
    </button>

    <button
      className="btn btn-outline-light"
      onClick={() => setPaymentAmount(2000)}
    >
      ₹2000
    </button>

  </div>
</div>
            <button
              className="btn btn-dark mt-3"
              onClick={() => {

                if (paymentAmount <= 0) {
                  alert("Enter Valid Amount");
                  return;
                }

                navigate("/payment");

              }}
            >
              <i className="fa fa-plus-circle me-2"></i>

              Add Money
            </button>

          </div>

        </div>

      </div>

      <div className="row mt-5">

        <div className="col-sm-8 mx-auto">

          <div className="card">

            <div className="card-header bg-mycolor text-light">

              <b>
                <i className="fa fa-history me-2"></i>

                Transaction History
              </b>

            </div>

            <div className="card-body">

              {
                transactions.length === 0 ?

                  <div className="text-center text-secondary">

                    No Transactions Found

                  </div>

                  :

                  <table className="table table-hover">

                    <thead>
<tr>
  <th>Amount</th>
  <th>Type</th>
  <th>Status</th>
  <th>Date</th>
  <th>Time</th>
</tr>
</thead>

                  <tbody>

{transactions.map((item) => (

<tr key={item.id}>

<td>₹ {item.amount}</td>

<td>

<span
className={`badge ${
item.type === "Credit"
? "bg-success"
: "bg-danger"
}`}
>

{item.type}

</span>

</td>

<td>{item.status}</td>

<td>{item.date}</td>

<td>{item.time}</td>

</tr>

))}

</tbody>

                  </table>

              }

            </div>

          </div>

        </div>

      </div>

    </>
  );
}

export default Wallet;