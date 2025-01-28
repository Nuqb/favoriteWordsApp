# Favorite Words Web Application

This is a web application I made while learning web applications in one of my classes. This isnt anything advanced but the main idea is showing how this was made with **JavaScript without frameworks** and getting some practice with **full-stack development** by managing a data base, sessions, and users. This does not work with pages because it uses localhost so if you want to try it yourself you will need to clone it. Anyway I hope this can express some of my capabilities.

This is a web application that allows users to store, manage, and explore their favorite words, along with their language of origin and definitions. The application features user accounts, session management, and a persistent database.

## Features

- User Authentication
  - Create an account with a first name, last name, email, and password.
  - Log in and log out securely.
  - Persistent sessions using tokens.

- Word Management
  - Add words along with their language of origin and definitions.
  - Edit and delete existing words.
  - View a list of all favorite words.

- Customization
  - Change the background color of the application, saved per user session.

- Backend API
  - RESTful endpoints for user and word management.
  - Secure authorization using sessions.

## Technologies Used

### Frontend
- HTML, CSS (custom styles with hover effects), and JavaScript.
- Dynamic user interactions powered by JavaScript.

### Backend
- Python (Flask for API endpoints).
- SQLite for database management.
- Custom session management with Python.

## Setup and Installation

### Prerequisites
- Python 3.x installed on your system.
- Node.js (optional for frontend customization and additional tooling).

### Steps
1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/favorite-words.git
   cd favorite-words
   ```
2. Install Python dependencies
   ```bash
   pip install flask passlib
   ```
3. Setup DB
   ```bash
   CREATE TABLE favoritewords (id INTEGER PRIMARY KEY, word TEXT, origin TEXT, definition TEXT);
   CREATE TABLE users (id INTEGER PRIMARY KEY, first_name TEXT, last_name TEXT, email TEXT, password TEXT);
   ```
4. Start Server
   ```bash
   python server.py
   ```
5. Open index.html into your browser

## Project Structure
/Directory <br>
├── app.js                (Frontend JavaScript logic) <br>
├── index.html            (Frontend HTML structure) <br>
├── style.css             (Custom styles for the application) <br>
├── server.py             (Flask API backend) <br>
├── session_store.py      (Custom session management) <br>
├── words.py              (Database operations) <br>
├── words_db.db           (SQLite database file) <br>

## API Endpoints

### Session Management
- **`GET /sessions`**  
  Retrieve session details.

- **`DELETE /sessions`**  
  End the current session.

- **`PUT /session/settings`**  
  Update session settings.

### Word Management
- **`POST /words`**  
  Add a new word.

- **`GET /words`**  
  Get all words.

- **`PUT /words/<id>`**  
  Update a word by ID.

- **`DELETE /words/<id>`**  
  Delete a word by ID.

### User Management
- **`POST /users`**  
  Create a new user.

- **`POST /sessions/auth`**  
  Authenticate a user.

