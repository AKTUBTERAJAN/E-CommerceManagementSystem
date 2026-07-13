import React from "react";

function Hero() {
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

      <div className="text-center fs-2 ">
        <u>
          About</u> <b className="txt-mycolor">Us <i className="fa fa-info-circle me-1" aria-hidden="true"></i></b>
        

        <h6>
          There are Multiple reasons to choose us for multiple purpuse releted
          product explore. Belive me you <br />
          we find us best suibatle
        </h6>
      </div>

      <div className="row" style={{ padding: "30px" }}>
        <div className="col-6">
          <video
            src="media/Bigmall.mp4"
            autoPlay
            controls
            poster="media/Malls.png"
            className="w-100"
            style={{ height: "300px", textAlign: "left" }}
          ></video>
        </div>

        <div className="col-6">
          <h3>
            Welcome to Big Mall , Just Here is some little word to{" "}
            <u style={{ color: "rgb(255, 179, 0)" }}>
              describe Our site
            </u>
          </h3>

          <br />

          Big Mall is guided by four principles: customer obsession rather than
          competitor focus, passion for invention, commitment to operational
          excellence, and long-term thinking. Big Mall strives to be Earth’s
          most customer-centric company, Earth’s best employer, and Earth’s
          safest place to work.
                 technology, and TheClimate Pledge are some of the things pioneered by Big Mall.
    </div>
</div>

    </>
  );
}

export default Hero;