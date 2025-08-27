function add_new_users() {
    document.querySelector('.addUserForm').style.display = 'block';
}

//load table rows on UI
window.onload = function () {
    addrow_initable();
    applyRowColors();
}

function addrow_initable() {
    let table_body = document.querySelector('tbody');
    table_body.innerHTML = "";

    fetchUsers(function (data) {
        data.forEach(user => {
            appendRow(user);
        });
    });
}

function applyRowColors() {
    const rows = document.querySelectorAll("tbody tr");
    rows.forEach((row, index) => {
        const color = index % 2 === 0 ? "white" : "rgba(173,216,230,0.2)";
        row.querySelectorAll("td").forEach(td => {
            td.style.backgroundColor = color;
        });
    });
}

function fetchUsers(callback) {
    var http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (this.readyState === 4 && this.status >= 200 && this.status < 300) {
            const data = JSON.parse(this.responseText);
            callback(data);
        }
    };
    http.open("GET", "https://689da4b1ce755fe697895a08.mockapi.io/employees", true);
    http.setRequestHeader("Content-Type", "application/json");
    http.send();
}

//update user
function updateUser(id, updatedData, callback) {
    var http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (this.readyState === 4 && this.status >= 200 && this.status < 300) {
            const updatedUser = JSON.parse(this.responseText);
            if (callback) callback(updatedUser);
            applyRowColors();
        }
    };
    http.open("PUT", "https://689da4b1ce755fe697895a08.mockapi.io/employees/" + id, true);
    http.setRequestHeader("Content-Type", "application/json");
    http.send(JSON.stringify(updatedData));
}

//delete user
function deleteUser(id) {
    var http = new XMLHttpRequest();
    http.open("DELETE", "https://689da4b1ce755fe697895a08.mockapi.io/employees/" + id, true);
    http.setRequestHeader("Content-Type", "application/json");
    http.send();
}

function saveData() {
    let valuess = {
        name: document.getElementById('name').value,
        rating: document.getElementById('rating').value,
        comment: document.getElementById('comment').value
    };

    document.querySelector('.addUserForm').style.display = 'none';

    var http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (this.readyState === 4 && this.status >= 200 && this.status < 300) {
            const user = JSON.parse(this.responseText);
            appendRow(user);
            applyRowColors();
        }
    };
    http.open("POST", "https://689da4b1ce755fe697895a08.mockapi.io/employees", true);
    http.setRequestHeader("Content-Type", "application/json");
    http.send(JSON.stringify(valuess));

    //to clear the inputs
    document.getElementById('name').value = "";
    document.getElementById('rating').value = "";
    document.getElementById('comment').value = "";
}

// append single row
function appendRow(user) {
    let table_body = document.querySelector('tbody');
    let tr_table = document.createElement('tr');

    tr_table.innerHTML = `
        <td>${user.id}</td>
        <td id="editedName" contenteditable="false">${user.name}</td>
        <td id="editedRating" contenteditable="false">${user.rating}</td>
        <td id="editedComment" contenteditable="false">${user.comment}</td>
        <td>
            <button class='editButton'><i class='fa-solid fa-pen' style='color:black'></i></button>
            <button class='deleteButton'><i class='fa-solid fa-trash-can' style='color:black'></i></button>
        </td>`;

    table_body.appendChild(tr_table);
    applyRowColors();

    tr_table.querySelector(".editButton").addEventListener("click", function () {
        makeRowEditable(tr_table, user.id);
    });

    tr_table.querySelector(".deleteButton").addEventListener("click", function () {
        showConfirmBox(tr_table, user.id, user.name);
    });
}

//make row Editable
function makeRowEditable(row, id) {
    let nameCell = row.querySelector("#editedName");
    let ratingCell = row.querySelector("#editedRating");
    let commentCell = row.querySelector("#editedComment");

    nameCell.innerHTML = `<input type="text" value="${nameCell.innerText}"/>`;
    ratingCell.innerHTML = `<input type="text" value="${ratingCell.innerText}"/>`;
    commentCell.innerHTML = `<input type="text" value="${commentCell.innerText}"/>`;

    row.querySelector("input").focus();

    row.addEventListener("keydown", function handler(event) {
        if (event.key === "Enter") {
            event.preventDefault();

            let updatedData = {
                name: nameCell.querySelector("input").value,
                rating: ratingCell.querySelector("input").value,
                comment: commentCell.querySelector("input").value
            };

            updateUser(id, updatedData, function () {
                nameCell.textContent = updatedData.name;
                ratingCell.textContent = updatedData.rating;
                commentCell.textContent = updatedData.comment;
            });

            row.removeEventListener("keydown", handler);
            applyRowColors();
        }
    });
}

//confirm delete
function showConfirmBox(row, id, name) {
    let confirmBox = document.querySelector(".confirm-box");
    confirmBox.style.display = "block";
    document.getElementById('confirm_msg').innerText = `Are you sure you want delete this feedback from ${name}?`;

    document.getElementById("delete").onclick = function () {
        deleteUser(id);
        row.remove();
        confirmBox.style.display = "none";
        applyRowColors();
    };

    document.getElementById("cancel").onclick = function () {
        confirmBox.style.display = "none";
    };
}
