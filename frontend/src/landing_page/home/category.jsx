import React from "react";
import { Link } from "react-router-dom";



function Category({ cdata }) {
    
  return (
  <>
    <div className="row category bg-mycolor py-4 p-4">
      {cdata.map((item) => (
        <div className="col-lg-2 col-md-4 col-sm-6 mb-3" key={item._id || item.id}>
          <div className="card h-100">

            <img
              src={item.product_pic}
              alt={item.cname}
              className="img-thumbnail"
              style={{
                maxHeight: "250px",
                objectFit: "cover",
              }}
            />

            <div className="card-body text-center ">
              <Link
                to={`/product?sid=${item.sid || item.id}`}
                style={{
                  textDecoration: "none",
                  color: "text-primary",
                }}
              >
                <b>{item.cname}</b>
              </Link>
            </div>

          </div>
        </div>
      ))}
    </div>
  </>
  );
}

export default Category;
