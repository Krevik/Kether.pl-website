import './GithubRepo.css';
import { PageWithBackground } from '../PageLayout/PageBackground/PageWithBackground';
import { BACKGROUNDS } from '../PageLayout/PageBackground/backgrounds';
import { EXTERNAL_URLS } from '../../utils/constants';

export default function GithubRepo() {
    return (
        <PageWithBackground imageUrl={BACKGROUNDS.BACKGROUND_4}>
            <div className="github-repo">
                <div className="card">
                    <div className="centered-text">
                        You can find our server files{' '}
                        <a href={EXTERNAL_URLS.GITHUB_REPO}>
                            HERE
                        </a>
                    </div>
                </div>
            </div>
        </PageWithBackground>
    );
}
