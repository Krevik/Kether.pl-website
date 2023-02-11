import "./Home.css";
import Navbar from "../navbar/Navbar";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/store";
import { TabType } from "../navbar/models/TabModels";
import HomePage from "../homePage/HomePage";
import Servers from "../servers/Servers";
import Footer from "../footer/Footer";

export default function Home() {
	const activeTabIndex = useSelector(
		(state: AppState) => state.navbarReducer.activeTabIndex
	);

	const getParticularTabContent = () => {
		switch (activeTabIndex) {
			case TabType.HOME:
				return <HomePage />;
			case TabType.SERVERS:
				return <Servers />;
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
