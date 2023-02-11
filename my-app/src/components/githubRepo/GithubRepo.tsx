import backgroundImage from "../../resources/backgrounds/background_3.jpg";
import "./GithubRepo.css";

export default function GithubRepo() {
	return (
		<div className="github-repo">
			<div className="card" style={{ height: "100%", width: "100%" }}>
				<div
					className="background-image"
					style={{ backgroundImage: `url(${backgroundImage})` }}
				>
					<div
						className="centered-text"
						style={{
							margin: "auto",
							fontSize: "3rem",
							position: "relative",
						}}
					>
						You can find our server files
					</div>
					<a
						style={{
							fontFamily: "Future Rot",
							fontSize: "3rem",
							marginTop: "100px",
							position: "absolute",
							left: "50%",
							transform: "translate(-50%, -50%)",
							msTransform: "translate(-50%, -50%)",
							textDecoration: "none",
							color: "white",
							WebkitTextStroke: " 3px red",
						}}
						href="https://github.com/Krevik/Kether.pl-L4D2-Server"
					>
						HERE
					</a>
				</div>
			</div>
		</div>
	);
}
