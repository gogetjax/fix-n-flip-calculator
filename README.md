# Fix-n-Flip Calculator

A web application that helps real estate investors analyze potential fix-n-flip deals by calculating costs, profits, and ROI.

## Features

- Calculate purchase costs including agent commissions and closing costs
- Estimate repair costs
- Calculate holding costs (property taxes, insurance, utilities)
- Include financing costs (loan interest, points, fees)
- Calculate sale costs including agent commissions
- Determine total project cost, profit, and ROI
- Visual representation of cost breakdown

## Installation

1. Clone the repository:
```
git clone <repository-url>
cd fix-n-flip-calculator
```

2. Create a virtual environment and activate it:
```
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```
pip install -r requirements.txt
```

## Usage

1. Start the application:
```
python app.py
```

2. Open your web browser and navigate to:
```
http://127.0.0.1:5000/
```

3. Enter your property details and click "Calculate" to see the analysis.

## Calculator Inputs

- **Property Information**
  - Purchase Price
  - After Repair Value (ARV)
  - Repair Costs
  - Holding Time (months)

- **Purchase Costs**
  - Closing Costs
  - Agent Commission Rate

- **Holding Costs**
  - Property Taxes (yearly)
  - Insurance (yearly)
  - Utilities (monthly)

- **Financing** (optional)
  - Loan to Value Ratio
  - Interest Rate
  - Loan Points
  - Loan Fees

- **Sale Costs**
  - Closing Costs
  - Agent Commission Rate

## License

MIT
