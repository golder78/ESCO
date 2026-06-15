import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <div className="container notfound">
      <h1>404</h1>
      <h2>Page not found</h2>
      <p style={{ color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary">
        Back to Home
      </Link>
    </div>
  )
}
