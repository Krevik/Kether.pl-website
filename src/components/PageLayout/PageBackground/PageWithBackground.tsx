import styles from './PageWithBackground.module.css';
import React from 'react';

export type PageWithBackgroundProps = {
    imageUrl: string;
} & React.PropsWithChildren;

export const PageWithBackground = (props: PageWithBackgroundProps) => {
    return (
        <div
            className={styles.pageWithBackground}
            style={{
                backgroundImage: `url(${props.imageUrl})`,
            }}
        >
            {props.children}
        </div>
    );
};
