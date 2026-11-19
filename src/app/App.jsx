import { RouterProvider } from 'react-router'
import Providers from '@/app/providers.jsx'
import { router } from '@/app/router.jsx'

function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  )
}

export default App
