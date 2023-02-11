import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import backgroundImage from "../../resources/backgrounds/background_2.jpg";
import "./HallOfFame.css";
import { useEffect, useState } from "react";
import bindsFileLoc from "../../resources/binds/binds.json";

type BindEntryMultipleTexts = {
	author: string;
	texts: string[];
};

type BindEntry = {
	author: string;
	text: string;
};

export default function HallOfFame() {
	const [binds, setBinds] = useState<BindEntry[]>([]);

	//load binds from file
	useEffect(() => {
		const localBinds: BindEntryMultipleTexts[] = [];
		bindsFileLoc.forEach((readCommand: BindEntryMultipleTexts) => {
			localBinds.push(readCommand);
		});

		const finalEntries: BindEntry[] = [];
		localBinds.forEach((localBind) => {
			localBind.texts.forEach((text) => {
				const finalEntry: BindEntry = {
					author: localBind.author,
					text: text,
				};
				finalEntries.push(finalEntry);
			});
		});
		setBinds(finalEntries);
	}, []);

	return (
		<div className="hall-of-fame">
			<div className="card" style={{ height: "100%", width: "100%" }}>
				<div
					className="background-image"
					style={{ backgroundImage: `url(${backgroundImage})` }}
				>
					<DataTable
						value={binds}
						scrollable={true}
						style={{
							marginLeft: "auto",
							marginRight: "auto",
							width: "80%",
							paddingTop: "20px",
							backgroundColor: "transparent",
							background: "transparent",
						}}
					>
						<Column field="author" header="Author"></Column>
						<Column field="text" header="Text"></Column>
					</DataTable>
				</div>
			</div>
		</div>
	);
}
