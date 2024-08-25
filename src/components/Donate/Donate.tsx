import './Donate.css';
import LiveServerPaymentMethod from './paymentMethods/LiveServerPaymentMethod';
import { PageWithBackground } from '../PageLayout/PageBackground/PageWithBackground';
import { BACKGROUNDS } from '../PageLayout/PageBackground/backgrounds';

const CLIENT_ID = 26606;
export default function Donate() {
    return (
        <PageWithBackground imageUrl={BACKGROUNDS.BACKGROUND_5}>
            <div className="donate">
                <div className="centered-text" style={{ height: '10%' }}>
                    You like the server or just want access to vip commands?
                    Support us by making a donate!
                </div>

                <LiveServerPaymentMethod
                    paymentMethod={'online'}
                    paymentMethodName={'Przelewy24'}
                    clientId={CLIENT_ID}
                />

                <LiveServerPaymentMethod
                    paymentMethod={'psc'}
                    paymentMethodName={'PSC'}
                    clientId={CLIENT_ID}
                />

                <LiveServerPaymentMethod
                    paymentMethod={'paypal'}
                    paymentMethodName={'Paypal'}
                    clientId={CLIENT_ID}
                />

                <div
                    className="payment-method"
                    style={{
                        height: 'auto',
                        display: 'block',
                        overflow: 'auto',
                    }}
                >
                    <div className="centered-text">
                        Other
                        <div className="font1">Revolut: @krevik </div>
                        <div className="font1">
                            Bank: (PLN only) 74 1140 2004 0000 3702 7618 0386
                        </div>
                        <div className="font1">
                            Crypto BSC:
                            0xE59FfC3689af47fC501Ce84A2F1cf3C435a67869
                        </div>
                        <div className="font1">
                            Crypto BTC:
                            bc1quyf34l6xk9s4z7xd5gvwk07fxtlhqz3q75az53
                        </div>
                        <div className="font1">
                            Crypto Polygon:
                            0xE59FfC3689af47fC501Ce84A2F1cf3C435a67869
                        </div>
                    </div>
                </div>
            </div>
        </PageWithBackground>
    );
}
