import { IAddressBilling, IAddressShipping } from "~~/constants/data";

export function isValidShippingAddress(address: IAddressShipping | undefined) {
    if (!address) return false;

    return address.first_name &&
        address.last_name &&
        address.address &&
        address.country &&
        address.locality &&
        address.postal_code;
}

export function isValidBillingAddress(address: IAddressBilling | undefined) {
    if (!address) return false;

    return address.first_name &&
        address.last_name &&
        address.address &&
        address.country &&
        address.locality &&
        address.postal_code;
}