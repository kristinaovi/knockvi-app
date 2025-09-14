import React, { useContext } from "react";
import { Link } from "react-router-dom";
import CustomizerContext from "../../_helper/Customizer";
import { Image } from "../../AbstractElements";
import CubaIcon from "../../assets/images/logo/KnockViLogo.png";

const SidebarLogo = () => {
  const { mixLayout, layout, layoutURL } = useContext(CustomizerContext);

  const layout1 = localStorage.getItem("sidebar_layout") || layout;

  return (
<div
  className="logo-wrapper"
  style={{
    borderRight: "1px solid #fff", // garis putih
    padding: "10px 15px", // jarak dari tepi
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#fff", // sesuaikan dengan warna sidebar jika perlu
  }}
>
  {layout1 !== "compact-wrapper dark-sidebar" &&
  layout1 !== "compact-wrapper color-sidebar" &&
  mixLayout ? (
    <Link to={`${process.env.PUBLIC_URL}/dashboard/default/${layoutURL}`}>
      <Image
        attrImage={{ className: "img-fluid d-inline", src: `${CubaIcon}`, alt: "" }}
      />
    </Link>
  ) : (
    <Link to={`${process.env.PUBLIC_URL}/dashboard/default/${layoutURL}`}>
      <Image
        attrImage={{
          src: require("../../assets/images/logo/KnockViLogo.png"),
          alt: "",
          className: "d-inline",
          style: {
            maxWidth: "40px",
            height: "auto",
            objectFit: "contain",
          },
        }}
      />
    </Link>
  )}
</div>

  );
};

export default SidebarLogo;
