export default class OrderModel {
    constructor(orderId, customerId, date, totalAmount, cartItems) {
        // Ensure this is initialized
        this._orderId = orderId;
        this._customerId = customerId;
        this._date = date;
        this._totalAmount = totalAmount;
        this._cartItems = cartItems;
    }

    get orderId() {
        return this._orderId;
    }

    set orderId(value) {
        this._orderId = value;
    }

    get customerId() {
        return this._customerId;
    }

    set customerId(value) {
        this._customerId = value;
    }

    get date() {
        return this._date;
    }

    set date(value) {
        this._date = value;
    }

    get totalAmount() {
        return this._totalAmount;
    }

    set totalAmount(value) {
        this._totalAmount = value;
    }

    get cartItems() {
        return this._cartItems;
    }

    set cartItems(value) {
        this._cartItems = value;
    }
}
