import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductSidebar from "./productsidebar";
import ProductCard from "./productcard";
import { getProducts, getSubcategories } from "../../api/products";


function Hero() {
  const [products, setProducts] = useState([]);
  const [subcat, setSubcat] = useState([]);

  const [searchParams] = useSearchParams();
  const sid = searchParams.get("sid");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const productData = await getProducts();
      const subcatData = await getSubcategories();

      setProducts(productData);
      setSubcat(subcatData);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredProducts = sid
    ? products.filter((p) => p.sid === Number(sid))
    : products;

  return (
    <>
      <div className="row p-4">
        <div className="col-sm-2">
          <ProductSidebar subcat={subcat} />
        </div>

        <div className="col-sm-10">
          <div className="row">
            {filteredProducts.map((item) => (
              <ProductCard
                key={item._id}
                product={item}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
export default Hero;