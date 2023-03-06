import "./Home.css";
import Navbar from "../navbar/Navbar";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/store";
import { TabType } from "../navbar/models/TabModels";
import HomePage from "../homePage/HomePage";
import Footer from "../footer/Footer";
import HallOfFame from "../hallOfFame/HallOfFame";
import GithubRepo from "../githubRepo/GithubRepo";
import Donate from "../donate/Donate";
import { steamAPIService } from "../../services/steamAPIService";
import GameStats from "../gameStats/GameStats";

export default function Home() {
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
