import LiveServerPaymentForm from './LiveServerPaymentForm';

type LiveServerPaymentMethodProps = {
    clientId: number;
    paymentMethodName: string;
    paymentMethod: string;
};
export default function LiveServerPaymentMethod(
    props: LiveServerPaymentMethodProps
) {
    return (
        <div className="payment-method">
            <div className="centered-text">
                {props.paymentMethodName}
                <LiveServerPaymentForm
                    method={props.paymentMethod}
                    clientId={props.clientId}
                />
            </div>
        </div>
    );
}
