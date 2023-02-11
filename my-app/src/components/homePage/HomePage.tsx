import "./HomePage.css";
import backgroundImage from "../../resources/backgrounds/background_1.jpg";
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import commandsFileLoc from "../../resources/commands/commands.json";

type Command = {
	command: string;
	description: string;
};

export default function HomePage() {
	const [commands, setCommands] = useState<Command[]>([
		{ command: "!r , !nr", description: "Sets your ready status" },
	]);

	//load commands from file
	useEffect(() => {
		const localCommands: Command[] = [];
		commandsFileLoc.forEach((readCommand: Command) => {
			localCommands.push(readCommand);
		});
		setCommands(localCommands);
	}, []);

	return (
		<div className="home-page">
			<div className="card" style={{ height: "100%", width: "100%" }}>
				<div
					className="background-image"
					style={{ backgroundImage: `url(${backgroundImage})` }}
				>
					<div className="row">
						<div className="column positioned-vertically">
							<div className="centered-text">Kether.pl Competitive 108T</div>
							<div className="centered">
								<img
									alt="Server Tracker"
									style={{
										display: "block",
										height: "102px",
										width: "450px",
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
						<div className="column positioned-vertically">
							<div
								className="centered-text"
								style={{ paddingTop: "50%", display: "inline-block" }}
							>
								You can download all the custom maps installed on the server
								<a
									style={{
										display: "inline-block",
										marginLeft: "10px",
										textDecoration: "none",
										color: "white",
										WebkitTextStroke: " 3px red",
									}}
									href="https://steamcommunity.com/sharedfiles/filedetails/?id=2542824628"
								>
									HERE
								</a>
							</div>
						</div>
						<div className="column positioned-vertically">
							<div className="commands">
								<DataTable
									value={commands}
									responsiveLayout="scroll"
									style={{
										backgroundColor: "transparent",
										background: "transparent",
									}}
								>
									<Column field="command" header="Command"></Column>
									<Column field="description" header="Description"></Column>
								</DataTable>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
