import Navbar from '../navbar/Navbar';
import Footer from '../Footer/Footer';
import { PropsWithChildren } from 'react';
import { NotificationsOverlay } from './NotificationsOverlay';

export type PageLayoutProps = {
    isMenuShown: boolean;
    setIsMenuShown: (boolean) => void;
} & PropsWithChildren;

export const PageLayout = (props: PageLayoutProps) => {
    return (
        <>
            <NotificationsOverlay />
            <Navbar
                setIsMenuShown={props.setIsMenuShown}
                isMenuShown={props.isMenuShown}
            />
            {props.children}
            <Footer />
        </>
    );
};
