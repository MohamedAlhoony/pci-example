export default function usePringDialog() {
  const dialog = useState("printDialog", () => false);
  const title = useState("printDialogTitle", () => "");
  const closeDialog = () => {
    dialog.value = false;
  };
  const openDialog = () => {
    dialog.value = true;
  };

  const setTitle = (_title: string) => {
    title.value = _title;
  };

  return { dialog, closeDialog, openDialog, title, setTitle };
}
