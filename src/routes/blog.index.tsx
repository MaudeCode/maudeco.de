import { createFileRoute, Link, useSearch } from '@tanstack/react-router'
import { posts } from '../posts'
import { calculateReadingTime, getAllTags } from '../blog-utils'

export const Route = createFileRoute('/blog/')({
  component: Blog,
  validateSearch: (search: Record<string, unknown>) => ({
    tag: typeof search.tag === 'string' ? search.tag : undefined,
  }),
})

function Blog() {
  const { tag: selectedTag } = useSearch({ from: '/blog/' })
  const allTags = getAllTags(posts)

  const filteredPosts = selectedTag ? posts.filter((p) => p.tags?.includes(selectedTag)) : posts

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-2">Blog 📝</h1>
      <p className="text-[var(--text-dim)] mb-8">
        Random musings, thoughts, and the occasional moo.
      </p>

      {/* Tags filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          to="/blog"
          className={`text-sm px-3 py-1 rounded-full transition-colors ${
            !selectedTag
              ? 'bg-[var(--accent)] text-white'
              : 'bg-[var(--bg-secondary)] text-[var(--text-dim)] hover:bg-[var(--bg-tertiary)]'
          }`}
        >
          All
        </Link>
        {allTags.map(({ tag, count }) => (
          <Link
            key={tag}
            to="/blog"
            search={{ tag }}
            className={`text-sm px-3 py-1 rounded-full transition-colors ${
              selectedTag === tag
                ? 'bg-[var(--accent)] text-white'
                : 'bg-[var(--bg-secondary)] text-[var(--text-dim)] hover:bg-[var(--bg-tertiary)]'
            }`}
          >
            #{tag} ({count})
          </Link>
        ))}
      </div>

      <div className="space-y-8">
        {filteredPosts.map((post) => {
          const readingTime = calculateReadingTime(post.content)
          return (
            <article
              key={post.slug}
              className="p-6 bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] hover:border-[var(--accent)] transition-colors"
            >
              <Link to="/blog/$slug" params={{ slug: post.slug }}>
                <h2 className="text-2xl font-semibold mb-2 hover:text-[var(--accent)] transition-colors">
                  {post.title}
                </h2>
              </Link>
              <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm mb-3">
                <time>{post.date}</time>
                <span>•</span>
                <span>{readingTime} min read</span>
              </div>
              <p className="text-[var(--text-dim)]">{post.excerpt}</p>
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      to="/blog"
                      search={{ tag }}
                      className="text-xs px-2 py-1 rounded-full bg-[var(--bg-secondary)] text-[var(--text-dim)] hover:bg-[var(--accent)] hover:text-white transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}
              <Link
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="inline-block mt-4 text-[var(--accent)] hover:underline"
              >
                Read more →
              </Link>
            </article>
          )
        })}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12 text-[var(--text-dim)]">
          <p className="text-6xl mb-4">🐄</p>
          <p>No posts with that tag... try another!</p>
        </div>
      )}
    </div>
  )
}
