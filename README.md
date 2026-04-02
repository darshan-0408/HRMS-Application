# HRMS Admin Frontend Developer Guide

This repository contains the administrative frontend panel for the HRMS (Human Resources Management System) application. It is built using React 18 with Vite, featuring a responsive and modular design intended for HR administrators.

## Project Architecture

This application employs a modern React stack optimized for enterprise applications.

### Core Technologies
- **Framework:** React 18, utilizing functional components and hooks.
- **Build Tool:** Vite for fast, optimized HMR and bundling.
- **Routing:** React Router v6 (`react-router-dom`) with nested routes.
- **API Client:** Apollo GraphQL Client (`@apollo/client`, `graphql`).
- **Styling:** Vanilla CSS coupled with CSS Modules (`*.module.css`) for component scoping.
- **Icons:** Lucide React (`lucide-react`).
- **Date Utility:** Day.js (`dayjs`).

### Application Structure
```text
src/
├── api/             # GraphQL queries, mutations, apollo config, and mock data generators
├── assets/          # Static assets like images and global SVG icons
├── components/      # Reusable UI components (Modal, SideDrawer, Pagination, Layouts, etc.)
├── constants/       # Global application constants (status maps, date formats, route names)
├── pages/           # Route-level components mapping directly to pages
│   ├── Login/
│   ├── Dashboard/
│   ├── Employees/
│   ├── Attendance/
│   ├── LeaveApplications/
│   ├── MovementRegister/
│   ├── Approvals/
│   └── Settings/
├── styles/          # Global styles (variables.css, global.css)
├── utils/           # Reusable helper functions
├── App.jsx          # Root component, router configuration, context providers
└── main.jsx         # Entry point, React DOM render
```

## Running the Application

### Prerequisites
- Node.js (v16 or higher)
- NPM or Yarn

### Installation & Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file in the project root if you are connecting to a real backend.
   ```
   VITE_GRAPHQL_URL=http://localhost:4000/graphql
   ```

3. **Development Server:**
   ```bash
   npm run dev
   ```

## Development Guidelines

### API Integration (GraphQL)
The application currently runs heavily on robust **mock data** located in `src/api/mockData.js`. This allows the UI to be fully interactive without a backend.
- Real GraphQL queries and mutations are defined in files like `src/api/employeeQueries.js`.
- To switch to real data, update the components in `src/pages/*` to use the Apollo `useQuery` and `useMutation` hooks instead of importing the synchronous `mockData`.
- `apolloClient.js` is already configured to inject auth tokens (`hrms_token`) into HTTP headers.

### Component Styling
- **Global Variables:** Use CSS variables defined in `src/styles/variables.css` for colors, spacing, radii, etc.
- **CSS Modules:** For component-specific styles, always use `ComponentName.module.css` to prevent global CSS namespace collisions.
- **Utility Classes:** Common generic structures like `.card`, `.page-wrapper`, and `.badge` are available globally.

### Adding a New Page
1. Create a highly cohesive folder in `src/pages/NewFeatureName`.
2. Add your `NewFeatureName.jsx` and `NewFeatureName.module.css`.
3. Re-export it through an `index.js`.
4. Register the route in `src/App.jsx` inside the `AppLayout` nested routes.

## Testing Mock Data
The app ships with a comprehensive mock data suite designed to resemble real database payloads. When building out new UI behaviors (like paginating or filtering), rely on standard array functions (`.filter()`, `.slice()`) against these mock arrays until the backend APIs are mapped via Apollo hooks.
