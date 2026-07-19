import React, { useEffect } from "react";
import{Route,Routes, useLocation, useNavigate} from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Navbar from "./landingpage/navbar";
import CancelledOrders from "./landingpage/myorder/CancelledOrders";
import Foryou from "./landingpage/foryou/foryou";
import Fresh from "./landingpage/fresh/fresh";
import Mycard from "./landingpage/mycard/mycard";
import Product from "./landingpage/product/product"
import TodayDeals1 from "./landingpage/todaydeals/homepage"
import Homepage1 from "./landingpage/home/homepage"
import Custumersupport from "./landingpage/custumersupport/custumersupport"
import MyProfile from "./landingpage/myprofile/myprofile"
import Watchlist from "./landingpage/watchlist/watchlist"
import Account from "./landingpage/YourAccount/Account"
import Wallet from "./landingpage/wallet/wallet";
import Payment from "./landingpage/wallet/payment";
import OrderInformation from "./landingpage/myorder/OrderInformation";
import MyOrder from "./landingpage/myorder/MyOrder";
import OrderDetails from "./landingpage/myorder/OrderDetails";
import TrackOrder from "./landingpage/myorder/trackorder";
import NotFound from "./landingpage/notfound"
import Footer from "./landingpage/footer"
import Privacy from './landingpage/privacy/privacy';
import Prime from './landingpage/prime/prime';
import YourAddress from "./landingpage/youraddress/youraddress";
import Businessaccount from "./landingpage/businessaccount/businessaccount";
import PaymentOptions from "./landingpage/Paymentoptions/paymentoption";



function Homepage() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate(location.pathname || "/", { replace: true });
      return;
    }

    if (!localStorage.getItem("token")) {
      window.location.href =
        import.meta.env.VITE_FRONTEND_SIGNIN_URL || "http://localhost:5173/signin";
    }
  }, [location.pathname, location.search, navigate]);

  return (
    <>
        <Navbar />
        <Routes>
           <Route path="/cancelledorders" element={<CancelledOrders />} />
           <Route path="/mycart" element={<Mycard/>}/>
           <Route path="/*" element={<Foryou/>}/>
           <Route path="/fresh" element={<Fresh/>}/>
           <Route path="/product" element={<Product/>}/>
           <Route path="/todaydeals" element={<TodayDeals1/>}/>
           <Route path="/home" element={<Homepage1/>}/>
           <Route path="/customersupport" element={<Custumersupport/>}/>
           <Route path="/myprofile" element={<MyProfile/>}/>
           <Route path="/watchlist" element={<Watchlist/>}/>
           <Route path="/youraccount" element={<Account/>}/>
           <Route path="/wallet" element={<Wallet />} />
           <Route path="/payment" element={<Payment />} />
           <Route path="/orderinformation" element={<OrderInformation />}/>
           <Route path="/myorder" element={<MyOrder />} />
           <Route path="/orderdetails" element={<OrderDetails/>}/>
           <Route path="/trackorder" element={<TrackOrder/>}/>
           <Route path="*" element={<NotFound/>}/>
          <Route path="/privacy" element={<Privacy/>}/>
          <Route path="/prime" element={<Prime/>}/>
          <Route path="/youraddress" element={<YourAddress />} />
          <Route path="/business" element={<Businessaccount />} />
          <Route path="/paymentoptions" element={<PaymentOptions />} />

        </Routes>
       
        
      
        <Footer/>
    </>
  );
}

export default Homepage;
