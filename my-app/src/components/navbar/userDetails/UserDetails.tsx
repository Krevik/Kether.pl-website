import { useSelector } from "react-redux";
import { AppState } from "../../../redux/store";
import "./UserDetails.css";

export default function UserDetails() {
	const isAdmin = useSelector(
		(state: AppState) => state.userDataReducer.isAdmin
	);
	const userData = useSelector(
		(state: AppState) => state.userDataReducer.userData
	);

	return userData ? (
		<div className="user-details">
			<img alt="user-avatar" src={userData?.avatarmedium} />
			<div className="card">
				{userData.realname && <span>Hello, {userData.realname}</span>}
				<span>SteamID: {userData?.steamid}</span>
				<span>User Name: {userData?.personaname}</span>
				{isAdmin && <span style={{ color: "indianred" }}>I Am an admin!</span>}
			</div>
		</div>
	) : (
		<></>
	);
}
