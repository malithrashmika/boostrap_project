import ItemModel from "../models/ItemModel.js";
import { customer_array, item_array } from "../db/database.js";

// Validate price using regex
const validatePrice = (price) => {
    const priceRegex = /^\d{1,3}(,\d{3})*(\.\d{2})?$/;
    return priceRegex.test(price);
};

// Show alert using SweetAlert2
const showAlert = (type, title, text) => {
    Swal.fire({
        icon: type,
        title: title,
        text: text,
    });
};

let setItemID = () => {
    let ItemID = $("#itemId");
    if (item_array.length === 0) {
        ItemID.val("I001"); // Start from C001
    } else {
        let lastId = item_array[item_array.length - 1].item_id.slice(1); // Remove "C"
        ItemID.val("I" + (parseInt(lastId) + 1).toString().padStart(3, "0"));
    }
};
setItemID();

// Load items into the table
const loadItemTable = () => {
    $("#itemTableBody").empty();
    item_array.map((item) => {
        let data = `<tr><td>${item.item_id}</td><td>${item.name}</td><td>${item.price}</td><td>${item.quantity}</td><td>${item.type}</td></tr>`;
        $("#itemTableBody").append(data);
    });
};

// Clear item form inputs
const cleanItemForm = () => {
    $('#itemName').val("");
    $('#itemPrice').val("");
    $('#itemQuantity').val("");
    $("#itemTypeBtn").text("Select Item Type");  // Reset the button text
    selectedItemType = null;  // Reset selected item type
};

// Variable to hold the selected item type
let selectedItemType = null;

// Handle dropdown item selection
$(".item-type-option").on("click", function (event) {
    event.preventDefault();
    selectedItemType = $(this).text();  // Capture selected item type
    $("#itemTypeBtn").text(selectedItemType);  // Display selected item type on the button
});

// Track the selected item index for update or delete
let selected_item_index = null;

// Add Item Button
$("#item_add_btn").on("click", function (event) {
    event.preventDefault();
    let itemID=$('#itemId').val().trim();
    let itemName = $('#itemName').val().trim();
    let itemPrice = $('#itemPrice').val().trim();
    let itemQuantity = $('#itemQuantity').val().trim();
    if (!itemName) {
        showAlert("error", "Invalid Input", "Invalid Item Name");
    } else if (!validatePrice(itemPrice)) {
        showAlert("error", "Invalid Input", "Invalid Price");
    } else if (!itemQuantity || isNaN(itemQuantity) || parseInt(itemQuantity) <= 0) {
        showAlert("error", "Invalid Input", "Invalid Item Quantity");
    } else if (!selectedItemType) {
        showAlert("error", "Invalid Input", "Please select an item type");
    } else {
        let item = new ItemModel(itemID,itemName, itemPrice, itemQuantity, selectedItemType);

        item_array.push(item);
        setItemID();
        cleanItemForm();
        loadItemTable();
    }
});

// Handle row click in the item table for selection
$("#itemTableBody").on("click", "tr", function () {
    selected_item_index = $(this).index();
    let item_obj = item_array[selected_item_index];

    // Populate form with selected item's details
    $('#itemId').val(item_obj.id);
    $('#itemName').val(item_obj.name);
    $('#itemPrice').val(item_obj.price);
    $('#itemQuantity').val(item_obj.quantity);
    selectedItemType = item_obj.type;
    $("#itemTypeBtn").text(selectedItemType);  // Display selected item type on the button
});

// Update Item Button
$("#item_update_btn").on("click", function (event) {
    event.preventDefault();

    if (selected_item_index === null) {
        showAlert("error", "No Selection", "Please select an item to update.");
        return;
    }
    let itemName = $('#itemName').val().trim();
    let itemPrice = $('#itemPrice').val().trim();
    let itemQuantity = $('#itemQuantity').val().trim();

    if (!itemName) {
        showAlert("error", "Invalid Input", "Invalid Item Name");
    } else if (!validatePrice(itemPrice)) {
        showAlert("error", "Invalid Input", "Invalid Price");
    } else if (!itemQuantity || isNaN(itemQuantity) || parseInt(itemQuantity) <= 0) {
        showAlert("error", "Invalid Input", "Invalid Item Quantity");
    } else if (!selectedItemType) {
        showAlert("error", "Invalid Input", "Please select an item type");
    } else {
        let item = new ItemModel(item_array[selected_item_index].id,itemName, itemPrice, itemQuantity, selectedItemType);

        // Update the item in the array
        item_array[selected_item_index] = item;

        cleanItemForm();
        loadItemTable();
    }
});

// Delete Item Button
$("#item_delete_btn").on("click", function () {
    if (selected_item_index === null) {
        showAlert("error", "No Selection", "Please select an item to delete.");
        return;
    }

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger"
        },
        buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            // Remove the item from the array
            item_array.splice(selected_item_index, 1);

            cleanItemForm();
            loadItemTable();

            swalWithBootstrapButtons.fire(
                "Deleted!",
                "Your item has been deleted.",
                "success"
            );

            selected_item_index = null;
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire(
                "Cancelled",
                "Your item is safe :)",
                "error"
            );
        }
    });
});
