import styles from './PageWithBackground.module.css';
import React from 'react';

export type PageWithBackgroundProps = {
    imageUrl: string;
} & React.PropsWithChildren;

export const PageWithBackground = (props: PageWithBackgroundProps) => {
    return (
        <div
            className={`${styles.pageWithBackground} page-bg-shell`}
            style={{
                backgroundImage: `url(${props.imageUrl})`,
            }}
        >
            <div className="page-bg-overlay" aria-hidden />
            <div className="page-bg-inner">{props.children}</div>
        </div>
    );
};
