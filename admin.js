/* =====================================================
   FoodieRest - admin.js
   Dashboard, Manage Menu, Add/Edit Food, All Orders, Customers
   ===================================================== */


/* ---------- 1. Dashboard ---------- */

function loadDashboard() {
    checkLogin("admin");
    showUserName();

    let menuItems = getData("menuItems");
    let orders = getData("orders");
    let today = getTodayDate();

    let todayCount = 0;
    let pendingCount = 0;
    let deliveredToday = 0;

    for (let i = 0; i < orders.length; i++) {
        if (orders[i].orderDate == today) {
            todayCount++;
            if (orders[i].status == "Delivered") {
                deliveredToday++;
            }
        }
        if (orders[i].status == "Pending") {
            pendingCount++;
        }
    }

    document.getElementById("todayText").innerHTML = "Overview of today, " + today;
    document.getElementById("totalMenu").innerHTML = menuItems.length;
    document.getElementById("todayOrders").innerHTML = todayCount;
    document.getElementById("pendingOrders").innerHTML = pendingCount;
    document.getElementById("deliveredToday").innerHTML = deliveredToday;

    // shesher 5 ta order (notun upore)
    let html = "";
    let shown = 0;
    for (let i = orders.length - 1; i >= 0 && shown < 5; i--) {
        html += "<tr>";
        html += "<td>#" + orders[i].orderId + "</td>";
        html += "<td>" + orders[i].customerName + "</td>";
        html += "<td>" + getItemsText(orders[i].items) + "</td>";
        html += "<td>Tk " + orders[i].totalPrice + "</td>";
        html += "<td>" + getBadge(orders[i].status) + "</td>";
        html += "</tr>";
        shown++;
    }
    if (html == "") {
        html = '<tr><td colspan="5" class="empty-text">No orders yet.</td></tr>';
    }
    document.getElementById("recentRows").innerHTML = html;
}


/* ---------- 2. Manage Menu ---------- */

function loadMenuTable() {
    checkLogin("admin");
    showMenuTable();
    document.getElementById("searchFood").addEventListener("keyup", showMenuTable);
    document.getElementById("category").addEventListener("change", showMenuTable);
}

function showMenuTable() {
    let menuItems = getData("menuItems");
    let searchText = document.getElementById("searchFood").value.toLowerCase();
    let category = document.getElementById("category").value;
    let html = "";
    let count = 0;

    for (let i = 0; i < menuItems.length; i++) {
        let food = menuItems[i];
        let nameMatch = food.foodName.toLowerCase().includes(searchText);
        let categoryMatch = (category == "All" || food.category == category);

        if (nameMatch && categoryMatch) {
            count++;
            let availableBadge = '<span class="badge badge-no">No</span>';
            if (food.available) {
                availableBadge = '<span class="badge badge-yes">Yes</span>';
            }
            html += "<tr>";
            html += "<td>" + count + "</td>";
            html += '<td><img src="images/' + food.image + '" alt="' + food.foodName + '" class="thumb"></td>';
            html += "<td>" + food.foodName + "</td>";
            html += "<td>" + food.category + "</td>";
            html += "<td>Tk " + food.price + "</td>";
            html += "<td>" + availableBadge + "</td>";
            html += '<td><div class="action-btns">';
            html += '<button type="button" class="btn btn-blue btn-small" onclick="editFood(' + food.foodId + ')">Edit</button>';
            html += '<button type="button" class="btn btn-red btn-small" onclick="deleteFood(' + food.foodId + ')">Delete</button>';
            html += "</div></td>";
            html += "</tr>";
        }
    }
    if (count == 0) {
        html = '<tr><td colspan="7" class="empty-text">No food found.</td></tr>';
    }
    document.getElementById("menuRows").innerHTML = html;
    document.getElementById("foodCount").innerHTML = "All Food Items (" + count + ")";
}

// Edit button: kon food edit hobe seta mone rekhe edit page e jai
function editFood(foodId) {
    localStorage.setItem("editFoodId", foodId);
    window.location.href = "admin-edit-food.html";
}

function deleteFood(foodId) {
    if (!confirm("Are you sure you want to delete this food item?")) {
        return;
    }
    let menuItems = getData("menuItems");
    let newList = [];
    for (let i = 0; i < menuItems.length; i++) {
        if (menuItems[i].foodId != foodId) {
            newList.push(menuItems[i]);
        }
    }
    saveData("menuItems", newList);
    showMenuTable();
}


