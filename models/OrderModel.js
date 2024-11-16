export default class OrderModel {
    constructor(orderId,customerId,date,total,items) {
        this._orderId = orderId;
        this._customerId = customerId;
        this._date = date;
        this._total = total;
        this._items = items;
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

    get total() {
        return this._total;
    }

    set total(value) {
        this._total = value;
    }

    get items() {
        return this._items;
    }

    set items(value) {
        this._items = value;
    }
}