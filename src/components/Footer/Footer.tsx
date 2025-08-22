import './Footer.css';
import { Button } from 'primereact/button';
import ST_L from '../../resources/favicons/steam-logo-svgrepo.png';
import { EXTERNAL_URLS } from '../../utils/constants';

export default function Footer() {
    return (
        <footer style={{ height: 'auto' }}>
            <span>&copy; Kether by Krevik. MIT License.</span>
            
             <span className="contact">
                <Button 
                    icon='pi pi-discord'
                    title='Discord server invitation'
                    onClick={() =>
                            window.open(EXTERNAL_URLS.DISCORD_INVITE)
                        }
                ></Button>
                <Button 
                    icon={ST_L}
                    title='Steam chat group invitation'
                    onClick={() =>
                            window.open(EXTERNAL_URLS.STEAM_CHAT_INVITE)
                        }
                ><img src={ST_L} width="20px" height="20px" alt="Steam logo" /></Button></span>
        </footer>
    );
}
