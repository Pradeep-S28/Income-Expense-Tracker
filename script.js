// const transaction = [
//   { id: 1, date: "2024-04-22", name: "Salary", trans_type: "Income", amount: 15000 },
//   { id: 2, date: "2024-04-22", name: "Shopping", trans_type: "Expense", amount: 5000 },
//   { id: 3, date: "2024-04-23", name: "Books", trans_type: "Income", amount: 2500 },
// ];
let transactions = [];

const transDateElement = document.getElementById("transDate");
const transNameElement = document.getElementById("transName");
const transTypeElement = document.getElementById("transType");
const transAmountElement = document.getElementById("transAmount");
const tbody = document.getElementById("tbody");
const incomeElement = document.getElementById("income");
const expenseElement = document.getElementById("expense");
const balanceElement = document.getElementById("balance");
const fromDateElement = document.getElementById("fromDate");
const toDateElement = document.getElementById("toDate");

document.addEventListener("DOMContentLoaded", function () {
  transactions = JSON.parse(localStorage.getItem("expense_tracker")) || [];
  ascendingDate(transactions);
  loadTransactions();
});

function loadTransactions() {
  tbody.innerHTML = "";
  incomeElement.textContent = "0.00";
  expenseElement.textContent = "0.00";

  let expense = 0;
  let income = 0;
  transactions.forEach((transaction) => {
    tbody.innerHTML += `
        <tr>
        <td>${transaction.date}</td>
        <td>${transaction.name}</td>
        <td>${transaction.type}</td>
        <td>${transaction.amount}</td>
        <td><button data-id="${transaction.id}" class="btn btn-danger delBtn"><ion-icon name="trash-outline"></ion-icon></button></td>
        </tr>
        `;
    if (transaction.type == "income") {
      income += Number(transaction.amount);
      incomeElement.textContent = income.toFixed(2);
    } else if (transaction.type == "expense") {
      expense += Number(transaction.amount);
      expenseElement.textContent = expense.toFixed(2);
    }
  });
  const delbtns = document.querySelectorAll(".delBtn");
  delbtns.forEach((btn) => btn.addEventListener("click", deleteData));
  balanceElement.textContent = (income - expense).toFixed(2);
}
function addData() {
  fromDateElement.value = "";
  toDateElement.value = "";
  if (!transDateElement.value || !transNameElement.value || !transTypeElement.value || isNaN(transAmountElement.value)) {
    alert("Please Enter the Transaction Details");
    return;
  }
  const obj = { id: Date.now(), date: transDateElement.value, name: transNameElement.value, type: transTypeElement.value, amount: transAmountElement.value };
  transactions.push(obj);
  localStorage.setItem("expense_tracker", JSON.stringify(transactions));
  clearAll();
  ascendingDate(transactions);
  loadTransactions();
}
function ascendingDate(arr) {
  arr.sort((a, b) => {
    if (new Date(a.date) < new Date(b.date)) return -1;
    if (new Date(a.date) > new Date(b.date)) return 1;
    if (new Date(a.date) == new Date(b.date)) return 0;
  });
}
function clearAll() {
  console.log("hi");
  transDateElement.value = "";
  transNameElement.value = "";
  transTypeElement.value = "";
  transAmountElement.value = "";
}
function filterDates() {
  if (fromDateElement.value && toDateElement.value && fromDateElement.value <= toDateElement.value) {
    transactions = JSON.parse(localStorage.getItem("expense_tracker")) || [];
    ascendingDate(transactions);
    let firstFilter = transactions.filter((objj) => {
      return new Date(objj.date) >= new Date(fromDateElement.value) && new Date(objj.date) <= new Date(toDateElement.value);
    });
    //let lastFilter = firstFilter.filter((objj) => new Date(objj.date) <= new Date(toDateElement.value));
    transactions = firstFilter;
    loadTransactions();
    transactions = JSON.parse(localStorage.getItem("expense_tracker")) || [];
  } else {
    alert("Please Enter the Correct start and end dates");
  }
}
function removeFilterDates() {
  fromDateElement.value = "";
  toDateElement.value = "";
  transactions = JSON.parse(localStorage.getItem("expense_tracker")) || [];
  ascendingDate(transactions);
  loadTransactions();
}

function deleteData() {
  if (confirm("Are You Sure To Delete?")) {
    fromDateElement.value = "";
    toDateElement.value = "";
    const id = this.dataset.id;
    let updated_transactions = transactions.filter((transaction) => transaction.id != id);
    transactions = updated_transactions;
    localStorage.setItem("expense_tracker", JSON.stringify(transactions));
    loadTransactions();
    this.parentElement.parentElement.remove();
  }
}

function search() {
  const searchElement = document.getElementById("searchTxt");
  const searchTxt = searchElement.value.toUpperCase();

  let tr = tbody.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    let td = tr[i].getElementsByTagName("td");
    console.log(td.length);
    for (j = 0; j < td.length; j++) {
      let cell = td[j];
      if (cell) {
        let txtValue = cell.textContent.toUpperCase();
        if (txtValue.indexOf(searchTxt) > -1) {
          tr[i].style.display = "";
          cell.classList.add("bg-warning");
          break;
        } else {
          tr[i].style.display = "none";
          cell.classList.remove("bg-warning");
        }
      }
    }
  }
  if (searchTxt == "") {
    const cells = tbody.querySelectorAll("td");
    cells.forEach((cell) => {
      cell.classList.remove("bg-warning");
    });
    //return;
  }
}

//BOOTSTRAP
