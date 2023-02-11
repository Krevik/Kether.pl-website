import backgroundImage from "../../resources/backgrounds/background_2.jpg";
import "./Servers.css";

export default function Servers() {
	return (
		<div className="servers">
			<div className="card" style={{ height: "100%", width: "100%" }}>
				<div
					className="background-image"
					style={{ backgroundImage: `url(${backgroundImage})` }}
				></div>
			</div>
		</div>
	);
}
