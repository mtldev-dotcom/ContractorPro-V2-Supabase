'use server'

import { login, signup } from './actions'

export default async function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold">Sign In or Sign Up</h2>
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <input id="email" name="email" type="email" required className="w-full border rounded px-3 py-2"/>
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium">Password</label>
          <input id="password" name="password" type="password" required className="w-full border rounded px-3 py-2"/>
        </div>
        <div className="flex gap-4">
          <button formAction={login} className="px-4 py-2 bg-blue-600 text-white rounded">Log in</button>
          <button formAction={signup} className="px-4 py-2 bg-green-600 text-white rounded">Sign up</button>
        </div>
      </form>
    </div>
  )
}
