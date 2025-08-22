import './Donate.css';
import { PageWithBackground } from '../PageLayout/PageBackground/PageWithBackground';
import { BACKGROUNDS } from '../PageLayout/PageBackground/backgrounds';
import { useDonateTranslations } from '../../hooks/useTranslations';

export default function Donate() {
    const donateTranslations = useDonateTranslations();
    
    return (
        <PageWithBackground imageUrl={BACKGROUNDS.BACKGROUND_5}>
            <div className="donate">
                <div className="centered-text" style={{ height: '10%' }}>
                    {donateTranslations.description}
                </div>

                <div
                    className="payment-method"
                    style={{
                        height: 'auto',
                        display: 'block',
                        overflow: 'auto',
                    }}
                >
                    <div className="centered-text">
                        {donateTranslations.transfer}
                        <div className="font1">Revolut: @krevik</div>
                        <div className="font1">
                            {donateTranslations.bankPLN} 74 1140 2004 0000 3702 7618 0386
                        </div>
                        <div className="font1">
                            {donateTranslations.cryptoBSC} 0xE59FfC3689af47fC501Ce84A2F1cf3C435a67869
                        </div>
                        <div className="font1">
                            {donateTranslations.cryptoBTC} bc1quyf34l6xk9s4z7xd5gvwk07fxtlhqz3q75az53
                        </div>
                        <div className="font1">
                            {donateTranslations.cryptoPolygon} 0xE59FfC3689af47fC501Ce84A2F1cf3C435a67869
                        </div>

                        <div className="font1">Satanixon:</div>
                        <div className="font1">
                            {donateTranslations.bankPLN2} 64 1140 2004 0000 3002 7774 2415
                        </div>
                        <div className="font1">
                            {donateTranslations.bankEUR} 11 1140 2004 0000 3512 0719 8288
                        </div>
                        <div className="font1">
                            {donateTranslations.bankGBP} 61 1140 2004 0000 3012 0719 8312
                        </div>
                        <div className="font1">
                            {donateTranslations.blik}
                        </div>
                    </div>
                </div>
            </div>
        </PageWithBackground>
    );
}
