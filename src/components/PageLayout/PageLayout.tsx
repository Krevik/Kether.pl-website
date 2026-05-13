import Navbar from '../navbar/Navbar';
import Footer from '../Footer/Footer';
import { PropsWithChildren } from 'react';
import { NotificationsOverlay } from './NotificationsOverlay';
import { SiteEasterEggs } from './SiteEasterEggs';
import { useLocation } from 'react-router-dom';

export type PageLayoutProps = PropsWithChildren;

export const PageLayout = (props: PageLayoutProps) => {
    const location = useLocation();

    return (
        <>
            <SiteEasterEggs />
            <NotificationsOverlay />
            <Navbar />
            <main key={location.pathname} className="app-main">
                {props.children}
            </main>
            <Footer />
        </>
    );
};
