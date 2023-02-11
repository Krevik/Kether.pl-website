import { useState } from "react";
import backgroundImage from "../../resources/backgrounds/background_4.jpg";
import "./Donate.css";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";

export default function Donate() {
	const [donateAmountPrzelewy24, setDonateAmountPrzelewy24] =
		useState<number>(10);
	const [donateAmountPSC, setDonateAmountPSC] = useState<number>(10);

	return (
		<div className="donate">
			<div className="card" style={{ height: "100%", width: "100%" }}>
				<div
					className="background-image"
					style={{ backgroundImage: `url(${backgroundImage})` }}
				>
					<div
						className="centered-text"
						style={{
							width: "80%",
							margin: "auto",
							marginTop: "1%",
							fontSize: "3rem",
							position: "absolute",
							left: "50%",
							transform: "translate(-50%, 0)",
							msTransform: "translate(-50%, 0)",
						}}
					>
						You like the server or just want access to vip commands? Support us
						by making a donate!
					</div>
					<div
						className="row"
						style={{ width: "100%", height: "40%", paddingTop: "200px" }}
					>
						<div className="column">
							<form
								style={{ border: "solid 2px white" }}
								action="https://liveserver.pl/pay.php?method=online"
								method="post"
								target="_blank"
							>
								<input type="hidden" name="lvs_client_id" value="26606" />
								<input type="hidden" name="api" />
								<div
									className="centered-text"
									style={{
										fontSize: "2rem",
									}}
								>
									Przelewy Online
								</div>
								<div style={{ display: "flex", justifyContent: "center" }}>
									<InputNumber
										inputId="stacked"
										value={donateAmountPrzelewy24}
										onValueChange={(event) =>
											setDonateAmountPrzelewy24(event.value || 10)
										}
										min={1}
										showButtons
										mode="currency"
										currency="PLN"
									/>
									<input
										type="hidden"
										name="lvs_o_amount"
										value={donateAmountPrzelewy24}
									/>
									<input type="submit" name="lvs_o_submit" value="Wyślij" />
								</div>
							</form>
						</div>
						<div className="column">
							<form
								style={{ border: "solid 2px white" }}
								action="https://liveserver.pl/pay.php?method=psc"
								method="post"
								target="_blank"
							>
								<input type="hidden" name="lvs_client_id" value="26606" />
								<input type="hidden" name="api" />
								<div
									className="centered-text"
									style={{
										fontSize: "2rem",
									}}
								>
									PSC
								</div>
								<div style={{ display: "flex", justifyContent: "center" }}>
									<InputNumber
										inputId="stacked"
										value={donateAmountPSC}
										onValueChange={(event) =>
											setDonateAmountPSC(event.value || 10)
										}
										showButtons
										min={1}
										mode="currency"
										currency="PLN"
									/>
									<input
										type="hidden"
										name="lvs_o_amount"
										value={donateAmountPSC}
									/>
									<input type="submit" name="lvs_o_submit" value="Wyślij" />
								</div>
							</form>
						</div>
					</div>
					<div className="row" style={{ width: "100%", height: "40%" }}>
						<div className="column"></div>
						<div className="column"></div>
					</div>
				</div>
			</div>
		</div>
	);
}
