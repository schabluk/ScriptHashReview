import React from "react";
import { Rate } from "antd";

import "./Placeholder.css";

const Placeholder = props => (
  <div className="ant-card get-review">
    <div
      className={"placeholder animatedBackground"}
      style={{ height: "200px" }}
    >
      <div
        className={"ant-card-head backgroundMasker"}
        style={{ height: 57, top: 0, left: 0, right: 0 }}
      >
        <div className="ant-card-extra">
          <Rate disabled allowHalf defaultValue={0} />
        </div>
      </div>
      <div
        className={"cropper"}
        style={{ height: 141, top: 57, left: 0, width: 70 }}
      >
        <div
          className={"avatar animatedBackground"}
          style={{ top: 20, left: 24 }}
        />
      </div>
      <div
        className={"backgroundMasker"}
        style={{ height: 24, top: 57, left: 70, right: 0 }}
      />
      <div
        className={"backgroundMasker"}
        style={{ height: 9, top: 99, left: 70, right: 24 }}
      />
      <div
        className={"backgroundMasker"}
        style={{ height: 9, top: 127, left: 70, right: 24 }}
      />
      <div
        className={"backgroundMasker"}
        style={{ height: 9, top: 154, left: 70, right: 24 }}
      />
      <div
        className={"backgroundMasker"}
        style={{ height: 18, top: 180, left: 70, right: 24 }}
      />
      <div
        className={"backgroundMasker"}
        style={{ height: 18, top: 163, width: 100, right: 24 }}
      />
      <div
        className={"backgroundMasker"}
        style={{ height: 141, top: 57, width: 24, right: 0 }}
      />
    </div>
  </div>
);

export default Placeholder;
