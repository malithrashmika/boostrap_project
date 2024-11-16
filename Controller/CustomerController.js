// import {CustomerModel} from "./models/customerModel.js";
import CustomerModel from "../models/customerModel.js";
import {customer_array, item_array, order_array} from "../db/database.js";

const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
}

const validateMobile = (mobile) => {
        const sriLankanMobileRegex = /^(?:\+94|0)?7[0-9]{8}$/;
        return sriLankanMobileRegex.test(mobile);
}

let setCustomerID = () => {
        let customerID = $("#CustomerId");
        if (customer_array.length === 0) {
                customerID.val("C001"); // Start from C001
        } else {
                let lastId = customer_array[customer_array.length - 1].customer_id.slice(1); // Remove "C"
                customerID.val("C" + (parseInt(lastId) + 1).toString().padStart(3, "0"));
        }
};
setCustomerID();


const loadCustomerTable = () => {
        $("#customerTableBody").empty();
        customer_array.map((item) => {
                let data = `<tr>
            <td>${item.customer_id}</td>
            <td>${item.first_name}</td>
            <td>${item.last_name}</td>
            <td>${item.mobile}</td>
            <td>${item.email}</td>
            <td>${item.address}</td>
        </tr>`;
                $("#customerTableBody").append(data);
        });
};


const cleanCustomerForm  = () => {
        $('#firstName').val("");
        $('#lastName').val("");
        $('#email').val("");
        $('#mobile').val("");
        $('#address').val("");
}

// selected customer for update or delete
let selected_customer_index = null;

// Add Customer Button
$("#customer_add_btn").on("click", function() {
        let customer_id=$('#CustomerId').val();
        let first_name = $('#firstName').val();
        let last_name = $('#lastName').val();
        let mobile = $('#mobile').val();
        let email = $('#email').val();
        let address = $('#address').val();

        if (first_name.length === 0) {
                Swal.fire({ icon: "error", title: "Invalid Input", text: "Invalid First Name" });
        } else if (last_name.length === 0) {
                Swal.fire({ icon: "error", title: "Invalid Input", text: "Invalid Last Name" });
        } else if (!validateEmail(email)) {
                Swal.fire({ icon: "error", title: "Invalid Input", text: "Invalid Email" });
        } else if (!validateMobile(mobile)) {
                Swal.fire({ icon: "error", title: "Invalid Input", text: "Invalid Mobile" });
        } else if (address.length === 0) {
                Swal.fire({ icon: "error", title: "Invalid Input", text: "Invalid Address" });
        } else {
                let customer = new CustomerModel(
                    customer_id, // Make sure this matches `customer_id` used in the table
                    first_name,
                    last_name,
                    mobile,
                    email,
                    address
                );

                customer_array.push(customer);
                setCustomerID();
                cleanCustomerForm();
                loadCustomerTable();
        }
});

$('#customerTableBody').on('click', 'tr', function () {
        let index = $(this).index();
        selected_customer_index = index;

        let customer_obj = customer_array[index];

        $('#firstName').val(customer_obj.first_name);
        $('#lastName').val(customer_obj.last_name);
        $('#email').val(customer_obj.email);
        $('#mobile').val(customer_obj.mobile);
        $('#address').val(customer_obj.address);
});

$('#customer_update_btn').on('click', function () {
        let index = selected_customer_index;
        let first_name = $('#firstName').val();
        let last_name = $('#lastName').val();
        let mobile = $('#mobile').val();
        let email = $('#email').val();
        let address = $('#address').val();

        let customer = new CustomerModel(
            customer_array[index].id,
            first_name,
            last_name,
            mobile,
            email,
            address
        );

        customer_array[index] = customer;
        setCustomerID();
        cleanCustomerForm();
        loadCustomerTable();
});

$("#customer_delete_btn").on('click', function () {
        const swalWithBootstrapButtons = Swal.mixin({
                customClass: { confirmButton: "btn btn-success", cancelButton: "btn btn-danger" },
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
                        customer_array.splice(selected_customer_index, 1);
                        cleanCustomerForm();
                        loadCustomerTable();

                        swalWithBootstrapButtons.fire("Deleted!", "Your customer has been deleted.", "success");
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                        swalWithBootstrapButtons.fire("Cancelled", "Your customer is safe :)", "error");
                }
        });
});
