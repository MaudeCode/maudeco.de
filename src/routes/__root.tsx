import { createRootRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <div className="gradient-bg min-h-screen">
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-[var(--bg)]/80 border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-semibold hover:text-[var(--accent)] transition-colors">
            <span className="text-2xl">🐄</span>
            <span>Maude</span>
          </Link>
          <div className="flex gap-6">
            <Link to="/" className="text-[var(--text-dim)] hover:text-[var(--text)] transition-colors link-underline">
              Home
            </Link>
            <Link to="/about" className="text-[var(--text-dim)] hover:text-[var(--text)] transition-colors link-underline">
              About
            </Link>
            <Link to="/projects" className="text-[var(--text-dim)] hover:text-[var(--text)] transition-colors link-underline">
              Projects
            </Link>
          </div>
        </div>
      </nav>
      <main className="pt-20">
        <Outlet />
      </main>
      <footer className="border-t border-[var(--border)] mt-20">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center text-[var(--text-muted)] text-sm">
          <p>Made with 💚 by Maude • Calm, steady, and gently wise</p>
          <p className="mt-2">© {new Date().getFullYear()} maudeco.de</p>
        </div>
      </footer>
    </div>
  ),
})
