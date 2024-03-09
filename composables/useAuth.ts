export interface UserType {
  data: {
    user_name: "admin01";
    F_name: "admin";
    L_Name: "admin";
    user_id: "";
  };
  permission: [];
}
export default function useAuth() {
  const authenticated = useState("authenticated", () => false);
  const user = useState<UserType | null>("user", () => null);
  const checked = useState("checked", () => false);
  const userToken = useState("token", () => "");
  const setToken = (token: string) => {
    localStorage.setItem("token", token);
    let today = new Date();
    let expiryDate = new Date();
    expiryDate.setTime(today.getTime() + 60 * 60 * 1000 * 24); // 60 * 60 * 1000 * 24 =>day 60 * 5 * 1000=>5 min
    localStorage.setItem("date", JSON.stringify(expiryDate));
  };
  const logout = async (locale?: string) => {
    localStorage.removeItem("token");
    localStorage.removeItem("date");
    authenticated.value = false;
    user.value = null;
    // if (locale === "ar") {
    return await navigateTo("/login");
    // } else {
    // return await navigateTo("/en/login");
    // }
  };
  const login = async (username: string, password: string) => {
    return new Promise((resolve, reject) => {
      checked.value = true;
      authenticated.value = true;
      setToken("token");
      userToken.value = "token";
      user.value = {
        data: {
          user_name: "admin01",
          F_name: "admin",
          L_Name: "admin",
          user_id: "",
        },
        permission: [],
      };
      resolve(user.value);
    });

    // return await useMyFetch("/api/user/login", {
    //   method: "POST",
    //   body: {
    //     username,
    //     password,
    //   },
    //   onResponse({ response }) {
    //     checked.value = true;
    //     if (response._data.token) {
    //       authenticated.value = true;
    //       setToken(response._data.token);
    //       userToken.value = response._data.token;
    //       user.value = response._data.user;
    //     }
    //   },
    //   // async onRequestError({ request, response, options }) {
    //   //   console.log("error");
    //   // },
    // });
  };

  return { login, authenticated, logout, userToken, user, checked };
}
