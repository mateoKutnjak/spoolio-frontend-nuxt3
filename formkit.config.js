import { generateClasses } from '@formkit/themes'
import { createAutoAnimatePlugin } from '@formkit/addons'

const textClassification = {
    label: 'w-full lock mb-2 text-sm font-medium text-gray-800',
    inner: 'w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:outline-none overflow-hidden',
    input: 'w-full bg-transparent focus:outline-none',
}
const boxClassification = {
    fieldset: 'max-w-md border border-gray-400 rounded-md px-2 pb-1',
    legend: 'font-bold text-sm',
    wrapper: 'flex items-center mb-1 cursor-pointer',
    help: 'mb-2',
    input: 'form-check-input appearance-none h-5 w-5 mr-2 border border-gray-500 rounded-sm bg-white checked:bg-blue-500 focus:outline-none focus:ring-0 transition duration-200',
    label: 'text-sm text-gray-700 mt-1'
}
const buttonClassification = {
    input: 'btn btn-primary'
}

export default {
    config: {
        classes: generateClasses({
            global: {
                outer: 'mb-5 formkit-disabled:opacity-50',
                help: 'text-xs text-gray-500',
                messages: 'list-none p-0 mt-1 mb-0',
                message: 'text-red-500 mb-1 text-xs'
            },
            button: buttonClassification,
            color: {
                label: 'block mb-1 font-bold text-sm',
                input: 'w-16 h-8 appearance-none cursor-pointer border border-gray-300 rounded-md mb-2 p-1'
            },
            date: textClassification,
            'datetime-local': textClassification,
            checkbox: boxClassification,
            email: textClassification,
            file: {
                outer: 'h-0 bg-transparent text-transparent',
                wrapper: 'h-0 bg-transparent text-transparent',
                label: 'h-0 bg-transparent text-transparent',
                inner: 'h-0 bg-transparent text-transparent hidden',
                input: 'h-0 bg-transparent text-transparent',
                noFiles: 'h-0 bg-transparent text-transparent',
                fileItem: 'h-0 bg-transparent text-transparent',
                fileList: 'h-0 bg-transparent text-transparent',
                fileItemIcon: 'h-0 bg-transparent text-transparent',
                fileRemove: 'h-0 bg-transparent text-transparent',
                removeFiles: 'h-0 bg-transparent text-transparent',
                help: 'h-0 bg-transparent text-transparent',
                message: 'flex items-end justify-end'

            },
            month: textClassification,
            number: textClassification,
            password: textClassification,
            radio: {
                // if we want to override a given sectionKey
                // from a classification we can do a spread
                // of the default value along with a new
                // definition for our target sectionKey.
                ...boxClassification,
                input: boxClassification.input.replace('rounded-sm', 'rounded-full'),
            },
            range: {
                inner: 'max-w-md',
                input: 'form-range appearance-none w-full h-2 p-0 bg-gray-200 rounded-full focus:outline-none focus:ring-0 focus:shadow-none'
            },
            search: textClassification,
            select: textClassification,
            submit: buttonClassification,
            tel: textClassification,
            text: textClassification,
            textarea: {
                ...textClassification,
                input: 'block w-full h-32 px-3 border-none text-base text-gray-700 placeholder-gray-400 focus:shadow-outline',
            },
            time: textClassification,
            url: textClassification,
            week: textClassification,
        })
    },
    plugins: [
        createAutoAnimatePlugin()
    ]
}