# React + Vite

Building Planner - Backend

This is the backend of the Building Planner web application. It provides RESTful APIs to create, read, update, and delete building drawings with shapes and annotations.

##Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose

##  Folder Structure

backend/
├── controllers/ # Business logic (CRUD)
│ └── DrawingControllers.js
├── models/ # Mongoose schema for drawings
│ └── DrawingModel.js
├── routes/ # API endpoints
│ └── drawingRoutes.js
├── .env # MongoDB URI and configs
├── index.js # Server entry point

##  Setup Instructions

1. **Install dependencies**  

npm install

MONGO_URI=mongodb+srv://seikhabubakar47:Seikh786@cluster25.nbziqwq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster25
PORT=8000
Start the server
npm start
Server runs at http://localhost:8000.

 API Endpoints
POST	/api/drawings	Create a drawing
GET	/api/drawings	Get all drawings
GET	/api/drawings/:id	Get drawing by ID
PUT	/api/drawings/:id	Update a drawing
DELETE	/api/drawings/:id	Delete a drawing

frontend
# Building Planner - Frontend

This is the frontend of the Building Planner application. It allows users to draw, annotate, save, and load building plans interactively.

## Tech Stack

- React.js
- Fabric.js (for canvas)
- Axios (for API calls)
- React Router DOM

## Folder Structure

frontend/
├── public/
├── src/
│ ├── components/
│ │ ├── DrawingCanvas.jsx # Main canvas
│ │ ├── Toolbar.jsx # Tool buttons
│ │ └── Navbar.jsx
│ ├── helpers/
│ │ └── shapeUtils.js # Shape creation functions
│ ├── App.jsx
│ ├── index.js
│ └── index.css


## Setup Instructions

1. **Install dependencies**  
npm install
Start the app
npm run dev
Features:--
Draw tools: line, rectangle, circle

Select tool: move, resize, delete shapes

View tool: toggle annotations (dimensions, labels)

Save drawings to backend

Load saved drawings from history

Clear canvas button

Built with using React and Fabric.js
