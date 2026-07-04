import { getAccessToken } from '../utils/authToken';
import { hydrateSessionFromToken } from '../utils/sessionFromToken';

export const adminService = {
    /**
     * Read admin UI hint from the signed JWT payload.
     * Backend enforces admin access on every protected route.
     */
    verifyAdminStatus: async (_steamId?: string): Promise<boolean> => {
        const token = getAccessToken();
        if (!token) {
            return false;
        }
        return hydrateSessionFromToken(token)?.isAdmin ?? false;
    },
};
