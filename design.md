Design patterns in EMS
🎯1. MVC (Model–View–Controller) – Backend
Used at :
 backend/models/*, backend/controllers/*, backend/routes/*
How:
Models = Mongoose schemas


Controllers = business logic


Routes = HTTP endpoints


Benefit:
 Separation of concerns → maintainable and scalable backend.
🎯2. Layered Architecture (N-tier Architecture)
Used :
 Backend is layered as:
Route Layer


Controller Layer


Service/Logic Layer (inside controllers)


Database Layer (Mongoose models)


Benefit:
 Each layer has a single responsibility.
🎯3. Singleton Pattern – Database Connection
Used at:
 Your DB connection file (MongoDB) creates one instance of connection.
Adv:
 Ensures only one DB connection is reused.
🎯4. Factory Pattern – API Instance in React
Used at:
 frontend/src/api/api.js
It creates a configured Axios instance:
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

Adv:
 Centralized client creation → consistent headers, URL, interceptors.
🎯5. Observer Pattern – React State + Socket.io
Used at:
React components re-render automatically when state changes.


socket.js pushes events → components listen.


Adv:
 State observes changes & updates UI → classic observer implementation.

🎯 6. Module Pattern – ES6 Modules
Used at:
 Every file uses:
export default ...
import ...

Adv:
 Encapsulates code and exposes only required parts.

🎯 7. Custom Hook Pattern – React Query / Custom API Hooks
If you used React Query in few pages:
Example:
const { data, isLoading } = useQuery(["user"], getCurrentUser);

React Query implements:
Caching
Background refetching
Data synchronization


🎯 8. Strategy Pattern – Express Middlewares
Used at:
 Authentication middleware, error handlers.
Example:
app.use(cors())
app.use(express.json())

Each middleware is a strategy that processes the request differently.

🎯 9. Facade Pattern – API Wrapper Files
Used at:
userApi.js
salaryApi.js
api.js


Hide axios complexity and expose simple functions:
export const getUsers = () => api.get("/users");





