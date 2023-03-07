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

	const getUserAvatarColumnBody = (rowData: GameStatEntry) => {
		return (
			<div className="user-data">
				<img alt="user-avatar" src={rowData.userData?.avatarmedium} />
			</div>
		);
	};

	const getUserNicknameColumnBody = (rowData: GameStatEntry) => {
		return (
			<div className="user-data">
				<div className="user-nickname">
					<a href={rowData.userData?.profileurl}>
						{rowData.userData?.personaname}
					</a>
				</div>
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
						<Column body={getUserAvatarColumnBody} header="Avatar"></Column>
						<Column body={getUserNicknameColumnBody} header="Nickname"></Column>
						<Column
							field="Hunter_Skeets"
							header="Hunter Skeets"
							sortable
						></Column>
						<Column
							field="Commons_Killed"
							header="Commons Killed"
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
						<Column
							field="Friendly_Fire_Done"
							header="Friendly Fire Done"
							sortable
						></Column>
						<Column
							field="Friendly_Fire_Received"
							header="Friendly Fire Received"
							sortable
						></Column>
					</DataTable>
				</div>
			</div>
		</div>
	);
}
