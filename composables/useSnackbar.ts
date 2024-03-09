export default function useSnackbar() {
  const show = useState("show", () => false);
  const color = useState("color", () => "");
  const text = useState("text", () => "");
  const responseMsg = useState("responseMsg", () => "");
  const timeout = useState("timeout", () => "4000");

  const snackbar = ({
    isOpen,
    mode,
    content,
    _responseMsg,
  }: {
    isOpen: boolean;
    mode: "success" | "error" | "info";
    content: string;
    _responseMsg: string;
  }) => {
    show.value = isOpen;
    color.value =
      mode === "success" ? "green" : mode === "error" ? "red" : "blue";
    text.value = content;
    responseMsg.value = _responseMsg ?? "";
  };

  return { snackbar, show, color, text, timeout, responseMsg };
}
