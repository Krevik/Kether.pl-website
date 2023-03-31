import backgroundImage from "../../resources/backgrounds/background_3.jpg";
import "./GithubRepo.css";
import Navbar from '../navbar/Navbar';
import Footer from '../Footer/Footer';

export default function GithubRepo() {
	return (
        <>
            <Navbar />
            <div
                className="github-repo"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            >
                <div className="card">
                    <div className="centered-text">
                        You can find our server files{' '}
                        <a href="https://github.com/Krevik/Kether.pl-L4D2-Server">
                            HERE
                        </a>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
