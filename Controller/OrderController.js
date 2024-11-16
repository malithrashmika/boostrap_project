import {customer_array,item_array,order_array} from  "../db/database.js";
import OrderModel from "../models/orderModel.js";
import OrderItem from "../models/orderItemModel.js";
// import {loadItemTable} from "./ItemController.js"



let orderId = $("#inputOrderId");
let customerId = $("#inputCustomerId");
let customerName = $("#inputCustomerName");
let inputDate = $("#inputDate");
let inventoryIdDropDown = $("#inputInventoryId");
let inventoryModel = $("#inputOrderModel");
let inventoryPrice = $("#inputOrderPrice");
let onHandQty = $("#inputOnHandQty");
let orderQty = $("#inputOrderQty");
let addBtn = $("#addBtn");
let orderDetailTblBody = $("#orderDetailTblBody");
let inputTotal = $("#inputTotal");


// set date
const date = new Date();
const formattedDate = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
inputDate.val(formattedDate);

let setOrderID = () => {
    if (order_array.length === 0){
        orderId.val(1);
    } else {
        console.log(parseInt(order_array[order_array.length - 1].orderId) + 1)
        orderId.val(order_array[order_array.length - 1].orderId + 1);
    }
}
setOrderID();

$("#customerIds").on("click", "li", function() {
    const selectId = $(this);
    customerId.text(selectId.text());
    //customerName.val(customer_array[selectId.text()-1].name); // meka hriynne na
});

$("#itemIds").on("click", "li", function() {
    const selectId = $(this);
    inventoryIdDropDown.text(selectId.text());  // meka hriynne na
    inventoryModel.val(item_array[selectId.text()-1].model);
    inventoryPrice.val(item_array[selectId.text()-1].price);
    onHandQty.val(item_array[selectId.text()-1].qty);
});

export let setDataDropdowns = () => {
    // customer ids tika dropdown ekt set wenw
    $("#customerIds").empty();
    customer_array.forEach((value,index) => {
        console.log("value.customer_id");
        let data = `<li>${value.customer_id}</li>`;
        $("#customerIds").append(data);
    });
    console.log(customer_array);

    // item ids tika dropdown ekt set wenw
    $("#itemIds").empty();
    item_array.map((value,index) => {
        let data = `<li>${value.item_id}</li>`;
        $("#itemIds").append(data);
    });
}

setDataDropdowns();

// add button action
addBtn.on("click", function() {
    if (QTY.test(orderQty.val())){
        let data = `<tr><td>${inventoryIdDropDown.text()}</td><td>${inventoryModel.val()}</td><td>${inventoryPrice.val()}</td><td>${orderQty.val()}</td><td>${parseFloat(inventoryPrice.val()) * parseInt(orderQty.val()).toFixed(2)}</td><td><button class="btn btn-danger btn-sm delete-btn">Delete</button></td></tr>`;
        orderDetailTblBody.append(data);
        setTotal();
        inventoryIdDropDown.text("Inventory ID");
        inventoryModel.val("");
        inventoryPrice.val("");
        onHandQty.val("");
        orderQty.val("");
    } else {
        setAlert('error','Invalid Order Quantity !!');
    }
});

// Event delegation for delete button
orderDetailTblBody.on('click', '.delete-btn', function() {
    let row = $(this).closest('tr');
    setAlert('warning','Do you want to remove this order item?',row);
});

// set total
function setTotal(){
    const lastColumnData = [];
    $('#orderDetailTblBody tr').each(function() {
        //lastColumnData.splice(0, lastColumnData.length);
        const lastCell = $(this).find('td:nth-child(5)');
        lastColumnData.push(lastCell.text());
    });

    let total = 0;
    lastColumnData.map(value => {
        total += parseFloat(value);
    });
    inputTotal.val(total);
}