import { BILLING_ADDRESS_TYPE_COMPANY, BILLING_ADDRESS_TYPE_INDIVIDUAL } from "~~/constants/constants";
import { IAddressBilling, IAddressShipping } from "~~/constants/data";

export function isValidShippingAddress(address: IAddressShipping | undefined) {
    if (!address) return false;

    return address.first_name &&
        address.last_name &&
        address.address &&
        address.country &&
        address.locality &&
        address.postal_code &&
        address.phone_number;
}

export function isValidBillingAddress(address: IAddressBilling | undefined) {
    if (!address) return false;

    if (address.type == BILLING_ADDRESS_TYPE_INDIVIDUAL) {
        return address.first_name &&
            address.last_name &&

            address.address &&
            address.country &&
            address.locality &&
            address.postal_code;
    } else if (address.type == BILLING_ADDRESS_TYPE_COMPANY) {
        return address.contact_first_name &&
            address.contact_last_name &&
            address.company_name &&
            address.vat_id &&

            address.address &&
            address.country &&
            address.locality &&
            address.postal_code;
    }
}