export enum ToastLevelType {
    error, success, info, debug
}

export class ToastLevel {

    constructor(private type: ToastLevelType, private styles: string, private iconName: string) {
        this.type = type;
        this.styles = styles;
        this.iconName = iconName;
    }
    
    public get getIconName() : string {
        return this.iconName;
    }
    
    public get getStyles() : string {
        return this.styles;
    }

    static error() {
        return new ToastLevel(ToastLevelType.error, 'bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200', "material-symbols:error")
    }

    static success() {
        return new ToastLevel(ToastLevelType.success, 'bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200', "material-symbols:check-small-rounded")
    }

    static info() {
        return new ToastLevel(ToastLevelType.info, 'bg-blue-100 text-blue-500 dark:bg-blue-800 dark:text-blue-200', "mdi:information-variant")
    }

    static debug() {
        return new ToastLevel(ToastLevelType.debug, 'bg-yellow-100 text-yellow-500 dark:bg-yellow-800 dark:text-yellow-200', "carbon:debug")
    }
}

export enum DimensionUnit {
    mms, inches
}