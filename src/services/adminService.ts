import { API_PATHS } from '../utils/apiPaths';
import { errorLogger } from '../utils/errorLogger';
import { ErrorType } from '../utils/errorUtils';
import { notificationManager } from '../utils/notificationManager';

export interface AdminVerificationResponse {
    is_admin: boolean;
}

export const adminService = {
    verifyAdminStatus: async (steamId: string): Promise<boolean> => {
        try {
            // Parse SteamID as integer for backend
            const steamIdInt = BigInt(steamId);
            
            const response = await fetch(API_PATHS.ADMIN_VERIFY, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Convert BigInt to string for JSON, backend will parse it as i64
                body: `{"steam_id":${steamIdInt}}`,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json() as AdminVerificationResponse;
            return data.is_admin;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            errorLogger.logError(
                new Error(`Admin verification failed: ${errorMessage}`),
                {
                    component: 'AdminService',
                    action: 'verify_admin_status',
                },
                ErrorType.SERVER
            );

            // On error, default to non-admin for security
            notificationManager.ERROR(
                'Failed to verify admin status. Access restricted.'
            );
            return false;
        }
    },
};
