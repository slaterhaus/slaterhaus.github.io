import "./styles.css"
export function PieChartOverlay({setShowOverlay}: {setShowOverlay: () => void}) {
  return (
      <div className="overlay" onClick={setShowOverlay}>
        {/* Add your pie chart slices here. Each slice is a link. */}
        {/* Placeholder links */}
        <a href="/link1" className="slice slice1">Reviews</a>
        <a href="/link2" className="slice slice2">Code</a>
        <a href="/link3" className="slice slice3">Music</a>
        <a href="/link4" className="slice slice4">Goals</a>
        <a href="/link5" className="slice slice5">Art</a>
      </div>
  );
}
export default PieChartOverlay