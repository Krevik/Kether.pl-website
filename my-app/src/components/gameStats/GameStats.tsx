import { useSelector } from "react-redux";
import backgroundImage from "../../resources/backgrounds/background_5.jpg";
import { gameStatsService } from "../../services/gameStatsService";
import "./GameStats.css";
import { AppState } from "../../redux/store";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import {
	GameStatEntry,
	GameStatLazyLoadingParams,
} from "../../models/gameStatsModels";
import { useState } from "react";

export default function GameStats() {
	const totalRecords = useSelector(
		(state: AppState) => state.gameStatsReducer.totalRecords
	);
	const gameStats = useSelector(
		(state: AppState) => state.gameStatsReducer.gameStats
	);

	const [lazyParams, setLazyParams] = useState<GameStatLazyLoadingParams>({
		first: 0,
		rows: 10,
		page: 1,
		sortField: null,
		sortOrder: null,
	});

	gameStatsService.useGameStatsLoadingService(lazyParams);

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

	const onPage = (event) => {
		setLazyParams(event);
	};

	const onSort = (event) => {
		setLazyParams(event);
	};

	return (
		<div
			className="game-stats"
			style={{ backgroundImage: `url(${backgroundImage})` }}
		>
			<div className="card">
				<div className="centered-text">Game Stats</div>
				<div className="card">
					<DataTable
						paginator
						lazy
						value={gameStats}
						scrollable={true}
						first={lazyParams.first}
						rows={10}
						totalRecords={totalRecords}
						onPage={onPage}
						//onSort={onSort}
						//sortField={lazyParams.sortField}
						//sortOrder={lazyParams.sortOrder}
					>
						<Column body={getUserAvatarColumnBody} header="Avatar"></Column>
						<Column body={getUserNicknameColumnBody} header="Nickname"></Column>
						<Column field="Hunter_Skeets" header="Hunter Skeets"></Column>
						<Column field="Commons_Killed" header="Commons Killed"></Column>
						<Column
							field="Damage_Done_To_Survivors"
							header="Damage Done To Survs"
						></Column>
						<Column
							field="Damage_Done_To_SI"
							header="Damage Done to SI"
						></Column>
						<Column field="Witch_Crowns" header="Witch Crowns"></Column>
						<Column field="Tongue_Cuts" header="Tongue Cuts"></Column>
						<Column
							field="Smoker_Self_Clears"
							header="Smoker Self Clears"
						></Column>
						<Column
							field="Tank_Rocks_Skeeted"
							header="Tank Rocks Skeeted"
						></Column>
						<Column
							field="Hunter_High_Pounces_25"
							header="Hunter High Pounces (25)"
						></Column>
						<Column field="Death_Charges" header="Death Charges"></Column>
						<Column
							field="Friendly_Fire_Done"
							header="Friendly Fire Done"
						></Column>
						<Column
							field="Friendly_Fire_Received"
							header="Friendly Fire Received"
						></Column>
					</DataTable>
				</div>
			</div>
		</div>
	);
}
