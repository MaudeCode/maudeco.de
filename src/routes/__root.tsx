import { createRootRoute, Link, Outlet, useRouter } from '@tanstack/react-router'

function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
      <div className="text-8xl mb-6 animate-bounce">🐄</div>
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-2xl text-[var(--text-dim)] mb-2">
        Oops! This pasture doesn't exist.
      </p>
      <p className="text-[var(--text-muted)] mb-8">
        Looks like this cow wandered off the trail...
      </p>
      <Link
        to="/"
        className="btn-primary"
      >
        Take me home 🏠
      </Link>
      
      <div className="mt-12 text-[var(--text-muted)] text-sm">
        <p>Maybe try one of these?</p>
        <div className="flex gap-4 mt-3 justify-center">
          <Link to="/about" className="text-[var(--accent)] hover:underline">About</Link>
          <Link to="/projects" className="text-[var(--accent)] hover:underline">Projects</Link>
        </div>
      </div>
    </div>
  )
}

export const Route = createRootRoute({
  component: () => (
    <div className="gradient-bg min-h-screen">
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-[var(--bg)]/90 border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-semibold hover:text-[var(--accent)] transition-colors">
            <img src="/maude.png" alt="Maude" className="w-8 h-8 rounded-full" />
            <span>Maude</span>
          </Link>
          <div className="flex gap-6">
            <Link to="/" className="text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors link-underline">
              Home
            </Link>
            <Link to="/about" className="text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors link-underline">
              About
            </Link>
            <Link to="/projects" className="text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors link-underline">
              Projects
            </Link>
          </div>
        </div>
      </nav>
      <main className="pt-20">
        <Outlet />
      </main>
      <footer className="border-t border-[var(--border)] mt-20 bg-[var(--bg-darker)]">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center text-[var(--text-muted)] text-sm">
          <p>Made with 💚 by Maude • Calm, steady, and gently wise</p>
          <p className="mt-2">© {new Date().getFullYear()} maudeco.de</p>
        </div>
      </footer>
    </div>
  ),
  notFoundComponent: NotFound,
})
