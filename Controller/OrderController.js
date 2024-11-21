import {customer_array,item_array,order_array,cart_array} from  "../db/database.js";
import OrderModel from "../models/orderModel.js";
import CartModel from "../models/CartModel.js";
import ItemModel from "../models/ItemModel.js";

// Get the current date
const date = new Date();

// Format the date as YYYY-MM-DD
const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
let setDate=()=>{
    let inputDate  = $("#date");
    if (inputDate.length > 0) {
        // Set the formatted date to the input field
        inputDate.val(formattedDate);
    } else {
        console.error("Date input element not found. Ensure the element exists with ID 'date'.");
    }
};
$(document).ready(function () {
    setDate();
});


let setOrderID = () => {
    let OrderID = $("#inputOrderId");
    console.log("Order Array:", order_array);

    if (order_array.length === 0) {
        OrderID.val("OR001"); // Start from OR001
    } else {
        const lastOrder = order_array[order_array.length - 1];
        console.log("Last Order:", lastOrder);

        if (!lastOrder || !lastOrder.orderId) {
            console.error("Invalid order object or missing orderId property.");
            OrderID.val("OR001"); // Fallback
            return;
        }

        let lastId = lastOrder.orderId.slice(2); // Remove "OR"
        OrderID.val("OR" + (parseInt(lastId) + 1).toString().padStart(3, "0"));
    }
};

setOrderID();


const loadCustomerIDs = () => {
    console.log("Loading customer IDs...");
    let dropdown = $("#inputCustomerId");

    // Clear existing options
    dropdown.empty();
    dropdown.append(`<option selected disabled value="">Choose Customer</option>`);

    // Add customer IDs to the dropdown
    customer_array.forEach((customer) => {
        console.log("Adding customer:", customer.customer_id); // Debug log
        dropdown.append(`<option value="${customer.customer_id}">${customer.customer_id}</option>`);
    });
};

let customerDropdownLoaded = false; // Track if dropdown has been loaded

$("#inputCustomerId").on("focus", function () {
    if (!customerDropdownLoaded) {
        loadCustomerIDs();
        customerDropdownLoaded = true; // Set flag to true
    }
});


// Event handler for when a customer ID is selected
$("#inputCustomerId").on("change", function () {
    const selectedCustomerId = $(this).val(); // Get the selected customer ID
    console.log("Customer ID changed to:", selectedCustomerId);
    // Find the selected customer from the customer_array
    const selectedCustomer = customer_array.find(item => item.customer_id === selectedCustomerId);

    if (selectedCustomer) {
        // Populate fields with the selected customer's data
        $('#inputCustomerName').val(`${selectedCustomer.first_name} ${selectedCustomer.last_name}`);
    } else {
        // Clear the fields if no valid customer is selected
        $('#inputCustomerName').val('');
    }

    // Log the selected customer ID for debugging
    console.log("Selected Customer ID:", selectedCustomerId);
});


const loadItemIDs = () => {
    const dropdown = $("#itemSelect");

    // Clear existing options
    dropdown.empty();
    dropdown.append('<option selected disabled value="">Choose Item</option>');

    // Populate the dropdown with items
    item_array.forEach(item => {
        if (item.quantity > 0) {
            dropdown.append(`<option value="${item.item_id}">${item.item_id}</option>`);
        }
    });

    console.log("Item dropdown reloaded with available items.");
};

$(document).ready(function () {
    // Load items on page load
    loadItemIDs();

    // Reload items when dropdown is focused
    $("#itemSelect").on("focus", function () {
        loadItemIDs();
    });
});


$("#itemSelect").on("change", function () {
    const selectedItemId = $(this).val(); // Get the selected item ID

    // Find the selected item in the item_array
    const selectedItem = item_array.find(item => item.item_id === selectedItemId);

    if (selectedItem) {
        // Populate fields with the selected item's data
        $('#inputItemName').val(selectedItem.name);
        $('#inputPrice').val(selectedItem.price);
        $('#inputOnHandQty').val(selectedItem.quantity);
    } else {
        // Handle cases where the selected item is no longer valid
        $('#inputItemName').val('');
        $('#inputPrice').val('');
        $('#inputOnHandQty').val('');
        alert("Selected item is not available.");
    }

    console.log("Selected Item:", selectedItem);
});


