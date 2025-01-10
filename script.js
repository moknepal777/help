document.getElementById("addMemberLoan").addEventListener("click", function () {
    const memberName = document.getElementById("memberName").value.trim();
    const loanAmount = parseFloat(document.getElementById("loanAmount").value);
    const interestRate = parseFloat(document.getElementById("interestRate").value);
    const loanTerm = parseInt(document.getElementById("loanTerm").value);

    if (!memberName || isNaN(loanAmount) || isNaN(interestRate) || isNaN(loanTerm) || loanAmount <= 0 || loanTerm <= 0) {
        alert("कृपया सबै विवरणहरू सही ढङ्गले भर्नुहोस्।");
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

    memberLoans.push(loanData); // Add to the array
    renderTable(); // Refresh the table
    clearInputs(); // Clear input fields
});
function renderTable() {
    const tableBody = document.querySelector("#memberLoanTable tbody");
    tableBody.innerHTML = ""; // Clear previous data

    memberLoans.forEach((loan, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${loan.memberName}</td>
            <td>रु ${loan.loanAmount.toFixed(2)}</td>
            <td>${loan.interestRate.toFixed(2)}%</td>
            <td>${loan.loanTerm} वर्ष</td>
            <td>रु ${loan.monthlyPayment}</td>
            <td class="actions">
                <button onclick="editMember(${index})">सम्पादन गर्नुहोस्</button>
                <button class="delete" onclick="deleteMember(${index})">मेटाउनुहोस्</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}
document.getElementById("importExcel").addEventListener("click", function () {
    document.getElementById("excelFile").click();
});

document.getElementById("excelFile").addEventListener("change", function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        sheet.forEach((row) => {
            const loanAmount = parseFloat(row["Loan Amount"]);
            const interestRate = parseFloat(row["Interest Rate"]);
            const loanTerm = parseInt(row["Loan Term"]);
            const monthlyPayment = calculateMonthlyPayment(loanAmount, interestRate, loanTerm);

            memberLoans.push({
                memberName: row["Member Name"],
                loanAmount,
                interestRate,
                loanTerm,
                monthlyPayment: monthlyPayment.toFixed(2),
            });
        });

        renderTable(); // Refresh the table with imported data
    };

    reader.readAsArrayBuffer(file);
});
