import './App.css'
import { Login } from './pages/login/index';
import { Signup } from './pages/register';
import { Unauthorized } from './pages/unauthorized';
import { NotFound } from './pages/not-found';
import { Dashboard } from './pages/dashboard';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import MainLayout from './layouts/MainLayout';
import ProtectedLayout from './layouts/ProtectedLayout';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import { secondaryColorBg } from './styles/styles';
import CreateTask from './pages/create-task/page';

export const queryClient = new QueryClient()

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route path="signup" element={<Signup />} />
      <Route path="login" element={<Login />} />

      <Route element={<ProtectedLayout />}>
        <Route index element={<Dashboard />} />
        <Route index path="dashboard" element={<Dashboard />} />
        <Route path="create-task" element={<CreateTask />} />
      </Route>

      <Route path="unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
)

export default function App() {
  return <div className={secondaryColorBg}>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </div>;
}