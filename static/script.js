document.addEventListener('DOMContentLoaded', function() {
    // Toggle financing details
    const financingCheckbox = document.getElementById('financing');
    const financingDetails = document.getElementById('financing-details');
    
    financingCheckbox.addEventListener('change', function() {
        if (this.checked) {
            financingDetails.classList.remove('d-none');
        } else {
            financingDetails.classList.add('d-none');
        }
    });
    
    // Calculate button click handler
    const calculateBtn = document.getElementById('calculate-btn');
    calculateBtn.addEventListener('click', calculateResults);
    
    // Chart instance
    let costChart = null;
});

function calculateResults() {
    // Gather form data
    const formData = {
        purchase_price: parseFloat(document.getElementById('purchase_price').value) || 0,
        after_repair_value: parseFloat(document.getElementById('after_repair_value').value) || 0,
        repair_costs: parseFloat(document.getElementById('repair_costs').value) || 0,
        holding_time: parseFloat(document.getElementById('holding_time').value) || 0,
        purchase_closing_costs: parseFloat(document.getElementById('purchase_closing_costs').value) || 0,
        purchase_agent_commission_rate: parseFloat(document.getElementById('purchase_agent_commission_rate').value) || 0,
        property_taxes: parseFloat(document.getElementById('property_taxes').value) || 0,
        insurance: parseFloat(document.getElementById('insurance').value) || 0,
        utilities: parseFloat(document.getElementById('utilities').value) || 0,
        sale_closing_costs: parseFloat(document.getElementById('sale_closing_costs').value) || 0,
        sale_agent_commission_rate: parseFloat(document.getElementById('sale_agent_commission_rate').value) || 0,
        financing: document.getElementById('financing').checked
    };
    
    // Add financing details if checked
    if (formData.financing) {
        formData.loan_to_value = parseFloat(document.getElementById('loan_to_value').value) || 0;
        formData.loan_interest_rate = parseFloat(document.getElementById('loan_interest_rate').value) || 0;
        formData.loan_points = parseFloat(document.getElementById('loan_points').value) || 0;
        formData.loan_fees = parseFloat(document.getElementById('loan_fees').value) || 0;
    }
    
    // Send data to server
    fetch('/calculate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        displayResults(data);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while calculating results.');
    });
}

function displayResults(data) {
    // Show results section
    document.getElementById('results-details').style.display = 'block';
    document.querySelector('.alert-info').style.display = 'none';
    
    // Update summary values
    document.getElementById('total_project_cost').textContent = formatCurrency(data.total_project_cost);
    document.getElementById('profit').textContent = formatCurrency(data.profit);
    document.getElementById('roi').textContent = data.roi.toFixed(2);
    
    // Update status badge
    const statusBadge = document.getElementById('status');
    if (data.profitable) {
        statusBadge.textContent = 'Profitable';
        statusBadge.className = 'badge profitable';
    } else {
        statusBadge.textContent = 'Not Profitable';
        statusBadge.className = 'badge not-profitable';
    }
    
    // Update cost breakdown
    document.getElementById('total_purchase_cost').textContent = formatCurrency(data.total_purchase_cost);
    document.getElementById('total_repair_cost').textContent = formatCurrency(data.total_repair_cost);
    document.getElementById('total_holding_cost').textContent = formatCurrency(data.total_holding_cost);
    document.getElementById('total_financing_cost').textContent = formatCurrency(data.total_financing_cost);
    document.getElementById('total_sale_cost').textContent = formatCurrency(data.total_sale_cost);
    
    // Create/update chart
    createCostChart(data);
}

function createCostChart(data) {
    const ctx = document.getElementById('costChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.costChart) {
        window.costChart.destroy();
    }
    
    // Create new chart
    window.costChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Purchase Costs', 'Repair Costs', 'Holding Costs', 'Financing Costs', 'Sale Costs'],
            datasets: [{
                data: [
                    data.total_purchase_cost,
                    data.total_repair_cost,
                    data.total_holding_cost,
                    data.total_financing_cost,
                    data.total_sale_cost
                ],
                backgroundColor: [
                    '#6c8aff',
                    '#34c759',
                    '#5ac8fa',
                    '#ffcc00',
                    '#ff3b30'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}
