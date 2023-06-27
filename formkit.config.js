import { generateClasses } from '@formkit/themes'
import { createAutoAnimatePlugin } from '@formkit/addons'

const textClassification = {
    label: 'w-full lock mb-2 text-sm font-medium text-gray-800',
    inner: 'w-full bg-gray-50 border border-stone-400/80 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:outline-none overflow-hidden',
    input: 'w-full bg-transparent focus:outline-none px-2',
    wrapper: 'shadow-xs',
    outer: 'mb-3',
    message: 'flex px-5 pt-1 mb-0'
}
const selectClassification = {
    input: 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5 focus:outline-none overflow-hidden',
    label: 'w-full lock mb-2 text-sm font-medium text-gray-800',
    selectIcon: 'bg-green-500',
    suffixIcon: 'mx-5',
}
const boxClassification = {
    fieldset: 'max-w-md rounded-md px-2 pb-1',
    legend: 'font-bold text-sm',
    wrapper: 'flex gap-3 items-center cursor-pointer',
    input: 'checkbox',
    label: 'label-text',
    inner: 'p-0 m-0',
    option: 'm-0',
    options: 'flex gap-6'
}
const buttonClassification = {
    input: 'btn btn-primary rounded-md font-bold text-base',
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
            select: selectClassification,
            submit: buttonClassification,
            tel: textClassification,
            text: textClassification,
            textarea: {
                ...textClassification,
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