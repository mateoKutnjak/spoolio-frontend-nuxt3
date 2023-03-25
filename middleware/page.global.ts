import { RESTRICTED_PAGES_STARTS_WITH, RESTRICT_ALL_NON_INDEX_PAGES_FOR_GUESTS } from "~~/constants/constants";
import { useAuthStore } from "~~/stores/auth";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const authStore = useAuthStore();

    if (!authStore.loggedIn) {

        let redirectToHome = false;

        if (RESTRICT_ALL_NON_INDEX_PAGES_FOR_GUESTS) {
            if (to.path !== '/') {
                redirectToHome = true;
            }
        } else {
            RESTRICTED_PAGES_STARTS_WITH.forEach(element => {
                if (to.path.startsWith(element)) {
                    redirectToHome = true;
                }
            });
        }

        if (redirectToHome) {
            console.log("Redirecting to home screen because user is not logged in");
            abortNavigation('Cannot access this site whan not logged in')
        }
    }

})