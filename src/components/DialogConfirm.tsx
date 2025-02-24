

const ConfirmPopup = ({
    deleteConfirmed,
    confirmText,
    popupId,
}: {
    deleteConfirmed: () => void;
    confirmText: string;
    popupId?: string;
}) => {
    if (!confirmText) return (confirmText = "Are you sure you want to delete this item?");
    return (
        <dialog id={popupId ? popupId : "confirmPopup"} className="bg-neutral-900 text-center p-6 m-auto">
            <div className="modal-box bg-base-100">
                {/* <h3 className="font-bold text-lg">Confirmation</h3> */}
                <p className="py-4 font-semibold">{confirmText}</p>
                <div className="modal-action">
                    <div className="flex justify-between w-full gap-4">
                        {/* if there is a button in form, it will close the modal */}
                        <button onClick={
                            (e: any) => {
                                e.preventDefault();
                                deleteConfirmed();
                                const dialog = document.getElementById(popupId ? popupId : "confirmPopup") as HTMLDialogElement;
                                dialog.close();
                            }
                        } className="p-3 bg-red-900  cursor-pointer">
                            Confirm
                        </button>
                        <button
                            onClick={(e: any) => {
                                e.preventDefault();
                                const dialog = document.getElementById(popupId ? popupId : "confirmPopup") as HTMLDialogElement;
                                dialog.close();
                            }}
                            className="bg-neutral-700 px-6 cursor-pointer">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </dialog>
    );
};

export default ConfirmPopup;
