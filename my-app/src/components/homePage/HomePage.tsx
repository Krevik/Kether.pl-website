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

type ServerInfo = {
	name: string;
	players: number;
	status: number;
	map: string;
	maxplayers: number;
	password: number;
};

export default function HomePage() {
	const [commands, setCommands] = useState<Command[]>([]);
	const [serverInfo, setServerInfo] = useState<ServerInfo>();

	//load commands from file
	useEffect(() => {
		const localCommands: Command[] = [];
		commandsFileLoc.forEach((readCommand: Command) => {
			localCommands.push(readCommand);
		});
		setCommands(localCommands);
	}, []);

	//load server info
	useEffect(() => {
		fetch(
			"https://rec.liveserver.pl/api?channel=get_server_info&return_method=json",
			{
				method: "POST",
				headers: {
					Accept:
						"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: new URLSearchParams({
					client_id: "26606",
					pin: "635577095f13a5c85545c4e6690d8878",
					server_id: "24044",
				}),
				mode: "no-cors",
			}
		).then((response) => {
			console.log(JSON.stringify(response));
			setServerInfo(response as unknown as ServerInfo);
		});
	}, []);

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
					<div className="centered-text">Kether.pl Competitive 108T</div>
					<div className="centered-text">IP: 51.83.217.86:29800</div>
				</div>

				<div className="section">
					<div className="centered-text">
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
