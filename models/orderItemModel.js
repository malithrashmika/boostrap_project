export default class OrderItemModel {
    constructor(customer_id, itemId,qty,price,total) {
        this._itemId = itemId;
        this._qty = qty;
        this._price = price;
        this._total = total;
        this._customer_id = customer_id;
    }

    get customer_id() {
        return this._customer_id;
    }

    set customer_id(value) {
        this._customer_id = value;
    }

    get itemId() {
        return this._itemId;
    }

    set itemId(value) {
        this._itemId = value;
    }

    get qty() {
        return this._qty;
    }

    set qty(value) {
        this._qty = value;
    }

    get price() {
        return this._price;
    }

    set price(value) {
        this._price = value;
    }

    get total() {
        return this._total;
    }

    set total(value) {
        this._total = value;
    }
}