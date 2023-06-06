import { IProfile } from "~~/constants/data";

export function userProfileInitials(profile: IProfile | null | undefined) {
    if (!profile) {
        return 'A';
    }

    if (profile.first_name === null && profile.last_name === null) {
        return 'A';
    }

    return (profile.first_name ? profile.first_name[0] : '') + (profile.last_name ? profile.last_name[0] : '')
}