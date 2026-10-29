import { createBrowserRouter, Navigate } from 'react-router'
import PlainLayout from '@/app/layouts/PlainLayout.jsx'
import TestLayout from '@/app/layouts/TestLayout.jsx'
import StepGuard from '@/app/guards/StepGuard.jsx'
import TestListPage from '@/pages/TestListPage.jsx'
import MenuRegisterPage from '@/pages/onboarding/MenuRegisterPage.jsx'
import RecipeInputPage from '@/pages/onboarding/RecipeInputPage.jsx'
import AiIngredientPage from '@/pages/onboarding/AiIngredientPage.jsx'
import CostResultPage from '@/pages/onboarding/CostResultPage.jsx'
import DashboardLayout from '@/pages/dashboard/DashboardLayout.jsx'
import OperationTabPage from '@/pages/dashboard/OperationTabPage.jsx'
import OrdersTabPage from '@/pages/dashboard/OrdersTabPage.jsx'
import CostEditPage from '@/pages/dashboard/CostEditPage.jsx'
import IngredientEditPage from '@/pages/dashboard/IngredientEditPage.jsx'
import ReportPrecheckPage from '@/pages/ReportPrecheckPage.jsx'
import ReportPage from '@/pages/ReportPage.jsx'
import SimulatorPage from '@/pages/SimulatorPage.jsx'

// TODO: 경로는 임시. 기획 확정 후 정리
export const router = createBrowserRouter([
  {
    element: <PlainLayout />,
    children: [
      { path: '/', element: <Navigate to="/tests" replace /> },
      { path: '/tests', element: <TestListPage /> },
    ],
  },
  {
    path: '/tests/new',
    element: <TestLayout />,
    children: [{ index: true, element: <MenuRegisterPage /> }],
  },
  {
    path: '/tests/:testId',
    element: <TestLayout />,
    children: [
      {
        element: <StepGuard />,
        children: [
          { path: 'onboarding/menu', element: <MenuRegisterPage /> },
          { path: 'onboarding/recipe', element: <RecipeInputPage /> },
          { path: 'onboarding/ai', element: <AiIngredientPage /> },
          { path: 'onboarding/result', element: <CostResultPage /> },
          {
            path: 'dashboard',
            element: <DashboardLayout />,
            children: [
              { index: true, element: <Navigate to="operation" replace /> },
              { path: 'operation', element: <OperationTabPage /> },
              { path: 'orders', element: <OrdersTabPage /> },
            ],
          },
          { path: 'dashboard/cost', element: <CostEditPage /> },
          { path: 'dashboard/cost/ingredients', element: <IngredientEditPage /> },
          { path: 'precheck', element: <ReportPrecheckPage /> },
          { path: 'report', element: <ReportPage /> },
          { path: 'simulator', element: <SimulatorPage /> },
        ],
      },
    ],
  },
])
