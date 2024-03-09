// middlewares/isAdministrator
import { UserType } from "~~/composables/useAuth";
export default defineNuxtRouteMiddleware(async (to, from) => {
  if (!process.client) return;
  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    const date = localStorage.getItem("date");
    const parsedDate = date && JSON.parse(date);
    if (token && parsedDate && new Date(parsedDate) > new Date()) {
      return true;
    }
    return false;
  };
  const { authenticated, userToken, user } = useAuth();
  const isLoggedIn = isAuthenticated();
  if (to.meta.layout === "auth") {
    if (!isLoggedIn) {
      return navigateTo("/login");
    } else {
      const token = localStorage.getItem("token")!;
      authenticated.value = true;
      userToken.value = token;
      user.value = {
        data: {
          user_name: "admin01",
          F_name: "admin",
          L_Name: "admin",
          user_id: "",
        },
        permission: [],
      };
      // if (!user.value) {
      //   const { data } = await useMyFetch<UserType>("/api/user/profile");
      //   user.value = data.value;
      // }
      if (user) {
        checkforPermission(user.value?.permission!, to.name);
      }
    }
  } else if (to.name === "login___ar" && isLoggedIn) {
    return navigateTo("/");
  }
});

const showPermissionError = () => {
  showError({
    statusCode: 406,
    statusMessage: "ليس لديك الصلاحية للوصول لهذه الصفحة",
  });
};
const checkforPermission = (permission: string[], routeName: any) => {
  console.log(routeName);
  if (
    routeName === "user___ar" &&
    !["Index-Users", "Index-Groups"].every((e) => permission.includes(e))
  ) {
    showPermissionError();
  } else if (
    routeName === "user-create___ar" &&
    !["Add-User", "Index-Groups"].every((e) => permission.includes(e))
  ) {
    showPermissionError();
  } else if (
    routeName === "user-id-update___ar" &&
    !["Update-User", "Index-Groups", "Index-Users"].every((e) =>
      permission.includes(e)
    )
  ) {
    showPermissionError();
  } else if (
    routeName === "user-id-password-reset___ar" &&
    !["Change-Password"].every((e) => permission.includes(e))
  ) {
    showPermissionError();
  } else if (
    routeName === "ips-user___ar" &&
    !["Index-Users-Ips"].every((e) => permission.includes(e))
  ) {
    showPermissionError();
  } else if (
    routeName === "transaction___ar" &&
    !["Index-Transaction"].every((e) => permission.includes(e))
  ) {
    showPermissionError();
  } else if (
    routeName === "log___ar" &&
    !["Index-Logs"].every((e) => permission.includes(e))
  ) {
    showPermissionError();
  }
  // else if (routeName === "bank___ar" && !permission.includes("Index-Bank")) {
  //   showPermissionError();
  // }
  else if (
    routeName === "bank-create___ar" &&
    !permission.includes("Add-Bank")
  ) {
    showPermissionError();
  } else if (
    routeName === "bank-id-update___ar" &&
    !["Update-Bank"].every((e) => permission.includes(e))
  ) {
    showPermissionError();
  } else if (
    routeName === "ips-bank___ar" &&
    !permission.includes("Index-Bank-IPS")
  ) {
    showPermissionError();
  } else if (
    routeName === "ips-bank-create___ar" &&
    !permission.includes("Add-Bank-IPS")
  ) {
    showPermissionError();
  } else if (
    routeName === "ips-bank-id-update___ar" &&
    !["Update-Bank-IPS", "Index-Bank-IPS"].every((e) => permission.includes(e))
  ) {
    showPermissionError();
  }
  // else if (
  //   routeName === "bank-id-branch___ar" &&
  //   !permission.includes("Index-Branch")
  // ) {
  //   showPermissionError();
  // } else if (
  //   routeName === "bank-id-branch-create___ar" &&
  //   !permission.includes("Add-Branch")
  // ) {
  //   showPermissionError();
  // } else if (
  //   routeName === "bank-id-branch-branchId-update___ar" &&
  //   !["Update-Branch", "Index-Branch"].every((e) => permission.includes(e))
  // ) {
  //   showPermissionError();
  // }
  else if (
    routeName === "group___ar" &&
    !["Index-Groups", "Index-Permission"].every((e) => permission.includes(e))
  ) {
    showPermissionError();
  } else if (
    routeName === "group-create___ar" &&
    !["Add-Group", "Index-Permission"].every((e) => permission.includes(e))
  ) {
    showPermissionError();
  } else if (
    routeName === "group-id-update___ar" &&
    !["Update-Group", "Index-Permission"].every((e) => permission.includes(e))
  ) {
    showPermissionError();
  } else if (
    routeName === "profile-change-password___ar" &&
    !["Update-password"].every((e) => permission.includes(e))
  ) {
    showPermissionError();
  }
};
