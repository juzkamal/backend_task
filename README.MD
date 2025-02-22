# Identify Contact API

This project implements a contact identification system using **Node.js**, **Express**, and **MySQL**. It allows linking multiple contact details (emails and phone numbers) under a primary contact.

## Features
- Identifies and links contacts based on email and phone number.
- Ensures new entries are marked as secondary contacts when linked.
- Includes an HTML frontend (`index.html`) for submitting contact data.

---

## Installation

### Prerequisites
Ensure you have the following installed:
- **Node.js** (v14+ recommended)
- **MySQL**
- **Git**

### Setup Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/identify-contact.git
   cd identify-contact
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up the database:
   - Create a MySQL database.
   - Update `config.js` with your database credentials.
   - Run migrations:
     ```sh
     npm run migrate
     ```

4. Start the server:
   ```sh
   npm start
   ```
   The API will be available at `http://localhost:3000`.

---

## API Endpoints

### `POST /identify`
**Description:** Identifies or links a contact based on the provided email and phone number.

**Request Body:**
```json
{
  "email": "user@example.com",
  "phoneNumber": "9876543210"
}
```

**Response Example:**
```json
{
  "primaryContactId": 1,
  "emails": ["user@example.com", "doc@example.com"],
  "phoneNumbers": ["9876543210"],
  "secondaryContactIds": [2]
}
```

---

## Frontend (index.html)
The project includes a simple `index.html` page for submitting form data.

### Running the Frontend
1. Open `index.html` in a browser.
2. Enter an email and/or phone number.
3. Click **Submit** to send a request to the API.
4. The response will be added into the database.

---

## Running Tests
Tests are written using **Jest** and **Supertest**.

Run tests with:
```sh
npm test
```

---

### Author
Guru Kamal T