/* ---------- 3. Add Food / Edit Food ---------- */

// image dropdown bodlale preview chobi bodlabe
function showImagePreview() {
    let image = document.getElementById("foodImage").value;
    document.getElementById("imagePreview").src = "images/" + image;
}

// dui form er common check
function readFoodForm() {
    let food = {
        foodName: document.getElementById("foodName").value,
        category: document.getElementById("foodCategory").value,
        price: Number(document.getElementById("price").value),
        description: document.getElementById("description").value,
        image: document.getElementById("foodImage").value,
        available: document.getElementById("available").checked
    };

    let errors = [];
    if (food.foodName == "") {
        errors.push("Food name is required.");
    }
    if (food.category == "") {
        errors.push("Please select a category.");
    }
    if (food.price <= 0) {
        errors.push("Price must be more than 0.");
    }
    if (errors.length > 0) {
        showMessage("formMessage", errors.join("<br>"), true);
        return null;
    }
    return food;
}

function loadAddFoodPage() {
    checkLogin("admin");
    showUserName();
    showImagePreview();
}

function saveNewFood() {
    let food = readFoodForm();
    if (food == null) {
        return false;
    }
    let menuItems = getData("menuItems");
    food.foodId = getNextId(menuItems, "foodId");
    menuItems.push(food);
    saveData("menuItems", menuItems);

    alert(food.foodName + " added to the menu.");
    window.location.href = "admin-menu.html";
    return false;
}

function loadEditFoodPage() {
    checkLogin("admin");
    showUserName();

    let foodId = localStorage.getItem("editFoodId");
    let menuItems = getData("menuItems");
    let food = null;
    for (let i = 0; i < menuItems.length; i++) {
        if (menuItems[i].foodId == foodId) {
            food = menuItems[i];
        }
    }
    if (food == null) {
        alert("Food not found.");
        window.location.href = "admin-menu.html";
        return;
    }

    // form e ager data boshano
    document.getElementById("editTitle").innerHTML = "Change the details or price of " + food.foodName;
    document.getElementById("foodName").value = food.foodName;
    document.getElementById("foodCategory").value = food.category;
    document.getElementById("price").value = food.price;
    document.getElementById("description").value = food.description;
    document.getElementById("foodImage").value = food.image;
    document.getElementById("available").checked = food.available;
    showImagePreview();
}

function updateFood() {
    let newData = readFoodForm();
    if (newData == null) {
        return false;
    }
    let foodId = localStorage.getItem("editFoodId");
    let menuItems = getData("menuItems");
    for (let i = 0; i < menuItems.length; i++) {
        if (menuItems[i].foodId == foodId) {
            menuItems[i].foodName = newData.foodName;
            menuItems[i].category = newData.category;
            menuItems[i].price = newData.price;
            menuItems[i].description = newData.description;
            menuItems[i].image = newData.image;
            menuItems[i].available = newData.available;
        }
    }
    saveData("menuItems", menuItems);

    alert("Food item updated.");
    window.location.href = "admin-menu.html";
    return false;
}


/* ---------- 4. All Orders ---------- */

function loadAllOrders() {
    checkLogin("admin");
    showUserName();
    showAllOrders();
    document.getElementById("statusFilter").addEventListener("change", showAllOrders);
}

function showAllOrders() {
    let orders = getData("orders");
    let filter = document.getElementById("statusFilter").value;
    let html = "";
    let count = 0;

    for (let i = orders.length - 1; i >= 0; i--) {
        let o = orders[i];
        if (filter == "All" || o.status == filter) {
            count++;
            let action = '<span class="muted-text">Waiting for kitchen</span>';
            if (o.status == "Ready") {
                action = '<button type="button" class="btn btn-green btn-small" onclick="markDelivered(' + o.orderId + ')">Mark Delivered</button>';
            } else if (o.status == "Delivered") {
                action = '<span class="muted-text">Completed</span>';
            }
            html += "<tr>";
            html += "<td>#" + o.orderId + "</td>";
            html += "<td>" + o.customerName + "</td>";
            html += "<td>" + o.orderDate + "<span class='order-time'>" + o.orderTime + "</span></td>";
            html += "<td>" + getItemsText(o.items) + "</td>";
            html += "<td>Tk " + o.totalPrice + "</td>";
            html += "<td>" + getBadge(o.status) + "</td>";
            html += "<td>" + action + "</td>";
            html += "</tr>";
        }
    }
    if (count == 0) {
        html = '<tr><td colspan="7" class="empty-text">No orders found.</td></tr>';
    }
    document.getElementById("orderRows").innerHTML = html;
    document.getElementById("orderCount").innerHTML = "Orders (" + count + ")";
}

