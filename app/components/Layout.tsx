import { Link } from "@remix-run/react";
import { Button } from "./ui/button";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between">
          <Link to="/" className="text-xl font-bold text-gray-800">
            My Blog
          </Link>
          <Link to="/">
            <Button type="submit">Go back</Button>
          </Link>
        </div>
      </nav>
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-white shadow-sm mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-gray-500">
          © 2024 My Blog. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
