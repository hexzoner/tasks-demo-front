# React + TypeScript + Vite

- Tanstack Query — For fetching, caching and handling the API requests, via either Axios or any other HTTP request library you prefer. — Read about “optimistic updates” in the docs and make sure to implement it in the app.
- Tanstack Table — For handling tables with pagination, sorting and filtering.
- React Router — For handling routes.
- Zod — For data schemas and validations.
- Radix UI Themes — Tailwind CSS v4.

## Features
- Sign up / Login: using JWT stored in localstorage. — Signed up users are automatically provided with “user” role. No flow to become an admin.
- Create and edit tasks: React Hook Form to create and edit forms with the validation schema defined in zod with their respective validation rules.
- Both admin and users can create tasks and assign any user in the system.
- Users can edit only the tasks they have created.
- Only admins can edit any tasks, regardless of the owner/creator.
- View tasks: Tanstack Table to handle operations. Filtering and sorting should be passed through query URL params so they are reactive to the app (e.g: with a permalink I could land directly in a filtered view of tasks). 
- Users can view only tasks they have created and the ones that have been assigned to them.
- Admins can view all tasks in the system.
- Delete tasks: Users can delete their own tasks and admins can delete any tasks.
