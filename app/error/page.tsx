export default function ErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-red-50">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
      <p className="text-center text-red-700">
        Something went wrong during authentication. Please try again or contact support if the issue persists.
      </p>
    </div>
  )
}
