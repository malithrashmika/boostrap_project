export default class ItemModel {
    constructor(item_id,name,price,quantity,type) {
        this._item_id = item_id;
        this._name = name;
        this._price = price;
        this._quantity = quantity;
        this._type = type;
    }


    get item_id() {
        return this._item_id;
    }

    set item_id(value) {
        this._item_id = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get price() {
        return this._price;
    }

    set price(value) {
        this._price = value;
    }

    get quantity() {
        return this._quantity;
    }

    set quantity(value) {
        this._quantity = value;
    }
    get type() {
        return this._type;
    }
    set type(value) {
        this._type = value;
    }
}