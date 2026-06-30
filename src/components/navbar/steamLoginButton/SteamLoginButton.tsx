import { useSelector } from 'react-redux';
import './SteamLoginButton.css';
import { Button } from 'primereact/button';
import { AppState, appStore } from '../../../redux/store';
import { userDataActions } from '../../../redux/slices/userDataSlice';
import { API_DOMAIN } from '../../../utils/envUtils';
import { API_PATHS } from '../../../utils/apiPaths';
import { authService } from '../../../services/authService';

const STEAM_OPENID_REALM = API_DOMAIN;
const STEAM_OPENID_RETURN_TO = API_PATHS.AUTH_CALLBACK;

export default function SteamLoginButton() {
    const userID = useSelector(
        (state: AppState) => state.userDataReducer.userID
    );

    const handleLogout = async () => {
        await authService.logout();
        appStore.dispatch(userDataActions.setUserID(undefined));
    };

    return !userID ? (
        <div className="steam-login-button">
            <form
                action="https://steamcommunity.com/openid/login"
                method="post"
            >
                <input
                    type="hidden"
                    name="openid.identity"
                    value="http://specs.openid.net/auth/2.0/identifier_select"
                />
                <input
                    type="hidden"
                    name="openid.claimed_id"
                    value="http://specs.openid.net/auth/2.0/identifier_select"
                />
                <input
                    type="hidden"
                    name="openid.ns"
                    value="http://specs.openid.net/auth/2.0"
                />
                <input type="hidden" name="openid.mode" value="checkid_setup" />
                <input type="hidden" name="openid.realm" value={STEAM_OPENID_REALM} />
                <input type="hidden" name="openid.return_to" value={STEAM_OPENID_RETURN_TO} />
                <Button type="submit" className="app-focus-ring">
                    <img
                        alt="Steam login button img"
                        src="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/steamworks_docs/polish/sits_small.png"
                    />
                </Button>
            </form>
        </div>
    ) : (
        <div className="steam-login-button">
            <Button
                label="🚪 Log out"
                className="app-focus-ring"
                onClick={handleLogout}
                type="button"
            ></Button>
        </div>
    );
}
