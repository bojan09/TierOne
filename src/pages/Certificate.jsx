import { Navigate } from 'react-router-dom'

// Legacy singular /certificate route — superseded by the server-driven
// /certificates experience. Redirect to preserve old links.
export default function Certificate() {
  return <Navigate to="/certificates" replace />
}
