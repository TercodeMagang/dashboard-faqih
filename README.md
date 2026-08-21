# Invito Dashboard

This is the dashboard for the Invito application.

## Standalone Mode (No Backend)

This dashboard supports running entirely without the NestJS backend, useful for static deployments like Vercel.

By default, the application is configured to run in **standalone mode**. In this mode, all API calls are intercepted and mocked using local data.

### How to toggle Backend connection

You can control this behavior using the `VITE_USE_BACKEND` environment variable.

1. **Standalone Mode (Default)**
   - Set `VITE_USE_BACKEND=false` in your `.env.local` file.
   - Use `demo@invito.com` / `demo123` to login, or register a new account which will be saved in your browser's local storage.
   - Run `npm run dev` or `npm run build` safely without a backend.

2. **Connected to Backend**
   - Set `VITE_USE_BACKEND=true` in your `.env.local` file.
   - Ensure your NestJS backend is running on `http://localhost:3000`.
   - The application will make real HTTP requests to the backend.
