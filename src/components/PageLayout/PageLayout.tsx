import Navbar from '../navbar/Navbar';
import Footer from '../Footer/Footer';
import { PropsWithChildren } from 'react';
import { NotificationsOverlay } from './NotificationsOverlay';

export type PageLayoutProps = PropsWithChildren;

export const PageLayout = (props: PageLayoutProps) => {
    return (
        <>
            <NotificationsOverlay />
            <Navbar />
            {props.children}
            <Footer />
        </>
    );
};
