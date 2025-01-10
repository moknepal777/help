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
