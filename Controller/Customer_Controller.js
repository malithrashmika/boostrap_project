const loadCustomerTable = () => {
        $("#customerTableBody").empty();
        customer_array.map((item, index) => {
                console.log(item);
                let data = `<tr><td>${item.first_name}</td><td>${item.last_name}</td><td>${item.mobile}</td><td>${item.email}</td><td>${item.address}</td></tr>`
                $("#customerTableBody").append(data);
        })
}