// Event handler for when a customer ID is selected
$("#itemSelect").on("change", function () {
    const selectedItemId = $(this).val(); // Get the selected customer ID

    // Find the selected customer from the customer_array
    const selectedItem = item_array.find(item => item.item_id === selectedItemId);

    if (selectedItem) {
        // Populate fields with the selected customer's data
        $('#inputItemName').val(`${selectedItem.name}`);
        $('#inputPrice').val(`${selectedItem.price}`);
        $('#inputOnHandQty').val(`${selectedItem.quantity}`);
    } else {
        // Clear the fields if no valid customer is selected
        $('#inputItemName').val('');
        $('#inputPrice').val('');
        $('#inputOnHandQty').val('');
    }

    // Log the selected customer ID for debugging
    console.log("Selected Customer ID:", selectedItemId);
});

// Function to reload the item table
const loadItemTable = () => {
    const itemTableBody = $("#itemTableBody");
    itemTableBody.empty();

    // Loop through the item array and create table rows
    item_array.forEach(item => {
        const row = `<tr><td>${item.item_id}</td><td>${item.name}</td><td>${item.price}</td><td>${item.quantity}</td><td>${item.type}</td></tr>`;
        itemTableBody.append(row);
    });

    console.log("Item table reloaded.");
};

// Event handler to add an item to the cart and update quantities
$("#addtoCart").on("click", function (event) {
    event.preventDefault();

    // Get form values
    const customerId = $('#inputCustomerId').val().trim();
    const itemId = $('#itemSelect').val().trim();
    const price = parseFloat($('#inputPrice').val().trim());
    const quantity = parseInt($('#quantity').val().trim(), 10);

    // Validate inputs
    if (!itemId || isNaN(price) || isNaN(quantity) || quantity <= 0) {
        alert("Please provide valid item details.");
        return;
    }

    const total = price * quantity;

    // Check if the item exists in the item array and has sufficient quantity
    const item = item_array.find(item => item.item_id === itemId);
    if (!item) {
        alert("Item not found.");
        return;
    }
    if (item.quantity < quantity) {
        alert("Insufficient quantity available.");
        return;
    }

    // Add item to the cart
    const cart = new CartModel(customerId, itemId, price, quantity, total);
    cart_array.push(cart);
    console.log("Cart array:", cart_array);

    // Update the quantity in the item array
    updateQtyOnHand(itemId, quantity);

    // Clear the form after adding to the cart
    cleanCartForm();

    // Reload the cart table to display the added item
    loadCartTable();

    // Reload the item dropdown to reflect updated quantities
    loadItemIDs();
});

// Function to update the quantity of an item in the item array
const updateQtyOnHand = (itemId, quantityPurchased) => {
    const itemIndex = item_array.findIndex(item => item.item_id === itemId);

    if (itemIndex !== -1) {
        // Reduce the quantity of the item
        item_array[itemIndex].quantity -= quantityPurchased;

        // Prevent negative quantities
        if (item_array[itemIndex].quantity < 0) {
            item_array[itemIndex].quantity = 0;
        }

        // Update the item table to reflect changes
        loadItemTable();
    } else {
        console.error(`Item with ID ${itemId} not found.`);
    }
};

// Function to reload the cart table
const loadCartTable = () => {
    $("#CartTableBody").empty();
    cart_array.forEach(cart => {
        const row = `<tr>
            <td>${cart.customer_id}</td>
            <td>${cart.item_id}</td>
            <td>${cart.price}</td>
            <td>${cart.quantity}</td>
            <td>${cart.total}</td>
            <td>
                <button class="btn btn-danger btn-sm delete-btn">Delete</button>
            </td>
        </tr>`;
        $("#CartTableBody").append(row);
    });
};

