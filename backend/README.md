# VoiceDiary Backend API Documentation

This documentation describes the backend API of the VoiceDiary application, which includes a Go backend and a Python-based Machine Learning (ML) service for emotional recognition, transcription, and insights extraction.

---

## Backend API (Go)

### User Management

#### Register

* **Endpoint:** `POST /users/register`
* **Description:** Registers a new user.
* **Request Body:**

  ```json
  {"login": "email@example.com", "password": "password", "nickname": "nickname"}
  ```
* **Response:**

  ```json
  {"userID": 1}
  ```

#### Login

* **Endpoint:** `POST /users/login`
* **Description:** Logs in a user.
* **Request Body:**

  ```json
  {"login": "email@example.com", "password": "password"}
  ```
* **Response:**

  ```json
  {"message": "Login successful"}
  ```

#### Get User Info

* **Endpoint:** `GET /users/me`
* **Description:** Retrieves current user information.

#### Logout

* **Endpoint:** `POST /users/logout`
* **Description:** Logs out the current user.

#### Update Profile

* **Endpoint:** `PATCH /users/me`
* **Description:** Updates the user profile.
* **Request Body:**

  ```json
  {"login": "newemail@example.com", "password": "newpassword", "nickname": "newnickname"}
  ```

### Record Management

#### Upload Record

* **Endpoint:** `POST /records/upload`
* **Description:** Uploads a voice recording for analysis.
* **Form Data:**

  * `userID`: integer
  * `file`: audio file
* **Response:**

  ```json
  {"user_id": 1, "record_id": 123, "emotion": "happy", "summary": "brief summary", "text": "transcribed text"}
  ```

#### Get Records

* **Endpoint:** `GET /users/{userID}/records`
* **Description:** Retrieves records for a specified user.

#### Get Record Analysis

* **Endpoint:** `GET /records/{recordID}`
* **Description:** Retrieves the analysis of a specific record.

#### Get Insights

* **Endpoint:** `POST /records/insights`
* **Description:** Retrieves insights from text.
* **Request Body:**

  ```json
  {"text": "your text here", "recordID": 123}
  ```

#### Delete Record

* **Endpoint:** `DELETE /records/{recordID}`
* **Description:** Deletes a specific record.

#### Set Feedback

* **Endpoint:** `POST /records/{recordID}/feedback`
* **Description:** Sets feedback for a record.
* **Request Body:**

  ```json
  {"feedback": 1}
  ```

### Totals

#### Get Totals

* **Endpoint:** `GET /totals/{userID}?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD`
* **Description:** Retrieves totals for the user over a date range.

#### Recalculate Total

* **Endpoint:** `POST /totals/{userID}/recalculate/{date}`
* **Description:** Recalculates totals for a specific day.

---

## ML API (Python)

### Analyze Audio

* **Endpoint:** `POST /analyze`
* **Description:** Analyzes uploaded audio files.
* **Form Data:** `file`: audio file
* **Response:**

  ```json
  {"emotion": "happy", "summary": "brief summary", "text": "transcribed text"}
  ```

### Get Text Insights

* **Endpoint:** `GET /insights`
* **Description:** Extracts insights from text.
* **Request Body:**

  ```json
  {"text": "your text here"}
  ```
* **Response:**

  ```json
  {"insights": {"emotional_dynamics": "", "key_triggers": [], "physical_reaction": "", "coping_strategies": {"effective": "", "ineffective": ""}, "recommendations": []}}
  ```

---

## Integration with ML Service (Go client)

### CallMLService

* **Description:** Sends audio to ML service for analysis.

### CallMLServiceWithInsights

* **Description:** Sends text to ML service to get insights.

### CallMLServiceWithCombinedText

* **Description:** Sends combined text data to ML service.

---

## Technologies Used

* **Go:** Gin framework, PostgreSQL
* **Python:** FastAPI, Hugging Face transformers, Whisper, Librosa, PyTorch

---

## Deployment & Environment

* Environment variables (`.env`):

  ```
  FRONTEND="http://your-frontend.com"
  DATABASE_URL="postgres://user:password@host:port/dbname"
  ML_SERVICE_URL="http://ml-service-url"
  ```

---

## Running the Service

* Start backend Go service:

  ```bash
  go run cmd/api/main.go
  ```
* Start Python ML service:

  ```bash
  uvicorn backend.python_api.main:app --host 0.0.0.0 --port 8000
  ```
