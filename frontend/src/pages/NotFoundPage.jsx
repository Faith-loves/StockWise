import { Link } from "react-router-dom"
import { Button, EmptyState } from "../components"

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-lg">
        <EmptyState
          title="404 - Page not found"
          description="The page you are looking for does not exist in StockWise."
          action={<Link to="/dashboard"><Button>Go to dashboard</Button></Link>}
        />
      </div>
    </div>
  )
}
