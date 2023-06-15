import './HomePage.css';
import ServerInfoSection from './sections/ServerInfoSection';
import CommandsSection from './sections/CommandsSection';
import { PageWithBackground } from '../PageLayout/PageBackground/PageWithBackground';
import { BACKGROUNDS } from '../PageLayout/PageBackground/backgrounds';

export default function HomePage() {
    return (
        <PageWithBackground imageUrl={BACKGROUNDS.BACKGROUND_1}>
            <div className="home-page">
                <ServerInfoSection />
                <CommandsSection />
            </div>
        </PageWithBackground>
    );
}
