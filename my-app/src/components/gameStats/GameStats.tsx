import { useSelector } from "react-redux";
import backgroundImage from "../../resources/backgrounds/background_5.jpg";
import { gameStatsService } from "../../services/gameStatsService";
import "./GameStats.css";
import { AppState } from "../../redux/store";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { GameStatEntry } from "../../models/gameStatsModels";

export default function GameStats() {
	const gameStats = useSelector(
		(state: AppState) => state.gameStatsReducer.gameStats
	);

	gameStatsService.useGameStatsLoadingService();

	const getUserDataColumnBody = (rowData: GameStatEntry) => {
		return (
			<div className="user-data">
				<img alt="user-avatar" src={rowData.userData?.avatarmedium} />
			</div>
		);
	};

	return (
		<div
			className="game-stats"
			style={{ backgroundImage: `url(${backgroundImage})` }}
		>
			<div className="card">
				<div className="centered-text">Game Stats</div>
				<div className="card">
					<DataTable value={gameStats} scrollable={true}>
						<Column
							body={getUserDataColumnBody}
							header="Avatar"
							sortable
						></Column>
						<Column
							field="userData.personaname"
							header="Nickname"
							sortable
						></Column>
						<Column
							field="Hunter_Skeets"
							header="Hunter Skeets"
							sortable
						></Column>
						<Column
							field="Witch_Crowns"
							header="Witch Crowns"
							sortable
						></Column>
						<Column field="Tongue_Cuts" header="Tongue Cuts" sortable></Column>
						<Column
							field="Smoker_Self_Clears"
							header="Smoker Self Clears"
							sortable
						></Column>
						<Column
							field="Tank_Rocks_Skeeted"
							header="Tank Rocks Skeeted"
							sortable
						></Column>
						<Column
							field="Hunter_High_Pounces_25"
							header="Hunter High Pounces (25)"
							sortable
						></Column>
						<Column
							field="Death_Charges"
							header="Death Charges"
							sortable
						></Column>
					</DataTable>
				</div>
			</div>
		</div>
	);
}
