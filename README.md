# Facebook Frontend + Backend

A simplified Facebook-style application demonstrating basic frontend and backend integration. This project uses in-memory arrays (local files) for data storage and operates on a single route, making it ideal for learning and demonstration purposes.

## Features

* Basic user interface resembling Facebook's layout.
* In-memory data storage using local files (e.g., `data.json`).
* Single-route operation for simplicity.
* Demonstrates frontend-backend communication without a database.

## Technologies Used

* **Frontend**: HTML, CSS, JavaScript
* **Backend**: Node.js, Express.js

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Henil29/Facebook-Frontend-Backend.git
   cd Facebook-Frontend-Backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the server:**

   ```bash
   node index.js
   ```

4. **Access the application:**

   Open your browser and navigate to `http://localhost:3000`.

## Project Structure

```
Facebook-Frontend-Backend/
├── data.json           # In-memory data storage
├── index.js            # Entry point for the backend server
├── public/             # Static assets (CSS, JS, images)
├── views/              # HTML templates
├── package.json        # Project metadata and dependencies
└── README.md           # Project documentation
```

## Usage

Upon starting the server, the application serves a single route (`/`) that renders the main interface. User interactions are handled on the frontend, with data fetched from and sent to the backend, which reads from and writes to `data.json`.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## License

This project is open-source and available under the [MIT License](LICENSE).
