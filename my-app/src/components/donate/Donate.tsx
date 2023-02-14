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
					<div className="centered-text">
						PSC
						<form
							action="https://liveserver.pl/pay.php?method=psc"
							method="post"
							target="_blank"
						>
							<input type="hidden" name="lvs_client_id" value={client_id} />
							<input type="hidden" name="api" />
							<input
								type="hidden"
								name="lvs_o_amount"
								value={donateAmountPSC}
							/>

							<InputNumber
								value={donateAmountPSC}
								onValueChange={(e) =>
									setDonateAmountPSC(e.value! | donateAmountPSC)
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
					<div className="centered-text">
						Paypal
						<form
							action="https://liveserver.pl/pay.php?method=paypal"
							method="post"
							target="_blank"
						>
							<input type="hidden" name="lvs_client_id" value={client_id} />
							<input type="hidden" name="api" />
							<input
								type="hidden"
								name="lvs_o_amount"
								value={donateAmountPaypal}
							/>

							<InputNumber
								value={donateAmountPaypal}
								onValueChange={(e) =>
									setDonateAmountPaypal(e.value! | donateAmountPaypal)
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

				<div
					className="payment-method"
					style={{ height: "auto", display: "block", overflow: "auto" }}
				>
					<div className="centered-text">
						Other
						<div className="font1">Revolut: @krevik </div>
						<div className="font1">
							Bank: (PLN only) 74 1140 2004 0000 3702 7618 0386
						</div>
						<div className="font1">
							Crypto BSC: 0xE59FfC3689af47fC501Ce84A2F1cf3C435a67869
						</div>
						<div className="font1">
							Crypto BTC: bc1quyf34l6xk9s4z7xd5gvwk07fxtlhqz3q75az53
						</div>
						<div className="font1">
							Crypto Polygon: 0xE59FfC3689af47fC501Ce84A2F1cf3C435a67869
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
