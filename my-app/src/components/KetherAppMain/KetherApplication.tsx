import Navbar from "../navbar/Navbar";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/store";
import { TabType } from "../navbar/models/TabModels";
import HomePage from "../HomePage/HomePage";
import Footer from "../Footer/Footer";
import HallOfFame from "../HallOfFame/HallOfFame";
import GithubRepo from "../GithubRepo/GithubRepo";
import Donate from "../Donate/Donate";
import { steamAPIService } from "../../services/steamAPIService";
import GameStats from "../GameStats/GameStats";

export default function KetherApplication() {
	const activeTabIndex = useSelector(
		(state: AppState) => state.navbarReducer.activeTabIndex
	);

	steamAPIService.useAdminDetectionService();
	steamAPIService.useSteamAuthService();
	steamAPIService.useUserDataFetcher();
	steamAPIService.useOwnedGamesFetcher();

	const getParticularTabContent = () => {
		switch (activeTabIndex) {
			case TabType.HOME:
				return <HomePage />;
			case TabType.HALL_OF_FAME:
				return <HallOfFame />;
			case TabType.GAME_STATS:
				return <GameStats />;
			case TabType.GITHUB:
				return <GithubRepo />;
			case TabType.DONATE:
				return <Donate />;
			default:
				return <div>In progress</div>;
		}
	};

	return (
		<>
			<Navbar />
			{getParticularTabContent()}
			<Footer />
		</>
	);
}
