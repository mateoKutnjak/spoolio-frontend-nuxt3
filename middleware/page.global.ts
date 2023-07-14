import { RESTRICTED_PAGES_STARTS_WITH, RESTRICT_ALL_NON_INDEX_PAGES_FOR_GUESTS, RESTRICT_PAGES_NON_ADMIN_STARTS_WITH } from "~~/constants/constants";
import { useAuthStore } from "~~/stores/auth";
import { usePrintOrderStore } from "~~/stores/print_order";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const authStore = useAuthStore();

    let redirectToHome = false;

    if (to.path.includes('/services/printing/checkout')) {
        const printOrderStore = usePrintOrderStore();
        if (printOrderStore.units.length === 0) {
            abortNavigation('Cannot proceed to checkout. No items found in print order.')
            return;
        }
    }

    if (!authStore.loggedIn) {

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
    } else if (authStore.user?.is_staff || false) {
        // * User is logged in and it is an admin
    } else {
        // * User is logged in but is not an admin

        RESTRICT_PAGES_NON_ADMIN_STARTS_WITH.forEach(el => {
            if (to.path.startsWith(el)) {
                redirectToHome = true;
            }
        })
    }

    if (redirectToHome) {
        console.log("Redirecting to home screen because user is not logged in");
        abortNavigation('Cannot access this site whan not logged in')
    }
})