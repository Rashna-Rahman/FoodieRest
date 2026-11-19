
/* FoodieRest - storage.js */

// Data read
function getData(key) {
    let data = localStorage.getItem(key);

    if (data == null) {
        return [];
    }

    return JSON.parse(data);
}

// Data save
function saveData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// Get next ID
function getNextId(list, idName) {
    let maxId = 0;

    for (let i = 0; i < list.length; i++) {
        if (list[i][idName] > maxId) {
            maxId = list[i][idName];
        }
    }

    return maxId + 1;
}

// Get today's date
function getTodayDate() {
    let months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    let date = new Date();

    return date.getDate() + " " +
        months[date.getMonth()] + " " +
        date.getFullYear();
}

// Get current user
function getCurrentUser() {
    let data = localStorage.getItem("currentUser");

    if (data == null) {
        return null;
    }

    return JSON.parse(data);
}

// Check Admin Login
function checkLogin(role) {
    let user = getCurrentUser();

    if (user == null || user.role != role) {
        alert("Please login as admin first.");
        window.location.href = "admin-login.html";
        return;
    }
}

// Admin Logout
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "admin-login.html";
}

// Show Admin Name
function showUserName() {
    let user = getCurrentUser();

    if (user == null) {
        return;
    }

    let nameBox = document.getElementById("userName");
    let letterBox = document.getElementById("avatarLetter");

    if (nameBox != null) {
        nameBox.innerHTML = "Hello, " + user.fullName;
    }

    if (letterBox != null) {
        letterBox.innerHTML =
            user.fullName.slice(0, 1).toUpperCase();
    }
}

// Show Order Status
function getBadge(status) {
    return '<span class="badge badge-' +
        status.toLowerCase() + '">' + status + '</span>';
}

// Show Order Items
function getItemsText(items) {
    let text = "";

    for (let i = 0; i < items.length; i++) {
        text += items[i].foodName + " x" + items[i].qty;

        if (i < items.length - 1) {
            text += "<br>";
        }
    }

    return text;
}

// Change Order Status
function changeOrderStatus(orderId, newStatus) {
    let orders = getData("orders");

    for (let i = 0; i < orders.length; i++) {
        if (orders[i].orderId == orderId) {
            orders[i].status = newStatus;
        }
    }

    saveData("orders", orders);
}

// Show Form Message
function showMessage(boxId, message, isError) {
    let box = document.getElementById(boxId);

    if (box == null) {
        return;
    }

    box.innerHTML = message;
    box.style.display = "block";

    if (isError) {
        box.style.backgroundColor = "#FEE2E2";
        box.style.color = "#B91C1C";
    } else {
        box.style.backgroundColor = "#DCFCE7";
        box.style.color = "#15803D";
    }
}

// Default Data
function setupDefaultData() {

    // Food Menu
    if (getData("menuItems").length == 0) {

        let menuItems = [
            {
                foodId: 1,
                foodName: "Chicken Burger",
                category: "Burger",
                price: 250,
                image: "burger.svg",
                description: "Crispy chicken burger",
                available: true
            },
            {
                foodId: 2,
                foodName: "Beef Cheese Burger",
                category: "Burger",
                price: 320,
                image: "burger.svg",
                description: "Beef burger with cheese",
                available: true
            },
            {
                foodId: 3,
                foodName: "BBQ Chicken Pizza",
                category: "Pizza",
                price: 650,
                image: "pizza.svg",
                description: "BBQ chicken pizza",
                available: true
            },
            {
                foodId: 4,
                foodName: "Margherita Pizza",
                category: "Pizza",
                price: 550,
                image: "pizza.svg",
                description: "Tomato and cheese pizza",
                available: true
            },
            {
                foodId: 5,
                foodName: "Chicken Biryani",
                category: "Rice",
                price: 280,
                image: "biryani.svg",
                description: "Chicken biryani",
                available: true
            },
            {
                foodId: 6,
                foodName: "Beef Tehari",
                category: "Rice",
                price: 260,
                image: "biryani.svg",
                description: "Beef tehari",
                available: false
            },
            {
                foodId: 7,
                foodName: "Fried Chicken",
                category: "Chicken",
                price: 220,
                image: "chicken.svg",
                description: "Crispy fried chicken",
                available: true
            },
            {
                foodId: 8,
                foodName: "Chicken Wings",
                category: "Chicken",
                price: 240,
                image: "chicken.svg",
                description: "Chicken wings",
                available: true
            },
            {
                foodId: 9,
                foodName: "French Fries",
                category: "Snacks",
                price: 120,
                image: "fries.svg",
                description: "French fries",
                available: true
            },
            {
                foodId: 10,
                foodName: "Cold Coffee",
                category: "Drinks",
                price: 180,
                image: "coffee.svg",
                description: "Cold coffee",
                available: true
            },
            {
                foodId: 11,
                foodName: "Lemon Mint",
                category: "Drinks",
                price: 100,
                image: "lemonade.svg",
                description: "Lemon mint juice",
                available: true
            },
            {
                foodId: 12,
                foodName: "Chocolate Cake",
                category: "Desserts",
                price: 200,
                image: "cake.svg",
                description: "Chocolate cake",
                available: true
            }
        ];

        saveData("menuItems", menuItems);
    }

    // Admin and Customer Data
    if (getData("users").length == 0) {

        let users = [
            {
                userId: 1,
                fullName: "Admin",
                email: "admin@foodierest.com",
                phone: "01700000000",
                password: "admin123",
                gender: "Male",
                address: "",
                role: "admin"
            },
            {
                userId: 2,
                fullName: "Rahim Ahmed",
                email: "rahim@gmail.com",
                phone: "01712345678",
                password: "123456",
                gender: "Male",
                address: "Dhaka",
                role: "customer"
            },
            {
                userId: 3,
                fullName: "Ayesha Khan",
                email: "ayesha@gmail.com",
                phone: "01823456789",
                password: "123456",
                gender: "Female",
                address: "Uttara, Dhaka",
                role: "customer"
            },
            {
                userId: 4,
                fullName: "Sami Hasan",
                email: "sami@gmail.com",
                phone: "01934567890",
                password: "123456",
                gender: "Male",
                address: "Kuril, Dhaka",
                role: "customer"
            }
        ];

        saveData("users", users);
    }

    // Demo Orders
    if (localStorage.getItem("orders") == null) {

        let today = getTodayDate();

        let orders = [
            {
                orderId: 1001,
                customerId: 2,
                customerName: "Rahim Ahmed",
                orderDate: today,
                orderTime: "12:20 PM",
                items: [
                    {
                        foodId: 1,
                        foodName: "Chicken Burger",
                        price: 250,
                        qty: 2
                    }
                ],
                totalPrice: 500,
                status: "Pending",
                note: ""
            },
            {
                orderId: 1002,
                customerId: 3,
                customerName: "Ayesha Khan",
                orderDate: today,
                orderTime: "12:50 PM",
                items: [
                    {
                        foodId: 3,
                        foodName: "BBQ Chicken Pizza",
                        price: 650,
                        qty: 1
                    }
                ],
                totalPrice: 650,
                status: "Ready",
                note: ""
            }
        ];

        saveData("orders", orders);
    }
}

// Run default data
setupDefaultData();
