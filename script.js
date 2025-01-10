// script.js

let memberLoans = []; // Array to store member loan data
let editIndex = -1; // To track editing row

// Function to calculate monthly payment
function calculateMonthlyPayment(loanAmount, interestRate, loanTerm) {
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    if (monthlyInterestRate === 0) {
        return loanAmount / numberOfPayments; // No interest scenario
    }

    return (
        (loanAmount *
            monthlyInterestRate *
            Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
    );
}

// Add or Edit Member Loan
document.getElementById("addMemberLoan").addEventListener("click", function () {
    const memberName = document.getElementById("memberName").value.trim();
    const loanAmount = parseFloat(document.getElementById("loanAmount").value);
    const interestRate = parseFloat(document.getElementById("interestRate").value);
    const loanTerm = parseInt(document.getElementById("loanTerm").value);

    if (!memberName || isNaN(loanAmount) || isNaN(interestRate) || isNaN(loanTerm)) {
        alert("Please fill in all fields with valid values.");
        return;
    }

    const monthlyPayment = calculateMonthlyPayment(loanAmount, interestRate, loanTerm);

    const loanData = {
        memberName,
        loanAmount,
        interestRate,
        loanTerm,
        monthlyPayment: monthlyPayment.toFixed(2),
    };

    if (editIndex === -1) {
        // Add new member loan
        memberLoans.push(loanData);
    } else {
        // Edit existing member loan
        memberLoans[editIndex] = loanData;
        editIndex = -1; // Reset edit mode
    }

    renderTable();
    clearInputs();
});

// Render Table
function renderTable() {
    const tableBody = document.querySelector("#memberLoanTable tbody");
    tableBody.innerHTML = ""; // Clear table

    memberLoans.forEach((loan, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${loan.memberName}</td>
            <td>$${loan.loanAmount.toFixed(2)}</td>
            <td>${loan.interestRate.toFixed(2)}%</td>
            <td>${loan.loanTerm} years</td>
            <td>$${loan.monthlyPayment}</td>
            <td class="actions">
                <button onclick="editMember(${index})">Edit</button>
                <button class="delete" onclick="deleteMember(${index})">Delete</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// Edit Member
function editMember(index) {
    const loan = memberLoans[index];
    document.getElementById("memberName").value = loan.memberName;
    document.getElementById("loanAmount").value = loan.loanAmount;
    document.getElementById("interestRate").value = loan.interestRate;
    document.getElementById("loanTerm").value = loan.loanTerm;

    editIndex = index; // Set edit index
}

// Delete Member
function deleteMember(index) {
    memberLoans.splice(index, 1);
    renderTable();
}

// Clear Inputs
function clearInputs() {
    document.getElementById("memberName").value = "";
    document.getElementById("loanAmount").value = "";
    document.getElementById("interestRate").value = "";
    document.getElementById("loanTerm").value = "";
}

// Export to Excel
document.getElementById("exportToExcel").addEventListener("click", function () {
    let tableData = `
        <table>
            <tr>
                <th>Member Name</th>
                <th>Loan Amount</th>
                <th>Interest Rate (%)</th>
                <th>Loan Term (Years)</th>
                <th>Monthly Payment</th>
            </tr>
    `;

    memberLoans.forEach((loan) => {
        tableData += `
            <tr>
                <td>${loan.memberName}</td>
                <td>${loan.loanAmount.toFixed(2)}</td>
                <td>${loan.interestRate.toFixed(2)}</td>
                <td>${loan.loanTerm}</td>
                <td>${loan.monthlyPayment}</td>
            </tr>
        `;
    });

    tableData += `</table>`;
    const blob = new Blob([tableData], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "MemberLoanData.xls";
    a.click();
});
