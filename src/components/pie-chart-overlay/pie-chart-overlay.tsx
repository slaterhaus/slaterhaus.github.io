import "./styles.css"
export function PieChartOverlay({setShowOverlay, showOverlay}: {setShowOverlay: () => void, showOverlay: boolean}) {
  return (
      <div className="overlay" onClick={setShowOverlay}>
        <a href="/link1" className="slice slice1">Reviews</a>
        <a href="/toys" className="slice slice2">Toys</a>
        <a href="/link3" className="slice slice3">Music</a>
        <a href="/link4" className="slice slice4">Goals</a>
        <a href="/museum" className="slice slice5">Museum</a>
      </div>
  );
}
export default PieChartOverlay