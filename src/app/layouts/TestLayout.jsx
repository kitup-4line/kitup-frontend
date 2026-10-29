import { Outlet } from 'react-router'
import StepSidebar from '@/app/layouts/StepSidebar.jsx'

function TestLayout() {
  return (
    <>
      <header />
      <div>
        <StepSidebar />
        <main>
          <Outlet />
        </main>
      </div>
    </>
  )
}

export default TestLayout
