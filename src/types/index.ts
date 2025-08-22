// Re-export types from Redux slices
export type { SteamUserDetails, GamesInfo } from '../redux/slices/userDataSlice';
export type { AppState, AppDispatch } from '../redux/store';

// Component prop types
export interface BaseComponentProps {
	className?: string;
	children?: React.ReactNode;
}

// Navigation types
export interface TabItem {
	label: string;
	targetPage: string;
}

// Site types
export interface Site {
	name: string;
	url: string;
	icon: string;
	description: string;
}
