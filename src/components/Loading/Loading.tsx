import React from 'react';
import './Loading.css';

interface LoadingProps {
	size?: 'small' | 'medium' | 'large';
	text?: string;
}

export const Loading: React.FC<LoadingProps> = ({ 
	size = 'medium', 
	text = 'Loading...', 
}) => {
	return (
		<div className={`loading-container loading-${size}`}>
			<div className="loading-spinner" />
			{text && <p className="loading-text">{text}</p>}
		</div>
	);
};
