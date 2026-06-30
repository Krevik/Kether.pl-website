import { authService } from './authService';

export const adminService = {
    /**
     * @deprecated Use authService.getSession() instead.
     * Kept for compatibility; ignores the steamId argument.
     */
    verifyAdminStatus: async (_steamId?: string): Promise<boolean> => {
        const session = await authService.getSession();
        return session?.is_admin ?? false;
    },
};
