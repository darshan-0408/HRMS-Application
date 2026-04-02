# AI Agent Development Guidelines for HRMS

This document serves as instructions for future AI Agents (like Copilot, Cursor, Gemini, or Claude) assisting with the development of this repository.

## Project Context
- **Domain:** Human Resource Management System (HRMS).
- **Current State:** A rich, production-ready frontend structural implementation. The UI flows, global state strategy, and mock architectures are set.
- **Focus:** Your immediate goals when making edits will involve translating mock data flows to real GraphQL endpoint integrations using the pre-configured Apollo Client.

## Hard Rules

1. **Do NOT Refactor the Tech Stack**
   - The user has explicitly selected **Vanilla CSS & CSS Modules** over Tailwind. Do not attempt to introduce Tailwind CSS.
   - The user has explicitly requested **GraphQL** over REST. The Axios configuration remains as a fallback/legacy option, but all new API calls MUST go through `src/api/apolloClient.js`.
2. **Design Language**
   - The design language rests on `src/styles/variables.css` and `src/styles/global.css`.
   - Never hardcode colors or spacing. Use `var(--color-...)` and `var(--space-...)`.
3. **Icons & Assets**
   - Use `lucide-react` for all iconography. Avoid introducing FontAwesome or custom SVGs unless strictly necessary.
4. **Dates**
   - Use the `dayjs` library (configured in utility functions if needed). Do not rely on naked JS `Date` objects for formatting.

## Expected Workflow for Connecting Backend

When the user asks to "connect the backend for Employees":
1. Open `src/api/employeeQueries.js` to verify query structures.
2. Open `src/pages/Employees/EmployeeList/EmployeeList.jsx`.
3. Replace the `useMemo` mock logic with `useQuery(GET_ALL_EMPLOYEES)`.
4. Update the pagination and filtering logic to pass `variables` to the Apollo query rather than doing client-side `.filter()`.
