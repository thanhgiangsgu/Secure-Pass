import React from "react";
import "./Ring.css";

const Ring = () => {
  return (
    <div className="ring-container">
      <div className="ring"></div>
      <div className="ring"></div>
      <div className="ring"></div>
      <span className="loading">Loading...</span>
    </div>
  );
};

export default Ring;
