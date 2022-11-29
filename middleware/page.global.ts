export default defineNuxtRouteMiddleware((to, from) => {
    to.meta.pageTransition = { name: 'page-to' };
    from.meta.pageTransition = { name: 'page-from' };
})