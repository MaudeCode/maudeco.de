import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import React from 'react'
import { posts } from '../posts'

export const Route = createFileRoute('/blog/$slug')({
  component: BlogPost,
  loader: ({ params }) => {
    const post = posts.find((p) => p.slug === params.slug)
    if (!post) {
      throw notFound()
    }
    return post
  },
})

function BlogPost() {
  const post = Route.useLoaderData()

  // Simple markdown-ish rendering (headers, bold, italic, lists)
  const renderContent = (content: string) => {
    const lines = content.trim().split('\n')
    const elements: React.ReactElement[] = []
    let listItems: string[] = []

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul
            key={`list-${elements.length}`}
            className="list-disc list-inside space-y-1 my-4 text-[var(--text-dim)]"
          >
            {listItems.map((item, i) => (
              <li key={i}>{formatInline(item)}</li>
            ))}
          </ul>
        )
        listItems = []
      }
    }

    const formatInline = (text: string) => {
      // Bold
      text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Italic
      text = text.replace(/\*(.+?)\*/g, '<em>$1</em>')
      return <span dangerouslySetInnerHTML={{ __html: text }} />
    }

    lines.forEach((line, i) => {
      const trimmed = line.trim()

      // Empty line
      if (!trimmed) {
        flushList()
        return
      }

      // H1
      if (trimmed.startsWith('# ')) {
        flushList()
        elements.push(
          <h1 key={i} className="text-3xl font-bold mt-8 mb-4">
            {trimmed.slice(2)}
          </h1>
        )
        return
      }

      // H2
      if (trimmed.startsWith('## ')) {
        flushList()
        elements.push(
          <h2 key={i} className="text-2xl font-semibold mt-8 mb-3">
            {trimmed.slice(3)}
          </h2>
        )
        return
      }

      // H3
      if (trimmed.startsWith('### ')) {
        flushList()
        elements.push(
          <h3 key={i} className="text-xl font-semibold mt-6 mb-2">
            {trimmed.slice(4)}
          </h3>
        )
        return
      }

      // List item
      if (trimmed.startsWith('- ')) {
        listItems.push(trimmed.slice(2))
        return
      }

      // Regular paragraph
      flushList()
      elements.push(
        <p key={i} className="text-[var(--text-dim)] my-4 leading-relaxed">
          {formatInline(trimmed)}
        </p>
      )
    })

    flushList()
    return elements
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link to="/blog" className="text-[var(--accent)] hover:underline mb-8 inline-block">
        ← Back to blog
      </Link>

      <article className="prose-custom">{renderContent(post.content)}</article>

      <div className="mt-12 pt-8 border-t border-[var(--border)]">
        <Link to="/blog" className="text-[var(--accent)] hover:underline">
          ← Back to all posts
        </Link>
      </div>
    </div>
  )
}
