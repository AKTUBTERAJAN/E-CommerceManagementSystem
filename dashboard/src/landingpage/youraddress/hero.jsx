import React, { useEffect, useState } from "react";
import {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
} from "../../api/address";

const initialForm = {
  name: "",
  mobile: "",
  house: "",
  area: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  isDefault: false,
};

function Hero() {
  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // ==========================
  // Load Addresses
  // ==========================
  const loadAddresses = async () => {
    try {
      const res = await getAddresses();

      if (res.success) {
        setAddresses(res.addresses);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  // ==========================
  // Input Change
  // ==========================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ==========================
  // Save Address
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      let res;

      if (editingId) {
        res = await updateAddress(editingId, formData);
      } else {
        res = await addAddress(formData);
      }

      if (res.success) {
        await loadAddresses();

        setFormData(initialForm);
        setEditingId(null);
        setShowForm(false);

        alert(res.message);
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }

    setLoading(false);
  };

  // ==========================
  // Edit Address
  // ==========================
  const handleEdit = (item) => {
    setEditingId(item._id);

    setFormData({
      name: item.name,
      mobile: item.mobile,
      house: item.house,
      area: item.area,
      landmark: item.landmark,
      city: item.city,
      state: item.state,
      pincode: item.pincode,
      country: item.country,
      isDefault: item.isDefault,
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================
  // Delete Address
  // ==========================
  const handleDelete = async (id) => {
    const ok = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!ok) return;

    try {
      const res = await deleteAddress(id);

      if (res.success) {
        alert(res.message);
        loadAddresses();
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="container mt-4 mb-5  ">
    <h1 className="text-center">
      Your<b><span className="txt-mycolor "><u>Account</u><i class="fa fa-map-marker p-2" aria-hidden="true"></i></span></b> 
</h1>
      <div className="text-end mb-3">
        <button
          className="btn btn-warning"
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData(initialForm);
          }}
        >
          {showForm ? "Close Form" : "Add New Address"}
        </button>
      </div>

      {showForm && (
        <form className="card shadow p-4 mb-4" onSubmit={handleSubmit}>

          <div className="row">

            <div className="col-md-6 mb-3">
              <input
                className="form-control"
                placeholder="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <input
                className="form-control"
                placeholder="Mobile Number"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <input
                className="form-control"
                placeholder="House / Flat No."
                name="house"
                value={formData.house}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <input
                className="form-control"
                placeholder="Area / Street"
                name="area"
                value={formData.area}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <input
                className="form-control"
                placeholder="Landmark"
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6 mb-3">
              <input
                className="form-control"
                placeholder="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <input
                className="form-control"
                placeholder="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <input
                className="form-control"
                placeholder="Pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          <div className="form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              id="defaultAddress"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
            />

            <label
              className="form-check-label"
              htmlFor="defaultAddress"
            >
              Make this Default Address
            </label>
          </div>

          <button className="btn btn-success">
            {loading
              ? "Saving..."
              : editingId
              ? "Update Address"
              : "Save Address"}
          </button>

        </form>
      )}

      <div className="row">

        {addresses.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-info">
              No Address Found
            </div>
          </div>
        ) : (
          addresses.map((item) => (
            <div className="col-md-6 mb-4" key={item._id}>
              <div className="card shadow h-100">

                <div className="card-body  bg-mycolor">

                  {item.isDefault && (
                    <span className="badge bg-success mb-2">
                      Default
                    </span>
                  )}

                  <h5 >{item.name}</h5>
                  <b>
                  <p className="mb-1">{item.mobile}</p>

                  <p className="mb-1">
                    {item.house}, {item.area}
                  </p>

                  {item.landmark && (
                    <p className="mb-1">
                      Landmark : {item.landmark}
                    </p>
                  )}

                  <p>
                    {item.city}, {item.state} - {item.pincode}
                  </p>
                  </b>
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>

                </div>

              </div>
            </div>
          ))
        )}

      </div>

    </div>
  );
}

export default Hero;