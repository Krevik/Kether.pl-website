import "./HomePage.css";
import backgroundImage from "../../resources/backgrounds/background_1.jpg";
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import commandsFileLoc from "../../resources/commands/commands.json";
import { apiPaths } from "../../utils/apiPaths";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/store";

type Command = {
	command: string;
	description: string;
};

export default function HomePage() {
	const [commands, setCommands] = useState<Command[]>([]);
	const serverInfo = useSelector(
		(state: AppState) => state.serverInfoReducer.serverInfo
	);
	//load commands from file
	useEffect(() => {
		const localCommands: Command[] = [];
		commandsFileLoc.forEach((readCommand: Command) => {
			localCommands.push(readCommand);
		});
		setCommands(localCommands);
	}, []);

	//load server info

	return (
		<div
			className="home-page"
			style={{
				backgroundImage: `url(${backgroundImage})`,
			}}
		>
			<div className="card">
				<div
					className="section"
					style={{ paddingLeft: "var(--standardPadding)" }}
				>
					<div className="centered-text">Name: {serverInfo?.name}</div>
					<div className="centered-text">IP: 51.83.217.86:29800</div>
					<div className="centered-text">
						Players: {serverInfo?.players}/{serverInfo?.maxplayers}
					</div>
					<div className="centered-text">
						Status: {serverInfo?.status === "1" ? "Online" : "Offline"}
					</div>
					<div className="centered-text">Map: {serverInfo?.map}</div>
				</div>

				<div className="section">
					<div
						className="centered-text"
						style={{ transform: "translate(0%, 250%)" }}
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

				<div
					className="section"
					style={{ paddingRight: "var(--standardPadding)" }}
				>
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
	);
}
