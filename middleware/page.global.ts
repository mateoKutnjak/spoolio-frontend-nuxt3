import { RESTRICTED_PAGES_STARTS_WITH } from "~~/constants/constants";
import { useAuthStore } from "~~/stores/auth";

export default defineNuxtRouteMiddleware(async (to, from) => {
    to.meta.pageTransition = { name: 'page-to' };
    from.meta.pageTransition = { name: 'page-from' };

    const authStore = useAuthStore();

    if (!authStore.loggedIn) {

        let redirectToHome = false;

        RESTRICTED_PAGES_STARTS_WITH.forEach(element => {
            if (to.path.startsWith(element)) {
                redirectToHome = true;
            }
        });

        if (redirectToHome) {
            console.log("Redirecting to home screen because user is not logged in");
            abortNavigation('Cannot access this site whan not logged in')
        }
    }

})