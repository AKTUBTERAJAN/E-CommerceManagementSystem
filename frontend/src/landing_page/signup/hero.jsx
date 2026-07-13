import React from "react";

function Signup() {
  return (
    <>
        <style>
        {`
          .form-control{
            height:45px;
            margin-bottom:1%;
          }
        `}
      </style>

      <div className="text-center fs-2">
        Register{" "}
        <b className="txt-mycolor">
          <u>With Us</u> <i className="fa fa-user-plus me-1" aria-hidden="true"></i>  
        </b>
        <br />
        <h6>
          You are just one step behind to join the Our Website. I promise you
          to give my best product for you.
        </h6>
      </div>

      <legend>
        <div className="row p-4">
          <div className="col-sm-10 mx-auto">
            <div className="row">
              <div
                className="col-sm-7 mx-auto"
                style={{
                  border: "2px solid red",
                  padding: "10px",
                  borderRadius: "5px",
                  background:
                    "linear-gradient(60deg,#ffea00e6,#cc0041,#77cc00)",
                }}
              >
                <form encType="multipart/form-data">
                  Name
                  <div className="input-group my-2">
                    <span
                      className="input-group-text bg-mycolor text-light"
                      style={{
                        width: "50px",
                        textAlign: "center",
                        height: "45px",
                      }}
                    >
                      <i className="fa fa-user" aria-hidden="true"></i>
                    </span>

                    <input
                      type="text"
                      required
                      name="name"
                      placeholder="Name.."
                      className="form-control"
                    />
                  </div>

                  Email
                  <div className="input-group my-2">
                    <span
                      className="input-group-text bg-mycolor text-light"
                      style={{
                        width: "50px",
                        textAlign: "center",
                        height: "45px",
                      }}
                    >
                      <i class="fa fa-envelope " aria-hidden="true"></i>
                    </span>

                    <input
                      type="email"
                      required
                      name="email"
                      placeholder="Email.."
                      className="form-control"
                    />
                  </div>

                  Mobile
                  <div className="input-group my-2">
                    <span
                      className="input-group-text bg-mycolor text-light"
                      style={{
                        width: "50px",
                        textAlign: "center",
                        height: "45px",
                      }}
                    >
                      <i class="fa fa-phone-square " aria-hidden="true"></i>
                    </span>

                    <input
                      type="number"
                      required
                      name="mobile"
                      placeholder="Mobile.."
                      className="form-control"
                    />
                  </div>

                  Password
                  <div className="input-group my-2">
                    <span
                      className="input-group-text bg-mycolor text-light"
                      style={{
                        width: "50px",
                        textAlign: "center",
                        height: "45px",
                      }}
                    >
                      <i class="fa fa-key " aria-hidden="true"></i>
                    </span>

                    <input
                      type="password"
                      required
                      name="passwd"
                      placeholder="Password.."
                      className="form-control"
                    />
                  </div>

                  Profile Picture
                  <div className="input-group my-2">
                    <span
                      className="input-group-text bg-mycolor text-light"
                      style={{
                        width: "50px",
                        textAlign: "center",
                        height: "45px",
                      }}
                    >
                      <i class="fa fa-image" aria-hidden="true"></i>
                    </span>

                    <input
                      type="file"
                      required
                      name="fu"
                      className="form-control"
                    />
                  </div>

                  Address
                  <div className="input-group my-2">
                    <span
                      className="input-group-text bg-mycolor text-light"
                      style={{
                        width: "50px",
                        textAlign: "center",
                        height: "45px",
                      }}
                    >
                       <i class="fa fa-map-marker" aria-hidden="true"></i>
                    </span>

                    <textarea
                      className="form-control"
                      name="address"
                      placeholder="Address.."
                    ></textarea>
                  </div>

                  <input
                    type="submit"
                    value="Save"
                    className="btn bg-mycolor"
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </legend>
    </>
  );
}

export default Signup;