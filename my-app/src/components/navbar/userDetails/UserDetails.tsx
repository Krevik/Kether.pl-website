import { useSelector } from "react-redux";
import { AppState } from "../../../redux/store";
import { JsxElement } from "typescript";

export default function UserDetails() {
	const userData = useSelector(
		(state: AppState) => state.authenticationReducer.userData
	);

	return userData ? (
		<div className="user-details">
			<img alt="user-avatar" src={userData?.avatar} />
			<div className="card">
				<span>SteamID: {userData?.steamid}</span>
				<span>User Name: {userData?.personaname}</span>
			</div>
		</div>
	) : (
		<></>
	);
}
