import './Footer.css';
import { Button } from 'primereact/button';
import ST_L from '/favicons/steam-logo-svgrepo.png';
import { EXTERNAL_URLS } from '../../utils/constants';
import { useFooterTranslations } from '../../hooks/useTranslations';

export default function Footer() {
    const footerTranslations = useFooterTranslations();
    
    return (
        <footer style={{ height: 'auto' }}>
            <span>{footerTranslations.copyright}</span>
            
             <span className="contact">
                <Button 
                    icon='pi pi-discord'
                    title={footerTranslations.discordTooltip}
                    onClick={() =>
                            window.open(EXTERNAL_URLS.DISCORD_INVITE)
                        }
                ></Button>
                <Button 
                    icon={ST_L}
                    title={footerTranslations.steamTooltip}
                    onClick={() =>
                            window.open(EXTERNAL_URLS.STEAM_CHAT_INVITE)
                        }
                ><img src={ST_L} width="20px" height="20px" alt="Steam logo" /></Button></span>
        </footer>
    );
}
