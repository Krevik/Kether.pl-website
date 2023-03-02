import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import backgroundImage from "../../resources/backgrounds/background_2.jpg";
import "./HallOfFame.css";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/store";
import { bindsManagingService } from "../../services/bindsManagingService";
import { Button } from "primereact/button";
import { BindEntry } from "../../models/bindsModels";
import { useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Toolbar } from "primereact/toolbar";

export default function HallOfFame() {
	const binds = useSelector((state: AppState) => state.bindsReducer.binds);
	const userID = useSelector((state: AppState) => state.userDataReducer.userID);
	const isAdmin: boolean = useSelector(
		(state: AppState) => state.userDataReducer.isAdmin
	);

	const [newBindDialogVisibility, setNewBindDialogVisibility] = useState(false);
	const [editBindDialogVisibility, setEditBindDialogVisibility] =
		useState(false);
	const [bindAuthor, setBindAuthor] = useState("");
	const editingBindID = useRef(-1);
	const [bindText, setBindText] = useState("");

	const toast = useRef<Toast>(null);

	bindsManagingService.useBindsLoadingService();

	const actionBodyTemplate = (rowData: BindEntry) => {
		return (
			<>
				<Button
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
					icon="pi pi-trash"
					className="p-button-rounded p-button-warning"
					onClick={() => {
						bindsManagingService
							.deleteBind(rowData)
							.then((deletedBind) => {
								toast.current!.show({
									severity: "success",
									summary: "Successful",
									detail: `Successfully deleted bind: ${deletedBind}`,
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

	const editBindDialogFooter = () => {
		return (
			<>
				<Button
					label="Cancel"
					icon="pi pi-times"
					className="p-button-text"
					onClick={(e) => setEditBindDialogVisibility(false)}
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
								setNewBindDialogVisibility(false);
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

	const addNewBindButton = () => {
		return (
			<Button
				label="New Bind"
				icon="pi pi-plus"
				className="p-button-success mr-2"
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
					value={bindAuthor}
					onChange={(e) => setBindAuthor(e.target.value)}
				/>
				<h5>Text</h5>
				<InputText
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
					value={bindAuthor}
					onChange={(e) => setBindAuthor(e.target.value)}
				/>
				<h5>Text</h5>
				<InputText
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
				{editBindDialog()}
				{isAdmin && (
					<Toolbar className="mb-4" left={addNewBindButton()}></Toolbar>
				)}
				<DataTable value={binds} scrollable={true}>
					{isAdmin && (
						<Column field="id" header="database ID" sortable></Column>
					)}
					<Column field="author" header="Author" sortable></Column>
					<Column field="text" header="Text" sortable></Column>
					{isAdmin && (
						<Column header="Actions" body={actionBodyTemplate}></Column>
					)}
				</DataTable>
			</div>
		</div>
	);
}
