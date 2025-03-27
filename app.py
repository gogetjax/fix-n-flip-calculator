from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.get_json()
    
    # Extract input values
    purchase_price = float(data.get('purchase_price', 0))
    after_repair_value = float(data.get('after_repair_value', 0))
    repair_costs = float(data.get('repair_costs', 0))
    holding_time = float(data.get('holding_time', 0))  # in months
    
    # Purchase costs
    purchase_closing_costs = float(data.get('purchase_closing_costs', 0))
    purchase_agent_commission = purchase_price * float(data.get('purchase_agent_commission_rate', 0)) / 100
    
    # Sale costs
    sale_closing_costs = float(data.get('sale_closing_costs', 0))
    sale_agent_commission = after_repair_value * float(data.get('sale_agent_commission_rate', 0)) / 100
    
    # Holding costs
    property_taxes = float(data.get('property_taxes', 0)) * (holding_time / 12)
    insurance = float(data.get('insurance', 0)) * (holding_time / 12)
    utilities = float(data.get('utilities', 0)) * holding_time
    
    # Financing costs
    financing = data.get('financing', False)
    if financing:
        loan_amount = purchase_price * float(data.get('loan_to_value', 0)) / 100
        loan_interest_rate = float(data.get('loan_interest_rate', 0)) / 100
        loan_interest = loan_amount * loan_interest_rate * (holding_time / 12)
        loan_points = loan_amount * float(data.get('loan_points', 0)) / 100
        loan_fees = float(data.get('loan_fees', 0))
    else:
        loan_interest = 0
        loan_points = 0
        loan_fees = 0
    
    # Calculate total costs
    total_purchase_cost = purchase_price + purchase_closing_costs + purchase_agent_commission
    total_holding_cost = property_taxes + insurance + utilities + loan_interest
    total_repair_cost = repair_costs
    total_financing_cost = loan_points + loan_fees
    total_sale_cost = sale_closing_costs + sale_agent_commission
    
    total_project_cost = (total_purchase_cost + total_holding_cost + 
                         total_repair_cost + total_financing_cost + total_sale_cost)
    
    # Calculate profit
    profit = after_repair_value - total_project_cost
    roi = (profit / total_project_cost) * 100 if total_project_cost > 0 else 0
    
    # Prepare results
    results = {
        'total_purchase_cost': round(total_purchase_cost, 2),
        'total_holding_cost': round(total_holding_cost, 2),
        'total_repair_cost': round(total_repair_cost, 2),
        'total_financing_cost': round(total_financing_cost, 2),
        'total_sale_cost': round(total_sale_cost, 2),
        'total_project_cost': round(total_project_cost, 2),
        'profit': round(profit, 2),
        'roi': round(roi, 2),
        'profitable': profit > 0
    }
    
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)
