import "../styles/components/Overview.scss";
import React from "react";
import { useEffect, useState } from "react";

function Overview({ onShuffle }) {
  return (
    <div className="overview">
      <p>WEEK 1</p>
      <h2>This Week's Coffee Pairs</h2>
      <p>gg </p>
      <button onClick={onShuffle}>Shuffle Pairs</button>
    </div>
  );
}

export default Overview;
