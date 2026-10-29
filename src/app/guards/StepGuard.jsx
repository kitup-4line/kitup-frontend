import { Outlet } from 'react-router'

// TODO: test.status 기준 접근 허용·리다이렉트 (domain/testStatus.js)
function StepGuard() {
  return <Outlet />
}

export default StepGuard
