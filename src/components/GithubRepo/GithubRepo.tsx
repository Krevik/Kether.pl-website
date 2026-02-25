import './GithubRepo.css';
import { PageWithBackground } from '../PageLayout/PageBackground/PageWithBackground';
import { BACKGROUNDS } from '../PageLayout/PageBackground/backgrounds';
import { EXTERNAL_URLS } from '../../utils/constants';
import { useGithubTranslations } from '../../hooks/useTranslations';

export default function GithubRepo() {
    const githubTranslations = useGithubTranslations();
    
    return (
        <PageWithBackground imageUrl={BACKGROUNDS.BACKGROUND_4}>
            <div className="github-repo">
                <div className="card app-surface github-repo-card">
                    <div className="centered-text">
                        {githubTranslations.description}{' '}
                        <a className="app-focus-ring github-repo-link" href={EXTERNAL_URLS.GITHUB_REPO}>
                            {githubTranslations.here}
                        </a>
                    </div>
                </div>
            </div>
        </PageWithBackground>
    );
}
