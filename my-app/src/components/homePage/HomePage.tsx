import "./HomePage.css";
import backgroundImage from "../../resources/backgrounds/background_1.jpg";
import { useEffect, useState } from "react";

export default function HomePage() {
	const [commands, setCommands] = useState<string[]>();

	//load commands from file
	useEffect(() => {}, []);

	return (
		<div className="home-page">
			<div className="card" style={{ height: "100%", width: "100%" }}>
				<div
					className="background-image"
					style={{ backgroundImage: `url(${backgroundImage})` }}
				>
					<div className="row">
						<div className="column margined-top center-vertically">
							<div className="centered-text">Kether.pl Competitive 108T</div>
							<div className="centered">
								<img
									alt="Server Tracker"
									style={{
										display: "block",
										width: "30vw",
										marginTop: "10px",
										marginBottom: "10px",
									}}
									src="https://liveserver.pl/tracker.php?serviceid=24044"
								/>
							</div>
							<div className="centered-text ">
								IP: <div className="f4">51.83.217.86:29800</div>
							</div>
						</div>
						<div className="column margined-top center-vertically"></div>
						<div className="column margined-top center-vertically">
							<div className="centered-text">Standard user commands:</div>
							<123
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
