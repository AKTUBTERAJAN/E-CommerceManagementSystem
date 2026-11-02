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
      const [productResult, subcatResult] = await Promise.allSettled([
        getProducts(),
        getSubcategories(),
      ]);

      if (productResult.status === "fulfilled") {
        console.log("Products:", productResult.value.data);
        setProducts(productResult.value.data || []);
      } else {
        console.error("Products load error:", productResult.reason);
      }

      if (subcatResult.status === "fulfilled") {
        console.log("Subcategories:", subcatResult.value.data);
        setSubcat(subcatResult.value.data || []);
      } else {
        console.error("Subcategories load error:", subcatResult.reason);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const filteredProducts = sid
    ? products.filter((p) => Number(p.sid) === Number(sid))
    : products;

  return (
    <>
      <div className="row p-4">
        <div className="col-sm-2">
          <ProductSidebar subcat={subcat} />
        </div>

        <div className="col-sm-10">
          <div className="row">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((item) => (
                <ProductCard
                  key={item._id}
                  product={item}
                />
              ))
            ) : (
              <h4 className="text-center mt-5">No Products Found</h4>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Hero;
