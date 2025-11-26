import "../styles/components/Overview.scss";

function Overview({ onShuffle }) {
  return (
    <div className="overview">
      <p className="overview-week">WEEK 1</p>
      <h2 className="overview-title">This Week's Coffee Pairs</h2>
      <p className="overview-dates">24 Nov - 28 Nov </p>
      <button className="overview-btn" onClick={onShuffle}>
        Shuffle Pairs
      </button>
    </div>
  );
}

export default Overview;

//Could also add logic to automate date and week information based on current date
