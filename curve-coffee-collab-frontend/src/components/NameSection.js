import { useState, useEffect } from "react";
import "../styles/components/NameSection.scss";
import Card from "./Card";

function NameSection() {
  const [names, setNames] = useState([]);

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => setNames(data.names || []));
  }, []);

  return (
    <div className="name-section">
      {Array.isArray(names) &&
        names.map(
          (item, index) =>
            index % 2 === 0 && (
              <Card
                key={index}
                name1={names[index].name}
                name2={names[index + 1]?.name || ""}
              />
            )
        )}
    </div>
  );
}

export default NameSection;
