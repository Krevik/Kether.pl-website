import Navbar from '../navbar/Navbar';
import Footer from '../Footer/Footer';
import { PropsWithChildren } from 'react';

export type PageLayoutProps = {
    isMenuShown: boolean;
    setIsMenuShown: (boolean) => void;
} & PropsWithChildren;

export const PageLayout = (props: PageLayoutProps) => {
    return (
        <>
            <Navbar
                setIsMenuShown={props.setIsMenuShown}
                isMenuShown={props.isMenuShown}
            />
            {props.children}
            <Footer />
        </>
    );
};
