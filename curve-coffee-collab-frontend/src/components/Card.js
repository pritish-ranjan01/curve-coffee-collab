import "../styles/components/Card.scss";
import coffeeIcon from "../assets/coffee-icon.png";
import React, { useEffect, useState } from 'react';

function Card({ name1, name2 }) {
  return (
    <div className="card">
      <div className="name-left">{name1}</div>
      <div className="coffee-icon">
        <img src={coffeeIcon} alt="Coffee" />
      </div>
      <div className="name-right">{name2}</div>
    </div>
  );
}

export default Card;
