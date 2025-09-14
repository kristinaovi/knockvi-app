// LightCardBox.jsx
import React from "react";
import { Card, CardBody } from "reactstrap";

const LightCardBox = ({ data }) => {
  return (
    <Card className="light-card p-2"> {/* tambah p-2 biar lebih compact */}
      <CardBody className="d-flex align-items-center gap-2 py-2 px-2">
        {/* Icon */}
        <div className="icon-wrapper">
          {data.icon}
        </div>

        {/* Title & Value */}
        <div>
          <h6 className="mb-0" style={{ fontSize: "0.8rem" }}>{data.title}</h6>
          <h5 className="mb-0" style={{ fontSize: "1rem" }}>{data.price}</h5>
        </div>
      </CardBody>
    </Card>
  );
};

export default LightCardBox;
