import {customer_array,item_array,order_array,cart_array} from  "../db/database.js";
import OrderModel from "../models/orderModel.js";
import CartModel from "../models/CartModel.js";
import ItemModel from "../models/ItemModel.js";



let inputDate = $("#inputDate");



// set date
const date = new Date();
const formattedDate = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
inputDate.val(formattedDate);

let setOrderID = () => {
    let OrderID = $("#inputOrderId");
    if (order_array.length === 0) {
        OrderID.val("OR001"); // Start from C001
    } else {
        let lastId = order_array[order_array.length - 1].orderId.slice(1); // Remove "C"
        OrderID.val("OR" + (parseInt(lastId) + 1).toString().padStart(3, "0"));
    }
};
setOrderID();


const loadCustomerIDs = () => {
    let dropdown = $("#inputCustomerId");

    // Clear existing options
    dropdown.empty();
    dropdown.append(`<option selected disabled value="">Choose Customer</option>`);

    // Add customer IDs to the dropdown
    customer_array.forEach((customer) => {
        dropdown.append(`<option value="${customer.customer_id}">${customer.customer_id}</option>`);
    });
};

// Bind the function to load customer IDs when the dropdown is clicked
$("#inputCustomerId").on("focus", function () {
    // Load customer IDs when the dropdown is focused (click or tabbed to)
    loadCustomerIDs();
});

// Event handler for when a customer ID is selected
$("#inputCustomerId").on("change", function () {
    const selectedCustomerId = $(this).val(); // Get the selected customer ID

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
    dropdown.append(`<option selected disabled value="">Choose Item</option>`);

    // Add items to the dropdown
    item_array.forEach((item) => {
        dropdown.append(`<option value="${item.item_id}">${item.item_id}</option>`);
    });

    console.log("Loaded Item IDs:", item_array.map(item => item.item_id)); // Debugging log
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



// Clear the form inputs
const cleanCartForm = () => {
    $("#inputCustomerId").val("");
    $('#inputCustomerName').val("");
    $("#itemSelect").val("");
    $('#inputItemName').val("");
    $('#inputPrice').val("");
    $('#inputOnHandQty').val("");
    $('#quantity').val("");
};





