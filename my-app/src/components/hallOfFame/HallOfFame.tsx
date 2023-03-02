import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import backgroundImage from "../../resources/backgrounds/background_2.jpg";
import "./HallOfFame.css";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/store";
import { bindsManagingService } from "../../services/bindsManagingService";
import { Button } from "primereact/button";
import { BindEntry } from "../../models/bindsModels";

export default function HallOfFame() {
	const binds = useSelector((state: AppState) => state.bindsReducer.binds);

	const userID = useSelector((state: AppState) => state.userDataReducer.userID);
	const isAdmin: boolean = useSelector(
		(state: AppState) => state.userDataReducer.isAdmin
	);

	bindsManagingService.useBindsLoadingService();

	const actionBodyTemplate = (rowData: BindEntry) => {
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
					onClick={() => {
						bindsManagingService
							.deleteBind(rowData)
							.then((response) => {
								response.json().then((jsonedResponse) => {
									console.log(jsonedResponse);
									bindsManagingService.reloadBinds();
								});
							})
							.catch((error) => {
								console.log("Couldn't delete bind: " + error);
							});
					}}
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
					{isAdmin && (
						<Column field="id" header="database ID" sortable></Column>
					)}
					<Column field="author" header="Author" sortable></Column>
					<Column field="text" header="Text" sortable></Column>
					{isAdmin && (
						<Column header="Actions" body={actionBodyTemplate}></Column>
					)}
				</DataTable>
			</div>
		</div>
	);
}
