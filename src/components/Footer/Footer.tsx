import './Footer.css';
import { Button } from 'primereact/button';
import ST_L from '../../resources/favicons/steam-logo-svgrepo.png'

export default function Footer() {
    return (
        <footer style={{ height: 'auto' }}>
            <span>&copy; Kether by Krevik. MIT License.</span>
            
             <span className="contact">
                <Button 
                    icon='pi pi-discord'
                    title='Discord server invitation'
                    onClick={() =>
                            window.open("https://discord.gg/5Pgqt5fc5N")
                        }
                ></Button>
                <Button 
                    icon={ST_L}
                    title='Steam chat group invitation'
                    onClick={() =>
                            window.open("https://steamcommunity.com/chat/invite/BHB07D0c")
                        }
                ><img src={ST_L} width="20px" height="20px"></img></Button></span>
        </footer>
    );
}