function markDelivered(orderId) {
    changeOrderStatus(orderId, "Delivered");
    showAllOrders();
}


/* ---------- 5. Customers ---------- */

function loadCustomers() {
    checkLogin("admin");
    showUserName();

    let users = getData("users");
    let orders = getData("orders");
    let html = "";
    let count = 0;

    for (let i = 0; i < users.length; i++) {
        if (users[i].role == "customer") {
            count++;
            // ei customer er koyta order
            let orderCount = 0;
            for (let j = 0; j < orders.length; j++) {
                if (orders[j].customerId == users[i].userId) {
                    orderCount++;
                }
            }
            html += "<tr>";
            html += "<td>" + count + "</td>";
            html += "<td>" + users[i].fullName + "</td>";
            html += "<td>" + users[i].email + "</td>";
            html += "<td>" + users[i].phone + "</td>";
            html += "<td>" + users[i].address + "</td>";
            html += "<td>" + orderCount + "</td>";
            html += '<td><div class="action-btns">';
            html += '<button type="button" class="btn btn-blue btn-small" onclick="editCustomer(' + users[i].userId + ')">Edit</button>';
            html += '<button type="button" class="btn btn-red btn-small" onclick="deleteCustomer(' + users[i].userId + ')">Delete</button>';
            html += "</div></td>";
            html += "</tr>";
        }
    }
    if (count == 0) {
        html = '<tr><td colspan="7" class="empty-text">No customers yet.</td></tr>';
    }
    document.getElementById("customerRows").innerHTML = html;
    document.getElementById("customerCaption").innerHTML = "Registered Customers (" + count + ")";
}


/* ---------- 6. Edit / Delete customer ---------- */

// Edit button: kon customer edit hobe seta mone rekhe edit page e jai
function editCustomer(userId) {
    localStorage.setItem("editCustomerId", userId);
    window.location.href = "admin-edit-customer.html";
}

function deleteCustomer(userId) {
    if (!confirm("Are you sure you want to delete this customer account?")) {
        return;
    }
    let users = getData("users");
    let newList = [];
    for (let i = 0; i < users.length; i++) {
        if (users[i].userId != userId) {
            newList.push(users[i]);
        }
    }
    saveData("users", newList);
    localStorage.removeItem("cart_" + userId);   // tar cart o muche dei
    loadCustomers();
}

function loadEditCustomerPage() {
    checkLogin("admin");
    showUserName();

    let userId = localStorage.getItem("editCustomerId");
    let users = getData("users");
    let customer = null;
    for (let i = 0; i < users.length; i++) {
        if (users[i].userId == userId && users[i].role == "customer") {
            customer = users[i];
        }
    }
    if (customer == null) {
        alert("Customer not found.");
        window.location.href = "admin-customers.html";
        return;
    }

    document.getElementById("editTitle").innerHTML = "Change the details of " + customer.fullName;
    document.getElementById("fullName").value = customer.fullName;
    document.getElementById("email").value = customer.email;
    document.getElementById("phone").value = customer.phone;
    document.getElementById("address").value = customer.address;
}

function updateCustomer() {
    let fullName = document.getElementById("fullName").value;
    let phone = document.getElementById("phone").value;
    let address = document.getElementById("address").value;

    let errors = [];
    if (fullName == "") {
        errors.push("Full name is required.");
    }
    if (phone.length != 11 || phone.slice(0, 2) != "01") {
        errors.push("Phone number must be 11 digits and start with 01.");
    }
    if (address == "") {
        errors.push("Address is required.");
    }
    if (errors.length > 0) {
        showMessage("formMessage", errors.join("<br>"), true);
        return false;
    }

    let userId = localStorage.getItem("editCustomerId");
    let users = getData("users");
    for (let i = 0; i < users.length; i++) {
        if (users[i].userId == userId) {
            users[i].fullName = fullName;
            users[i].phone = phone;
            users[i].address = address;
        }
    }
    saveData("users", users);

    alert("Customer updated.");
    window.location.href = "admin-customers.html";
    return false;
}
