# events-booking-app
This is a backend system for managing event bookings in real-time using Node.js, MySQL, Redis, and RabbitMQ. It includes features such as event creation, booking management.

## Features

### 1. Event Management
- Create events with a name and capacity
- Fetch the current booking count for an event.

### 2. Booking Management
- **Book an event while ensuring:**
  - Capacity is not exceeded.
  - Users cannot book the same event multiple times.
 
### 3. Caching with Redis
- Booking counts are cached in Redis for improved performance.
- Cache is updated whenever a booking is made.

### 4. Message Queue with RabbitMQ
- Sends a message to RabbitMQ upon a successful booking to simulate email notifications.
- A consumer listens for messages and logs the notifications.

## Prerequisites
Before running the project, ensure you have the following installed:
### 1. Node.js: >= 16.x
Install from [Node.js official website](https://nodejs.org/en)
### 2. MySQL: >= 8.x
Install from [MySQL official website](https://www.mysql.com/)
### 3. Redis
Install from [Redis official website](https://redis.io/)
### 4. RabbitMQ
- Install Erlang from [Erlang official websit](https://www.erlang.org/)
- Install from [RabbitMQ official website](https://www.rabbitmq.com/)

## Project Setup
### 1. Clone the Repository
```bash
git clone https://github.com/safwanamani/events-booking-app.git
cd events-booking-app
```
### 2. Install Dependencies
```bash
npm install
```
### 3. Configure Environment Variables
Create a .env file in the project root and configure the following:
```plaintext
# MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_DATABASE=event_booking

# Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# RabbitMQ
RABBITMQ_URL=amqp://localhost
```
### 4. Setup Database
- Create a MySQL database called `event_booking`
- Create 2 tables named `events` and `bookings`
```sql
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    capacity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_booking (user_id, event_id),
    FOREIGN KEY (event_id) REFERENCES events(id)
);
```

## How to Run the Application
### 1. Start Redis
  Start the Redis server locally:
```bash
redis-server
```
### 2. Start RabbitMQ
  Start the RabbitMQ server locally:
```bash
rabbitmq-service start
```
### 3. Start the API Server
Run the server:
```bash
node index.js
```
Using nodemon
```bash
npm start
```
### 4. Start the Consumer
Run the consumer process to listen for RabbitMQ messages:
```bash
node consumer.js
```
using nodemon
```bash
npx nodemon consumer.js
```

## API Endpoints
### 1. Create Event
- URL `POST /events/create`
- Body:
```json
{
    "name": "Event Name",
    "capacity": 60
}
```
- Response:
```json
{
    "message": "Events created successfully",
    "data": {
        "id": 1,
        "name": "Event Name",
        "capacity": 60
    }
}
```
### 2. Book Event
- URL: `POST /events/:eventId/book`
- Body:
```json
{
    "userId": 1,
    "userName": "Jack"
}
```
- Response:
```json
{
    "message": "Successfully booked",
    "data": {
        "bookingId": 1
    }
}
```
### Get Booking Coun
- URL: `GET /events/:eventId/bookings`
- Response:
```json
{
    "eventId": "1",
    "bookingCount": 10
}
```

## Testing the Application
### Simulate an Email Notification
1. Call the `POST /events/:eventId/book` endpoint to book an event
2. The message is sent to RabbitMQ and processed by the consumer.
3. The consumer logs the simulated email notification:
```bash
Email notification: Thank you, Jack! You’ve successfully booked your spot for New year party. Get ready for an amazing experience!
```

## File Structure
```plaintext
events-booking-app
│
├── src/
│   ├── controllers/
│   |   ├── bookingController.js # Handlers for booking endpoints
|   |   └── eventController.js # Handlers for event endpoints
|   ├── middlewares/
│   |   └── validate.js
│   ├── models/
|   |   └── db.js # MySQL database connection pool
|   ├── routes/
|   |   ├── event.js
|   |   └── index.js
|   ├── services/
│   |   ├── redisService.js # Redis client setup
│   |   └── rabbitmqService.js # RabbitMQ producer
│   └── validations/
|       └── validation.js
├── config.js
├── consumer.js         # RabbitMQ consumer script
├── index.js           # Main server script
└── README.md           # Project documentation
```

## Technologies Used
- Node.js: Backend runtime environment.
- Express: Web framework for API creation.
- MySQL: Relational database for storing event and booking data.
- Redis: In-memory caching for booking counts.
- RabbitMQ: Message queue for email notification simulation.


