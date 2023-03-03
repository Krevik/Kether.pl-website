import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import backgroundImage from "../../resources/backgrounds/background_2.jpg";
import "./HallOfFame.css";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/store";
import { bindsManagingService } from "../../services/bindsManagingService";
import { Button } from "primereact/button";
import { BindEntry, BindSuggestionEntry } from "../../models/bindsModels";
import { RefObject, useEffect, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Toast, ToastMessage } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Toolbar } from "primereact/toolbar";
import { bindSuggestionsManagingService } from "../../services/bindSuggestionsManagingService";

export default function HallOfFame() {
	const binds = useSelector((state: AppState) => state.bindsReducer.binds);
	const bindSuggestions = useSelector(
		(state: AppState) => state.bindSuggestionsReducer.bindSuggestions
	);
	const userID = useSelector((state: AppState) => state.userDataReducer.userID);
	const steamUserData = useSelector(
		(state: AppState) => state.userDataReducer.userData
	);
	const isAdmin: boolean = useSelector(
		(state: AppState) => state.userDataReducer.isAdmin
	);

	const [newBindDialogVisibility, setNewBindDialogVisibility] = useState(false);
	const [
		newBindSuggestionDialogVisibility,
		setNewBindSuggestionDialogVisibility,
	] = useState(false);
	const [editBindDialogVisibility, setEditBindDialogVisibility] =
		useState(false);
	const [bindAuthor, setBindAuthor] = useState("");
	const editingBindID = useRef(-1);
	const [bindText, setBindText] = useState("");

	const toast = useRef<Toast>(null);

	bindsManagingService.useBindsLoadingService();
	bindSuggestionsManagingService.useBindSuggestionsLoadingService();

	const notificationManager = {
		SUCCESS: (toast: RefObject<Toast>, message: string) => {
			return showToastNotification(toast, "success", "Successful", message);
		},
		ERROR: (toast: RefObject<Toast>, message: string) => {
			return showToastNotification(toast, "error", "Failed", message);
		},
	};

	const showToastNotification = (
		toast: RefObject<Toast>,
		severity: ToastMessage["severity"],
		summary: ToastMessage["summary"],
		detail: string,
		life?: number
	) => {
		toast.current!.show({
			severity: severity,
			summary: summary,
			detail: detail,
			life: life || 3000,
		});
	};

	const bindSuggestionBody = (rowData: BindSuggestionEntry) => {
		return (
			<>
				<Button
					data-toggle="tooltip"
					title="Accepts the given bind"
					icon="pi pi-check"
					className="p-button-rounded p-button-success"
					onClick={() => {
						const bind = trimBindData(rowData) as BindSuggestionEntry;
						bindsManagingService
							.addNewBind(bind)
							.then((addedBind) => {
								notificationManager.SUCCESS(
									toast,
									`Successfully accepted new bind: ${addedBind}`
								);
								bindSuggestionsManagingService
									.deleteBindSuggestion(bind)
									.then((deletedBind) => {
										notificationManager.SUCCESS(
											toast,
											`Successfully deleted bind suggestion: ${deletedBind}`
										);
									})
									.catch((error) => {
										notificationManager.ERROR(
											toast,
											`Couldn't delete bind suggestion: ${error}`
										);
									});
							})
							.catch((error) => {
								notificationManager.ERROR(
									toast,
									`Couldn't add new bind: ${error}`
								);
							});
					}}
				/>

				<Button
					data-toggle="tooltip"
					title="Deletes the given bind suggestion instantly"
					icon="pi pi-times"
					className="p-button-rounded p-button-danger"
					onClick={() => {
						bindSuggestionsManagingService
							.deleteBindSuggestion(rowData)
							.then((deletedBind) => {
								notificationManager.SUCCESS(
									toast,
									`Successfully deleted bind suggestion: ${deletedBind}`
								);
								setNewBindDialogVisibility(false);
								setBindText("");
							})
							.catch((error) => {
								notificationManager.ERROR(
									toast,
									`Couldn't delete bind suggestion: ${error}`
								);
							});
					}}
				/>
			</>
		);
	};

	const trimBindData = (bind: BindEntry | BindSuggestionEntry) => {
		return {
			...bind,
			author: bind.author.replace(":", "").trim(),
		};
	};

	const bindActionBodyTemplate = (rowData: BindEntry) => {
		return (
			<>
				<Button
					data-toggle="tooltip"
					title="Edits the given bind"
					icon="pi pi-pencil"
					className="p-button-rounded p-button-success mr-2"
					onClick={() => {
						editingBindID.current = rowData.id;
						setEditBindDialogVisibility(true);
						setBindAuthor(trimBindData(rowData).author);
						setBindText(rowData.text);
					}}
				/>
				<Button
					data-toggle="tooltip"
					title="Deletes the given bind instantly"
					icon="pi pi-trash"
					className="p-button-rounded p-button-warning"
					onClick={() => {
						bindsManagingService
							.deleteBind(rowData)
							.then((deletedBindResponse) => {
								notificationManager.SUCCESS(toast, `${deletedBindResponse}`);
								setNewBindDialogVisibility(false);
								setBindText("");
							})
							.catch((error) => {
								notificationManager.ERROR(
									toast,
									`Couldn't delete the bind: ${error}`
								);
							});
					}}
				/>
			</>
		);
	};

	const newBindDialogFooter = (
		<>
			<Button
				label="Cancel"
				icon="pi pi-times"
				className="p-button-text"
				onClick={(e) => setNewBindDialogVisibility(false)}
			/>
			<Button
				label="Save"
				icon="pi pi-check"
				className="p-button-text"
				onClick={() => {
					const newBind = {
						author: bindAuthor,
						text: bindText,
					} as BindEntry;
					bindsManagingService
						.addNewBind(newBind)
						.then(() => {
							notificationManager.SUCCESS(toast, `Successfully added new bind`);
							setNewBindDialogVisibility(false);
							setBindText("");
						})
						.catch((error) => {
							notificationManager.ERROR(
								toast,
								`Couldn't add the bind: ${error}`
							);
						});
				}}
			/>
		</>
	);

	const newBindSuggestionDialogFooter = (
		<>
			<Button
				label="Cancel"
				icon="pi pi-times"
				className="p-button-text"
				onClick={(e) => setNewBindSuggestionDialogVisibility(false)}
			/>
			<Button
				label="Save"
				icon="pi pi-check"
				className="p-button-text"
				onClick={() => {
					const newBind = {
						id: -1,
						proposedBy: steamUserData!.personaname,
						author: bindAuthor,
						text: bindText,
					} as BindSuggestionEntry;
					bindSuggestionsManagingService
						.addNewBindSuggestion(newBind)
						.then(() => {
							notificationManager.SUCCESS(
								toast,
								`Successfully suggested new bind`
							);
							setNewBindSuggestionDialogVisibility(false);
							setBindText("");
						})
						.catch((error) => {
							notificationManager.ERROR(
								toast,
								`Couldn't suggest the bind: ${error}`
							);
						});
				}}
			/>
		</>
	);

	const editBindDialogFooter = () => {
		return (
			<>
				<Button
					label="Cancel"
					icon="pi pi-times"
					className="p-button-text"
					onClick={() => {
						editingBindID.current = -1;
						setEditBindDialogVisibility(false);
					}}
				/>
				<Button
					label="Update"
					icon="pi pi-check"
					className="p-button-text"
					onClick={() => {
						if (editingBindID.current === -1) {
							notificationManager.ERROR(toast, `Something went wrong`);
							throw new Error("No update id was found");
						}
						const newBindData = {
							author: bindAuthor,
							text: bindText,
							id: editingBindID.current,
						} as BindEntry;
						bindsManagingService
							.updateBind(newBindData)
							.then(() => {
								notificationManager.SUCCESS(
									toast,
									`Successfully updated the bind`
								);
								setEditBindDialogVisibility(false);
								editingBindID.current = -1;
							})
							.catch((error) => {
								notificationManager.ERROR(
									toast,
									`Couldn't update the bind: ${error}`
								);
							});
					}}
				/>
			</>
		);
	};

	const getToolbarLeftSide = () => {
		return (
			<>
				{isAdmin && addNewBindButton()}
				{userID && addBindSuggestion()}
			</>
		);
	};

	const addBindSuggestion = () => {
		return (
			<Button
				label="Suggest Bind"
				icon="pi pi-plus"
				className="p-button-success mr-2"
				data-toggle="tooltip"
				title="Adds new bind suggestion"
				onClick={(e) => setNewBindSuggestionDialogVisibility(true)}
			></Button>
		);
	};

	const addNewBindButton = () => {
		return (
			<Button
				label="New Bind"
				icon="pi pi-plus"
				className="p-button-success mr-2"
				data-toggle="tooltip"
				title="Adds new bind"
				onClick={(e) => setNewBindDialogVisibility(true)}
			></Button>
		);
	};

	const dialogBindContent = () => {
		return (
			<>
				<h5>Author</h5>
				<InputText
					keyfilter={/^[a-zA-Z0-9 ]+$/}
					value={bindAuthor}
					onChange={(e) => setBindAuthor(e.target.value)}
				/>
				<h5>Text</h5>
				<InputText
					keyfilter={/^[a-zA-Z0-9 ]+$/}
					value={bindText}
					onChange={(e) => setBindText(e.target.value)}
				/>
			</>
		);
	};

	const addNewBindDialog = () => {
		return (
			<Dialog
				visible={newBindDialogVisibility}
				header="Add new Bind"
				modal
				className="p-fluid"
				footer={newBindDialogFooter}
				onHide={() => setNewBindDialogVisibility(false)}
			>
				{dialogBindContent()}
			</Dialog>
		);
	};

	const addNewBindSuggestionDialog = () => {
		return (
			<Dialog
				visible={newBindSuggestionDialogVisibility}
				header="Suggest new bind"
				modal
				className="p-fluid"
				footer={newBindSuggestionDialogFooter}
				onHide={() => setNewBindSuggestionDialogVisibility(false)}
			>
				{dialogBindContent()}
			</Dialog>
		);
	};

	const editBindDialog = () => {
		return (
			<Dialog
				visible={editBindDialogVisibility}
				header="Edit Bind"
				modal
				className="p-fluid"
				footer={editBindDialogFooter()}
				onHide={() => setEditBindDialogVisibility(false)}
			>
				{dialogBindContent()}
			</Dialog>
		);
	};

	const mapBinds = (binds: BindEntry[] | BindSuggestionEntry[]) => {
		return binds.map((bind) => {
			return {
				...bind,
				author: `${bind.author} : `,
			};
		});
	};

	return (
		<div
			className="hall-of-fame"
			style={{ backgroundImage: `url(${backgroundImage})` }}
		>
			<div className="card">
				<Toast ref={toast} />
				{addNewBindDialog()}
				{addNewBindSuggestionDialog()}
				{editBindDialog()}
				<Toolbar className="mb-4" left={getToolbarLeftSide()}></Toolbar>

				<div className="centered-text"> Binds</div>
				<div className="card">
					<DataTable value={mapBinds(binds)} scrollable={true}>
						{isAdmin && (
							<Column field="id" header="database ID" sortable></Column>
						)}
						<Column field="author" header="Author" sortable></Column>
						<Column field="text" header="Text" sortable></Column>
						{isAdmin && (
							<Column header="Actions" body={bindActionBodyTemplate}></Column>
						)}
					</DataTable>
				</div>

				{isAdmin && (
					<>
						<div className="centered-text">Bind Suggestions</div>
						<div className="card">
							<DataTable value={mapBinds(bindSuggestions)} scrollable={true}>
								<Column field="proposedBy" header="Proposed By"></Column>
								<Column field="id" header="database ID" sortable></Column>
								<Column field="author" header="Author" sortable></Column>
								<Column field="text" header="Text" sortable></Column>
								<Column header="Actions" body={bindSuggestionBody}></Column>
							</DataTable>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
