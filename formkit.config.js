import { generateClasses } from '@formkit/themes'
import { createAutoAnimatePlugin } from '@formkit/addons'

export default {
    config: {
        classes: generateClasses({
            text: {
                outer: 'mb-5 formkit-disabled:opacity-40',
                label: 'block mb-1 font-bold text-sm formkit-invalid:text-red-500',
                inner: `
                    border border-gray-400
                    rounded-lg
                    mb-1
                    overflow-hidden
                    focus-within:border-blue-500
                    formkit-invalid:border-red-500
                    `,
                input: 'w-full h-10 px-3 border-none text-base text-gray-700 placeholder-gray-400 focus:outline-none',
                help: 'text-xs text-gray-500',
                messages: 'list-none p-0 mt-1 mb-0',
                message: 'text-red-500 mb-1 text-xs',
            },
            email: {
                outer: 'mb-5 formkit-disabled:opacity-40',
                label: 'block mb-1 font-bold text-sm formkit-invalid:text-red-500',
                inner: `
                    border border-gray-400
                    rounded-lg
                    mb-1
                    overflow-hidden
                    focus-within:border-blue-500
                    formkit-invalid:border-red-500
                    `,
                input: 'w-full h-10 px-3 border-none text-base text-gray-700 placeholder-gray-400 focus:outline-none',
                help: 'text-xs text-gray-500',
                messages: 'list-none p-0 mt-1 mb-0',
                message: 'text-red-500 mb-1 text-xs',
            },
            password: {
                outer: 'mb-5 formkit-disabled:opacity-40',
                label: 'block mb-1 font-bold text-sm formkit-invalid:text-red-500',
                inner: `
                    border border-gray-400
                    rounded-lg
                    mb-1
                    overflow-hidden
                    focus-within:border-blue-500
                    formkit-invalid:border-red-500
                    `,
                input: 'w-full h-10 px-3 border-none text-base text-gray-700 placeholder-gray-400 focus:outline-none',
                help: 'text-xs text-gray-500',
                messages: 'list-none p-0 mt-1 mb-0',
                message: 'text-red-500 mb-1 text-xs',
            },
            tel: {
                outer: 'mb-5 formkit-disabled:opacity-40',
                label: 'block mb-1 font-bold text-sm formkit-invalid:text-red-500',
                inner: `
                    border border-gray-400
                    rounded-lg
                    mb-1
                    overflow-hidden
                    focus-within:border-blue-500
                    formkit-invalid:border-red-500
                    `,
                input: 'w-full h-10 px-3 border-none text-base text-gray-700 placeholder-gray-400 focus:outline-none',
                help: 'text-xs text-gray-500',
                messages: 'list-none p-0 mt-1 mb-0',
                message: 'text-red-500 mb-1 text-xs',
            },
            textarea: {
                outer: 'mb-5 formkit-disabled:opacity-40',
                label: 'block mb-1 font-bold text-sm formkit-invalid:text-red-500',
                inner: `
                    border border-gray-400
                    rounded-lg
                    mb-1
                    overflow-hidden
                    focus-within:border-blue-500
                    formkit-invalid:border-red-500
                    `,
                input: 'block w-full h-32 px-3 border-none text-base text-gray-700 placeholder-gray-400 focus:shadow-outline',
                help: 'text-xs text-gray-500',
                messages: 'list-none p-0 mt-1 mb-0',
                message: 'text-red-500 mb-1 text-xs',
            },
            file: {
                label: 'block mb-1 font-bold text-sm',
                inner: 'max-w-md cursor-pointer',
                input: 'text-gray-600 text-sm mb-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-blue-500 file:text-white hover:file:bg-blue-600',
                noFiles: 'block text-gray-800 text-sm mb-1',
                fileItem: 'block flex text-gray-800 text-sm mb-1',
                removeFiles: 'ml-auto text-blue-500 text-sm'
            },
            submit: {
                wrapper: 'mb-1',
                input: 'bg-blue-500 hover:bg-blue-700 text-white text-sm font-normal py-3 px-5 rounded'
            }
        })
    },
    plugins: [
        createAutoAnimatePlugin()
    ]
}