// Event handler to remove an item from the cart and update quantities
$("#CartTableBody").on("click", ".delete-btn", function () {
    const row = $(this).closest("tr");
    const itemId = row.find("td:nth-child(2)").text(); // Assuming item ID is in the second column
    const quantity = parseInt(row.find("td:nth-child(4)").text(), 10); // Assuming quantity is in the fourth column

    // Update the quantity in the item array
    const itemIndex = item_array.findIndex(item => item.item_id === itemId);
    if (itemIndex !== -1) {
        item_array[itemIndex].quantity += quantity;
        loadItemTable(); // Refresh the item table
    }

    // Remove the item from the cart array
    const cartIndex = cart_array.findIndex(cart => cart.item_id === itemId);
    if (cartIndex !== -1) {
        cart_array.splice(cartIndex, 1);
    }

    // Remove the row from the cart table
    row.remove();

    // Reload the item dropdown to reflect updated quantities
    loadItemIDs();
});

$("#placeOrder").on("click", function () {
    // Validate the cart
    if (cart_array.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'The cart is empty. Add items before placing an order.',
        });
        return;
    }

    const dropdown = $("#inputCustomerId");
    console.log("Dropdown Element:", dropdown); // Log the element
    console.log("Dropdown Value:", dropdown.val()); // Log the value directly

    const customerId = dropdown.val();
    if (!customerId) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Please select a customer.',
        });
        return;
    }
    console.log("Selected Customer ID at Place Order:", customerId);

    // Generate order details
    const orderId = $("#inputOrderId").val();
    const orderDate = $("#inputDate").val();
    const totalAmount = cart_array.reduce((sum, cart) => sum + cart.total, 0);

    // Find the customer by ID
    const customer = customer_array.find(cust => cust.customer_id === customerId);
    const customerName = customer ? `${customer.first_name} ${customer.last_name}` : "Unknown";

    const order = new OrderModel(orderId, customerId, formattedDate, totalAmount, [...cart_array]);

    if (!order.orderId || !order.customerId || !Array.isArray(order.cartItems)) {
        console.error("Malformed order object:", order);
        return;
    }

    order_array.push(order);
    console.log(order);


    // Add the order to the order details table
    $("#orderHistoryBody").append(`
        <tr>
            <td>${formattedDate}</td>
            <td>${customerName}</td>
            <td>${totalAmount.toFixed(2)}</td>
            <td>
                <button class="btn btn-info btn-sm view-details-btn" data-order-id="${orderId}" data-bs-toggle="modal" data-bs-target="#orderDetailsModal">View Details</button>
            </td>
        </tr>
    `);

    // Clear the cart and reset the form
    cart_array.length = 0; // Empty the cart array
    $("#CartTableBody").empty(); // Clear the cart table UI
    cleanCartForm(); // Clear form inputs
    setOrderID(); // Generate the next order ID

    // Show success alert
    Swal.fire({
        icon: 'success',
        title: 'Order Placed',
        text: `Order ${orderId} placed successfully! Total: $${totalAmount.toFixed(2)}`,
    });

    console.log("Order placed:", order);
});

// Event handler for viewing order details
$("#orderHistoryBody").on("click", ".view-details-btn", function () {
    const orderId = $(this).data("order-id"); // Get the order ID from the button

    // Find the order by ID
    const order = order_array.find(ord => ord.order_id === orderId);

    if (order) {
        // Populate the modal with order items
        const orderItemsList = $("#orderItemsList");
        orderItemsList.empty(); // Clear any existing items

        order.cart.forEach(cartItem => {
            orderItemsList.append(`
                <li class="list-group-item">
                    <strong>Item ID:</strong> ${cartItem.item_id} 
                    <strong>Name:</strong> ${cartItem.name} 
                    <strong>Quantity:</strong> ${cartItem.quantity} 
                    <strong>Total:</strong> $${cartItem.total.toFixed(2)}
                </li>
            `);
        });

        // Show the modal
        $("#orderDetailsModal").modal("show");
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Order not found.',
        });
    }
});


// Clear the form inputs
const cleanCartForm = () => {
    console.log("Skipping customer ID clearing for debugging.");
    // $("#inputCustomerId").val(""); // Temporarily comment this line out
    $('#inputCustomerName').val("");
    $("#itemSelect").val("");
    $('#inputItemName').val("");
    $('#inputPrice').val("");
    $('#inputOnHandQty').val("");
    $('#quantity').val("");
};






