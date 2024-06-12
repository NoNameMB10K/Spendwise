# Spendwise

**Your AI Assistant for Expense Tracking**

## Description

Spendwise is an innovative application designed to help you manage your expenses effortlessly. Upload pictures of receipts, and our AI, powered by OCR technology and enhanced with the GPT language model, will read and categorize the products based on predefined categories. Users can create new categories, scan receipts, categorize them, and if the AI makes a mistake, users can easily rectify it. Additionally, users can view all products and their categories and see a statistics page showing how much they have spent on each category.

This project was created during a training laboratory held by the company Netrom. The classification AI and OCR AI used to read products from receipts are accessed through two APIs provided by Netrom for the lab participants.

## Features

- Upload and scan receipts using OCR technology
- Categorize products automatically with AI assistance
- Define new categories
- Rectify AI categorization mistakes
- View all products and their respective categories
- Statistics page showing spending per category

## Technologies Used

- **Frontend:** React
- **Backend:** PHP, MySQL, REST API
- **Other:** Docker for containerization, Swagger for API documentation

## Installation and Setup

### Backend

1. Clone the repository:

   ```bash
   git clone https://github.com/NoNameMB10K/Spendwise-backend.git
   cd Spendwise-backend
   ```

2. Run Docker Compose:

   ```bash
   docker-compose up
   ```

3. Access the Swagger API documentation at:
   ```
   http://localhost:8181/api/doc
   ```

### Frontend

1. Clone the repository:

   ```bash
   git clone https://github.com/NoNameMB10K/Spendwise-frontend.git
   cd Spendwise-frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Usage

1. Upload pictures of receipts to the application.
2. The AI will read and categorize the products from the receipts.
3. Create new categories as needed.
4. Rectify any mistakes made by the AI in categorizing products.
5. View the categorized products and access the statistics page to see spending details.
