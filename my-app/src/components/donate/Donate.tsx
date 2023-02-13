import { useState } from "react";
import backgroundImage from "../../resources/backgrounds/background_4.jpg";
import "./Donate.css";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";

export default function Donate() {
	const [donateAmountPrzelewy24, setDonateAmountPrzelewy24] =
		useState<number>(10);
	const [donateAmountPSC, setDonateAmountPSC] = useState<number>(10);
	const [donateAmountPaypal, setDonateAmountPaypal] = useState<number>(10);

	const client_id = 26606;

	return (
		<div
			className="donate"
			style={{ backgroundImage: `url(${backgroundImage})` }}
		>
			<div className="card">
				<div className="centered-text" style={{ height: "10%" }}>
					You like the server or just want access to vip commands? Support us by
					making a donate!
				</div>

				<div className="payment-method">
					<div className="centered-text">
						Przelewy 24
						<form
							action="https://liveserver.pl/pay.php?method=online"
							method="post"
							target="_blank"
						>
							<input type="hidden" name="lvs_client_id" value={client_id} />
							<input type="hidden" name="api" />
							<input
								type="hidden"
								name="lvs_o_amount"
								value={donateAmountPrzelewy24}
							/>

							<InputNumber
								value={donateAmountPrzelewy24}
								onValueChange={(e) =>
									setDonateAmountPrzelewy24(e.value! | donateAmountPrzelewy24)
								}
								incrementButtonIcon="pi pi-plus"
								decrementButtonIcon="pi pi-minus"
								showButtons
								mode="currency"
								min={0}
								currency="PLN"
							/>
							<Button>
								<input type="submit" name="lvs_o_submit" value="Wyślij" />
							</Button>
						</form>
					</div>
				</div>
				<div className="payment-method">
					<div className="centered-text">PSC</div>
				</div>
				<div className="payment-method">
					<div className="centered-text">Paypal</div>
				</div>
				<div className="payment-method">
					<div className="centered-text">Other</div>
				</div>
			</div>
		</div>
	);
}
