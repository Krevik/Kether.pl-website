import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import backgroundImage from "../../resources/backgrounds/background_2.jpg";
import "./HallOfFame.css";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/store";
import { bindsManagingService } from "../../services/bindsManagingService";
import { Button } from "primereact/button";
import { BindEntry, BindSuggestionEntry } from "../../models/bindsModels";
import { useEffect, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
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

	const bindSuggestionBodyTemplate = (rowData: BindSuggestionEntry) => {
		return (
			<>
				<Button
					data-toggle="tooltip"
					title="Accepts the given bind"
					icon="pi pi-check"
					className="p-button-rounded p-button-success"
					onClick={() => {
						const bind = rowData;
						bindsManagingService
							.addNewBind(bind)
							.then((addedBind) => {
								toast.current!.show({
									severity: "success",
									summary: "Successful",
									detail: `Successfully accepted new bind: ${addedBind}`,
									life: 3000,
								});
								bindSuggestionsManagingService
									.deleteBindSuggestion(bind)
									.then((deletedBind) => {
										toast.current!.show({
											severity: "success",
											summary: "Successful",
											detail: `Successfully deleted bind suggestion: ${deletedBind}`,
											life: 3000,
										});
									})
									.catch((error) => {
										toast.current!.show({
											severity: "error",
											summary: "Failed",
											detail: `Couldn't delete bind suggestion: ${error}`,
											life: 3000,
										});
									});
							})
							.catch((error) => {
								toast.current!.show({
									severity: "error",
									summary: "Failed",
									detail: `Couldn't add new bind: ${error}`,
									life: 3000,
								});
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
								toast.current!.show({
									severity: "success",
									summary: "Successful",
									detail: `Successfully deleted bind suggestion: ${deletedBind}`,
									life: 3000,
								});
								setNewBindDialogVisibility(false);
								setBindText("");
							})
							.catch((error) => {
								toast.current!.show({
									severity: "error",
									summary: "Failed",
									detail: `Couldn't delete bind suggestion: ${error}`,
									life: 3000,
								});
							});
					}}
				/>
			</>
		);
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
						setBindAuthor(rowData.author);
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
								toast.current!.show({
									severity: "success",
									summary: "Successful",
									detail: `${deletedBindResponse}`,
									life: 3000,
								});
								setNewBindDialogVisibility(false);
								setBindText("");
							})
							.catch((error) => {
								toast.current!.show({
									severity: "error",
									summary: "Failed",
									detail: `Couldn't delete the bind: ${error}`,
									life: 3000,
								});
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
							toast.current!.show({
								severity: "success",
								summary: "Successful",
								detail: `Successfully added new bind`,
								life: 3000,
							});
							setNewBindDialogVisibility(false);
							setBindText("");
						})
						.catch((error) => {
							toast.current!.show({
								severity: "error",
								summary: "Failed",
								detail: `Couldn't add the bind: ${error}`,
								life: 3000,
							});
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
							toast.current!.show({
								severity: "success",
								summary: "Successful",
								detail: `Successfully suggested new bind`,
								life: 3000,
							});
							setNewBindSuggestionDialogVisibility(false);
							setBindText("");
						})
						.catch((error) => {
							toast.current!.show({
								severity: "error",
								summary: "Failed",
								detail: `Couldn't suggest the bind: ${error}`,
								life: 3000,
							});
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
							toast.current!.show({
								severity: "error",
								summary: "Failed",
								detail: `Something went wrong`,
								life: 3000,
							});
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
								toast.current!.show({
									severity: "success",
									summary: "Successful",
									detail: `Successfully updated the bind`,
									life: 3000,
								});
								setEditBindDialogVisibility(false);
								editingBindID.current = -1;
							})
							.catch((error) => {
								toast.current!.show({
									severity: "error",
									summary: "Failed",
									detail: `Couldn't update the bind: ${error}`,
									life: 3000,
								});
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
				<h5>Author</h5>
				<InputText
					keyfilter={"int" && "alpha"}
					value={bindAuthor}
					onChange={(e) => setBindAuthor(e.target.value)}
				/>
				<h5>Text</h5>
				<InputText
					keyfilter={"int" && "alpha"}
					value={bindText}
					onChange={(e) => setBindText(e.target.value)}
				/>
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
				<h5>Author</h5>
				<InputText
					keyfilter={"int" && "alpha"}
					value={bindAuthor}
					onChange={(e) => setBindAuthor(e.target.value)}
				/>
				<h5>Text</h5>
				<InputText
					keyfilter={"int" && "alpha"}
					value={bindText}
					onChange={(e) => setBindText(e.target.value)}
				/>
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
				<h5>Author</h5>
				<InputText
					keyfilter={"int" && "alpha"}
					value={bindAuthor}
					onChange={(e) => setBindAuthor(e.target.value)}
				/>
				<h5>Text</h5>
				<InputText
					keyfilter={"int" && "alpha"}
					value={bindText}
					onChange={(e) => setBindText(e.target.value)}
				/>
			</Dialog>
		);
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
					<DataTable value={binds} scrollable={true}>
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
							<DataTable value={bindSuggestions} scrollable={true}>
								<Column field="proposedBy" header="Proposed By"></Column>
								<Column field="id" header="database ID" sortable></Column>
								<Column field="author" header="Author" sortable></Column>
								<Column field="text" header="Text" sortable></Column>
								<Column
									header="Actions"
									body={bindSuggestionBodyTemplate}
								></Column>
							</DataTable>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
