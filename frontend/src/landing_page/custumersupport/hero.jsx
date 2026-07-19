import React, { useState } from "react";
import { sendSupportMessage } from "../../api/support";

function CustomerSupport() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { data } = await sendSupportMessage(formData);
      alert(data.message || "Message sent successfully");
      setFormData({
        name: "",
        email: "",
        mobile: "",
        message: "",
      });
    } catch (error) {
      alert(error.response?.data?.message || "Message send failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
       <style>
        {`
          .form-control {
            height: 45px;
            margin-bottom: 1%;
          }
        `}
      </style>

      <div className="text-center fs-2">
        Contact <b style={{ color: "darkorange"}}><u>With Us </u><i className="fa fa-map-marker me-1" aria-hidden="true"></i></b>

        <h6>
          You can contact us by contact number or fill this form any time you
          need professional support <br />
          or have any question
        </h6>
      </div>

      <div className="row p-4">
        <div className="col-sm-7">
          <div className="row">
            <legend>
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
                <form onSubmit={handleSubmit}>
                  <u>Send Your Message</u>
                  <br />

                  Name
                  <input
                    type="text"
                    name="name"
                    placeholder="Name.."
                    className="form-control"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />

                  Email
                  <input
                    type="email"
                    name="email"
                    placeholder="Email.."
                    className="form-control"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />

                  Mobile
                  <input
                    type="number"
                    name="mobile"
                    placeholder="Mobile.."
                    className="form-control"
                    required
                    value={formData.mobile}
                    onChange={handleChange}
                  />

                  Message
                  <textarea
                    name="message"
                    className="form-control"
                    style={{ minHeight: "80px", resize: "none" }}
                    required
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>

                  <input
                    type="submit"
                    value={loading ? "Sending..." : "Send Message"}
                    className="btn bg-success"
                    disabled={loading}
                  />
                </form>
              </div>
            </legend>
          </div>
        </div>

        <div className="col-sm-5">
          <div className="row">
            <div
              className="col-sm-5"
              style={{
                border: "2px solid grey",
                backgroundColor: "rgb(241, 240, 240)",
                borderRadius: "5px",
                height: "470px",
                width: "400px",
              }}
            >
              <br />

              <h1 style={{ color: "orangered" }}>
                <u>Contact </u>Info
              </h1>

              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <b style={{ color: "darkorange", fontSize: "20px" }}>
                <i className="fa fa-map-marker " aria-hidden="true"></i>
                <u>Mall </u>Address
              </b>

              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              Plot No-55, Near by Banthara Post Office
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              Kanpur Road, Banthara
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              Banthara, Lucknow
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              Uttar Pradesh 226401

              <br />
              <br />

              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <b style={{ color: "darkorange", fontSize: "20px" }}>
                <i className="fa fa-phone-square" aria-hidden="true"></i>
                <u>Call </u>Us
              </b>

              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <a
                href="tel:+919653028979"
                style={{ textDecoration: "none", color: "grey" }}
              >
                +91 9653028979
              </a>

              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <a
                href="tel:+917052435535"
                style={{ textDecoration: "none", color: "grey" }}
              >
                +91 7052435535
              </a>

              <br />
              <br />

              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <b style={{ color: "darkorange", fontSize: "20px" }}>
                <i className="fa fa-envelope" aria-hidden="true"></i>
                <u>Mail </u>US
              </b>

              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <a
                href="mailto:rajankushwaha819@gmail.com"
                style={{ textDecoration: "none", color: "grey" }}
              >
                rajankushwaha819@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CustomerSupport;
