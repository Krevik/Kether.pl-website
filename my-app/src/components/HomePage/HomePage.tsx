import './HomePage.css';
import backgroundImage from '../../resources/backgrounds/background_1.jpg';
import ServerInfoSection from './sections/ServerInfoSection';
import MapsSection from './sections/MapsSection';
import CommandsSection from './sections/CommandsSection';
import Navbar from '../navbar/Navbar';
import Footer from '../Footer/Footer';

export default function HomePage() {
    return (
        <>
            <Navbar />
            <div
                className="home-page"
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                }}
            >
                <ServerInfoSection />
                <MapsSection />
                <CommandsSection />
            </div>
            <Footer />
        </>
    );
}
