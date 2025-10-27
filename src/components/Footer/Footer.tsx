import './Footer.css';
import { Button } from 'primereact/button';
import DC from '/favicons/discord-mark-white.png';
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
                    icon={<img src={DC} width="23px" height="19px" alt="Discord logo" />}
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
                ><img src={ST_L} width="23px" height="23px" alt="Steam logo" /></Button></span>
        </footer>
    );
}
