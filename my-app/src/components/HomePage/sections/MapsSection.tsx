export default function MapsSection() {
    return (
        <div className="section">
            <span
                className="centered-text"
                style={{ transform: 'translate(0%, 250%)' }}
            >
                You can download all the custom maps installed on the server
                <a
                    style={{
                        display: 'inline-block',
                        marginLeft: '10px',
                        textDecoration: 'none',
                        color: 'white',
                        WebkitTextStroke: ' 3px red',
                    }}
                    href="https://steamcommunity.com/sharedfiles/filedetails/?id=2542824628"
                >
                    HERE
                </a>
            </span>
        </div>
    );
}
