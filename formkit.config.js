import { generateClasses } from '@formkit/themes'
import { createAutoAnimatePlugin } from '@formkit/addons'

export default {
    config: {
        classes: generateClasses({
            text: {
                outer: 'mb-5',
                label: 'block mb-2 text-sm font-medium text-gray-900 dark:text-white',
                inner: 'border border-grey-400 rounded-lg mb-1 overflow-hidden focus-within:border-blue-500',
                input: 'w-full h-10 px-3 border-none text-base text-gray-700 placeholder-gray-400',
                help: 'text-xs text-gray-500',
                messages: 'list-none p-0 mt-1 mb-0',
                message: 'text-red-500 mb-1 text-xs',
            },
            email: {
                outer: 'mb-5',
                label: 'block mb-2 text-sm font-medium text-gray-900 dark:text-white',
                inner: 'border border-red-400 rounded-lg mb-1 overflow-hidden focus-within:border-blue-500',
                input: 'w-full h-10 px-3 border-none text-base text-gray-700 placeholder-gray-400',
                help: 'text-xs text-gray-500',
                messages: 'list-none p-0 mt-1 mb-0',
                message: 'text-red-500 mb-1 text-xs'
            },
            password: {
                outer: 'mb-5',
                label: 'block mb-2 text-sm font-medium text-gray-900 dark:text-white',
                inner: 'border border-red-400 rounded-lg mb-1 overflow-hidden focus-within:border-blue-500',
                input: 'w-full h-10 px-3 border-none text-base text-gray-700 placeholder-gray-400',
                help: 'text-xs text-gray-500',
                messages: 'list-none p-0 mt-1 mb-0',
                message: 'text-red-500 mb-1 text-xs'
            },
            tel: {
                outer: 'mb-5',
                label: 'block mb-2 text-sm font-medium text-gray-900 dark:text-white',
                inner: 'border border-red-400 rounded-lg mb-1 overflow-hidden focus-within:border-blue-500',
                input: 'w-full h-10 px-3 border-none text-base text-gray-700 placeholder-gray-400',
                help: 'text-xs text-gray-500',
                messages: 'list-none p-0 mt-1 mb-0',
                message: 'text-red-500 mb-1 text-xs'
            },
            textarea: {
                outer: 'mb-5',
                label: 'block mb-2 text-sm font-medium text-gray-900 dark:text-white',
                inner: 'border border-red-400 rounded-lg mb-1 overflow-hidden focus-within:border-blue-500',
                input: 'w-full px-3 border-none text-base text-gray-700 placeholder-gray-400',
                help: 'text-xs text-gray-500',
                messages: 'list-none p-0 mt-1 mb-0',
                message: 'text-red-500 mb-1 text-xs'
            },
            file: {
                outer: 'mb-5',
                label: 'block mb-2 text-sm font-medium text-gray-900 dark:text-white',
                inner: 'border border-red-400 rounded-lg mb-1 overflow-hidden focus-within:border-blue-500',
                input: 'w-full px-3 border-none text-base text-gray-700 placeholder-gray-400',
                help: 'text-xs text-gray-500',
                messages: 'list-none p-0 mt-1 mb-0',
                message: 'text-red-500 mb-1 text-xs'
            },
            submit: {
                outer: 'mb-5',
                label: 'block mb-2 text-sm font-medium text-gray-900 dark:text-white',
                inner: 'border border-red-400 rounded-lg mb-1 overflow-hidden focus-within:border-blue-500',
                input: 'w-full h-10 px-3 border-none text-base text-gray-700 placeholder-gray-400',
                help: 'text-xs text-gray-500',
                messages: 'list-none p-0 mt-1 mb-0',
                message: 'text-red-500 mb-1 text-xs'
            }
        })
    },
    plugins: [
        createAutoAnimatePlugin()
    ]
}