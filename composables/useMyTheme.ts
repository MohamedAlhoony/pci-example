export default function useMyTheme() {
  const theme = useState("theme");
  const themeCookie = useCookie("theme");
  theme.value = themeCookie.value || "light";
  const toggleTheme = () => {
    if (theme.value === "light") {
      themeCookie.value = "dark";
      theme.value = "dark";
    } else {
      themeCookie.value = "light";
      theme.value = "light";
    }
  };
  return { theme, toggleTheme };
}
