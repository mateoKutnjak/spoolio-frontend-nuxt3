import { IAddressResponse } from "~~/stores/auth";

export function isValidShippingAddress(address: IAddressResponse) {
    return address.first_name &&
        address.last_name &&
        address.address &&
        address.country &&
        address.locality &&
        address.postal_code;
}

export function isValidBillingAddress(address: IAddressResponse) {
    return address.first_name &&
        address.last_name &&
        address.address &&
        address.country &&
        address.locality &&
        address.postal_code;
}