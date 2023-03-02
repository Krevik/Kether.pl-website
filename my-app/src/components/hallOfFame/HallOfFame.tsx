import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import backgroundImage from "../../resources/backgrounds/background_2.jpg";
import "./HallOfFame.css";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/store";
import { bindsManagingService } from "../../services/bindsManagingService";
import { Button } from "primereact/button";

export default function HallOfFame() {
	const binds = useSelector((state: AppState) => state.bindsReducer.binds);

	const userID = useSelector((state: AppState) => state.userDataReducer.userID);
	const isAdmin: boolean = useSelector(
		(state: AppState) => state.userDataReducer.isAdmin
	);

	bindsManagingService.useBindsLoadingService();

	const actionBodyTemplate = (rowData) => {
		return (
			<>
				<Button
					icon="pi pi-pencil"
					className="p-button-rounded p-button-success mr-2"
					onClick={() => console.log(rowData)}
				/>
				<Button
					icon="pi pi-trash"
					className="p-button-rounded p-button-warning"
					onClick={() => console.log(rowData)}
				/>
			</>
		);
	};

	return (
		<div
			className="hall-of-fame"
			style={{ backgroundImage: `url(${backgroundImage})` }}
		>
			<div className="card">
				<DataTable value={binds} scrollable={true}>
					{isAdmin && <Column field="id" header="database ID"></Column>}
					<Column field="author" header="Author"></Column>
					<Column field="text" header="Text"></Column>
					{isAdmin && (
						<Column header="Actions" body={actionBodyTemplate}></Column>
					)}
				</DataTable>
			</div>
		</div>
	);
}
