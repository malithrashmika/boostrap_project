export default class CartModel {
    constructor(customer_id, item_id,price,quantity,total) {
        this._customer_id = customer_id;
        this._item_id = item_id;
        this._price = price;
        this._quantity = quantity;
        this._total = total;
    }

    get customer_id() {
        return this._customer_id;
    }

    set customer_id(value) {
        this._customer_id = value;
    }

    get item_id() {
        return this._item_id;
    }

    set item_id(value) {
        this._item_id = value;
    }

    get quantity() {
        return this._quantity;
    }

    set quantity(value) {
        this._quantity = value;
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