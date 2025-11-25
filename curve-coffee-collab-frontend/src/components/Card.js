import "../styles/components/Card.scss";
import coffeeIcon from "../assets/coffee-icon.png";
import React, { useRef } from "react";

function Card({ name1, name2 }) {
  const dialog = useRef(null);

  const openDialog = () => {
    dialog.current.showModal();
  };

  const closeDialog = () => {
    dialog.current.close();
  };

  return (
    <div className="card">
      <div className="name-left">{name1}</div>
      <button className="coffee-icon" onClick={openDialog}>
        <img src={coffeeIcon} alt="Coffee" />
      </button>
      <div className="name-right">{name2}</div>

      <dialog ref={dialog} className="dialog-modal">
        <h3 className="dialog-title">Book Coffee Session:</h3>
        <p className="dialog-names">
          {name1} & {name2}
        </p>

        <div className="dialog-options">
          <h4 className="dialog-label">Select Topic:</h4>
          <label>
            <input type="checkbox" /> Project Update
          </label>
          <label>
            <input type="checkbox" /> Knowledge Share
          </label>
          <label>
            <input type="checkbox" /> Networking
          </label>
        </div>

        <div className="dialog-section">
          <p className="dialog-label">Or type your own:</p>
          <input type="text" placeholder="Enter topic..." />
        </div>

        <div className="dialog-btns">
          <button className="dialog-btn-primary" onClick={closeDialog}>
            Book Session
          </button>
          <button className="dialog-btn-secondary" onClick={closeDialog}>
            Cancel
          </button>
        </div>
      </dialog>
    </div>
  );
}

export default Card;

//coffee icon needs to be clickable
//onClick opens a popup
//includes "collaboration topic (select with checkbox)" + textfield to type in own topic - then button to 'Book Session' (onClick closes popup)"
