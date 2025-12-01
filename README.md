🔧 Project Setup & Installation
1️⃣ Clone the Repo
git clone <repo-link>
cd project-folder


2️⃣ Backend Setup
cd backend
npm install

Create .env file:
PORT=5000
MONGO_URI=<your-mongo-uri>
JWT_SECRET=<your-secret>
EMAIL_USER=<email>
EMAIL_PASS=<password>

Start Server
npm run dev


3️⃣ Frontend Setup
cd frontend
npm install
npm start


🧩 Folder Structure
project/
 ├── backend/
 │   ├── controllers/
 │   ├── models/
 │   ├── routes/
 │   ├── utils/
 │   └── server.js
 │
 └── frontend/
     ├── src/
     ├── components/
     └── pages/


📌 Important Middleware Used (Backend)
app.use(express.json());              // JSON body parsing
app.use(express.urlencoded({extended:true})); // Form-data parsing
app.use(cors());                      // Cross origin
app.use(cookieParser());              // Cookies
app.use(express.static("public"));    // Serve static files


🔗 API Endpoints Overview
Employee Routes
Method
Endpoint
Description
POST
/api/employees/register
Employee registration
POST
/api/employees/login
Login user
GET
/api/employees/pending
List pending employees
PATCH
/api/employees/approve/:id
Approve employee

Leave Routes
Method
Endpoint
Description
POST
/api/leaves
Create leave request
GET
/api/leaves
Get all leaves
PATCH
/api/leaves/approve/:id
Approve leave


