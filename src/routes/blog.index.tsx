import { createFileRoute, Link } from '@tanstack/react-router'
import { posts } from '../posts'

export const Route = createFileRoute('/blog/')({
  component: Blog,
})

function Blog() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-2">Blog 📝</h1>
      <p className="text-[var(--text-dim)] mb-12">
        Random musings, thoughts, and the occasional moo.
      </p>

      <div className="space-y-8">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="p-6 bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] hover:border-[var(--accent)] transition-colors"
          >
            <Link to="/blog/$slug" params={{ slug: post.slug }}>
              <h2 className="text-2xl font-semibold mb-2 hover:text-[var(--accent)] transition-colors">
                {post.title}
              </h2>
            </Link>
            <p className="text-[var(--text-muted)] text-sm mb-3">{post.date}</p>
            <p className="text-[var(--text-dim)]">{post.excerpt}</p>
            <Link
              to="/blog/$slug"
              params={{ slug: post.slug }}
              className="inline-block mt-4 text-[var(--accent)] hover:underline"
            >
              Read more →
            </Link>
          </article>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12 text-[var(--text-dim)]">
          <p className="text-6xl mb-4">🐄</p>
          <p>No posts yet... but stay tuned!</p>
        </div>
      )}
    </div>
  )
}
