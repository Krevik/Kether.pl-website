import "./Navbar.css";
import { TabMenu } from "primereact/tabmenu";
import { useSelector } from "react-redux/es/exports";
import { AppState, appStore } from "../../redux/store";
import { navbarActions } from "../../redux/slices/navbarSlice";
import { TabType } from "./models/TabModels";
import SteamLoginButton from "../steamLoginButton/SteamLoginButton";

interface TabItem {
	tabType: TabType;
	label: string;
	icon: string;
}

export default function Navbar() {
	const activeTabIndex = useSelector(
		(state: AppState) => state.navbarReducer.activeTabIndex
	);

	const userData = useSelector(
		(state: AppState) => state.authenticationReducer.userData
	);

	const tabs: TabItem[] = [
		{
			tabType: TabType.HOME,
			label: "Home",
			icon: "pi pi-fw pi-home",
		},
		{
			tabType: TabType.HALL_OF_FAME,
			label: "Hall of Fame",
			icon: "pi pi-fw pi-camera",
		},
		{
			tabType: TabType.GITHUB,
			label: "Github Repo",
			icon: "pi pi-fw pi-file",
		},
		{
			tabType: TabType.DONATE,
			label: "Donate",
			icon: "pi pi-fw pi-credit-card",
		},
	];

	return (
		<div className="card">
			<div className="navigation-menu">
				{userData && (
					<div className="user-details">
						<img alt="user-avatar" src={userData?.avatar} />
						<div className="card">
							<span>SteamID: {userData?.steamid}</span>
							<span>User Name: {userData?.personaname}</span>
						</div>
					</div>
				)}
				<TabMenu
					model={tabs}
					activeIndex={activeTabIndex}
					onTabChange={(event) =>
						appStore.dispatch(
							navbarActions.setActiveTabIndex(tabs[event.index].tabType)
						)
					}
				></TabMenu>
				<SteamLoginButton />
			</div>
		</div>
	);
}
