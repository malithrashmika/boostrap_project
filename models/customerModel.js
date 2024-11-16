export default class CustomerModel {
    constructor(customer_id, first_name, last_name, mobile, email, address) {
        this._customer_id = customer_id;
        this._first_name = first_name;
        this._last_name = last_name;
        this._mobile = mobile;
        this._email = email;
        this._address = address;
    }

    get customer_id() {
        return this._customer_id;
    }

    set customer_id(value) {
        this._customer_id = value;
    }

    get first_name() {
        return this._first_name;
    }

    set first_name(value) {
        this._first_name = value;
    }

    get last_name() {
        return this._last_name;
    }

    set last_name(value) {
        this._last_name = value;
    }

    get mobile() {
        return this._mobile;
    }

    set mobile(value) {
        this._mobile = value;
    }

    get email() {
        return this._email;
    }

    set email(value) {
        this._email = value;
    }

    get address() {
        return this._address;
    }

    set address(value) {
        this._address = value;
    }
}
