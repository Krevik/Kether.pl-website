import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import backgroundImage from "../../resources/backgrounds/background_2.jpg";
import "./HallOfFame.css";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/store";
import { bindsManagingService } from "../../services/bindsManagingService";

export default function HallOfFame() {
	const binds = useSelector((state: AppState) => state.bindsReducer.binds);

	const userID = useSelector((state: AppState) => state.userDataReducer.userID);
	const isAdmin: boolean = useSelector(
		(state: AppState) => state.userDataReducer.isAdmin
	);

	bindsManagingService.useBindsLoadingService();

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
				</DataTable>
			</div>
		</div>
	);
}
