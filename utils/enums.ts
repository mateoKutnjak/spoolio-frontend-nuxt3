export enum ToastLevelType {
    error, success, info, debug
}

export class ToastLevel {
    constructor(public type: ToastLevelType, public backgroundColor: string, public iconColor: string, public iconName: string) {
        this.type = type;
        this.backgroundColor = backgroundColor;
        this.iconColor = iconColor;

        this.iconName = iconName;
    }

    static error() {
        return new ToastLevel(ToastLevelType.error, 'bg-red-500', 'text-red-500', "material-symbols:error")
    }

    static success() {
        return new ToastLevel(ToastLevelType.success, 'bg-green-500', 'text-green-500', "material-symbols:check-circle-rounded")
    }

    static info() {
        return new ToastLevel(ToastLevelType.info, 'bg-blue-500', 'text-blue-500', "material-symbols:info-rounded")
    }

    static debug() {
        return new ToastLevel(ToastLevelType.debug, 'bg-yellow-500', 'text-yellow-500', "carbon:debug")
    }
}

export enum DimensionUnit {
    mms, inches
}