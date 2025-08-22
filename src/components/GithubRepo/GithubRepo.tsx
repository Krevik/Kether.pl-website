import './GithubRepo.css';
import { PageWithBackground } from '../PageLayout/PageBackground/PageWithBackground';
import { BACKGROUNDS } from '../PageLayout/PageBackground/backgrounds';

export default function GithubRepo() {
    return (
        <PageWithBackground imageUrl={BACKGROUNDS.BACKGROUND_4}>
            <div className="github-repo">
                <div className="card">
                    <div className="centered-text">
                        You can find our server files{' '}
                        <a href="https://github.com/Krevik/Kether.pl-L4D2-Server">
                            HERE
                        </a>
                    </div>
                </div>
            </div>
        </PageWithBackground>
    );
}
