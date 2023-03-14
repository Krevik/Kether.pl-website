import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import KetherApplication from "./components/KetherAppMain/KetherApplication";
import { Provider } from "react-redux";
import { appStore, persistedAppStore } from "./redux/store";
import "./global.css";
import { PersistGate } from "redux-persist/integration/react";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(
	<React.StrictMode>
		<Provider store={appStore}>
			<PersistGate loading={null} persistor={persistedAppStore}>
				<KetherApplication />
			</PersistGate>
		</Provider>
	</React.StrictMode>
);
