import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { useState } from 'react';

type LiveServerPaymentFormProps = {
    method: string;
    clientId: number;
};

export default function LiveServerPaymentForm(
    props: LiveServerPaymentFormProps
) {
    const [donateAmount, setDonateAmount] = useState<number>(10);
    const actionURL = () => {
        return `https://liveserver.pl/pay.php?method=${props.method}`;
    };
    return (
        <form action={actionURL()} method="post" target="_blank">
            <input type="hidden" name="lvs_client_id" value={props.clientId} />
            <input type="hidden" name="api" />
            <input type="hidden" name="lvs_o_amount" value={donateAmount} />

            <InputNumber
                value={donateAmount}
                onValueChange={(e) => setDonateAmount(e.value! | donateAmount)}
                incrementButtonIcon="➕"
                decrementButtonIcon="➖"
                showButtons
                mode="currency"
                min={0}
                currency="PLN"
            />
            <Button>
                <input type="submit" name="lvs_o_submit" value="Wyślij" />
            </Button>
        </form>
    );
}
