import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FreshCard from "./freshcard";
import { getProducts } from "../../api/products";

function Hero() {
  const [products, setProducts] = useState([]);

  const [searchParams] = useSearchParams();
  const sid = searchParams.get("sid");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts({
        fresh: true,
      });

      console.log("Fresh Products =", data);
      setProducts(data);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredProducts = sid
    ? products.filter((p) => p.sid === Number(sid))
    : products;

  return (
    <>
      <div
        className="text-center fs-2"
        style={{
          background:
            "linear-gradient(135deg,#e8f9e4 0%,#d8f5cf 30%,#c8efc3 60%,#f7fff3 100%)",
        }}
      >
        <h1
          style={{
            fontSize: "48px",
            fontWeight: "700",
            fontFamily: "Arial, sans-serif",
            margin: 0,
          }}
        >
          <span style={{ color: "#222222" }}>BigMall</span>

          <span style={{ color: "#7BC043" }}>
            {" "}
            <u>fresh</u>{" "}
            <i
              className="fa fa-product-hunt me-1"
              aria-hidden="true"
            ></i>
          </span>
        </h1>
      </div>

      <div className="row p-4 fresh-bg">
        <div className="col-sm-1"></div>

        <div className="col-sm-10">
          <div className="row">
            {filteredProducts.map((item) => (
              <FreshCard
                key={item._id}
                product={item}
              />
            ))}
          </div>
        </div>

        <div className="col-sm-1"></div>
      </div>
    </>
  );
}

export default Hero;