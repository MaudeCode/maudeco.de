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

  // Simple markdown-ish rendering (headers, bold, italic, lists, code blocks)
  const renderContent = (content: string) => {
    const lines = content.trim().split('\n')
    const elements: React.ReactElement[] = []
    let listItems: string[] = []
    let codeBlock: string[] = []
    let inCodeBlock = false

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

    const flushCodeBlock = () => {
      if (codeBlock.length > 0) {
        elements.push(
          <pre
            key={`code-${elements.length}`}
            className="bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg p-4 my-4 overflow-x-auto"
          >
            <code className="text-sm font-mono text-[var(--text-dim)]">{codeBlock.join('\n')}</code>
          </pre>
        )
        codeBlock = []
      }
    }

    const formatInline = (text: string) => {
      // Inline code
      text = text.replace(
        /`([^`]+)`/g,
        '<code class="bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded text-sm font-mono">$1</code>'
      )
      // Bold
      text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Italic
      text = text.replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Links
      text = text.replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" class="text-[var(--accent)] hover:underline" target="_blank" rel="noopener noreferrer">$1</a>'
      )
      return <span dangerouslySetInnerHTML={{ __html: text }} />
    }

    lines.forEach((line, i) => {
      // Code block fence
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          flushCodeBlock()
          inCodeBlock = false
        } else {
          flushList()
          inCodeBlock = true
        }
        return
      }

      // Inside code block
      if (inCodeBlock) {
        codeBlock.push(line)
        return
      }

      const trimmed = line.trim()

      // Empty line
      if (!trimmed) {
        flushList()
        return
      }

      // Horizontal rule
      if (trimmed === '---') {
        flushList()
        elements.push(<hr key={i} className="my-8 border-[var(--border)]" />)
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

      // Table row (simple support)
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        // Skip separator rows
        if (trimmed.includes('---')) return

        const cells = trimmed
          .slice(1, -1)
          .split('|')
          .map((c) => c.trim())
        const isHeader =
          elements.length > 0 &&
          lines[i - 1]?.trim().startsWith('|') &&
          !lines[i - 2]?.trim().startsWith('|')

        if (isHeader || (i > 0 && lines[i - 1]?.includes('---'))) {
          // This might be header or first data row after separator
        }

        elements.push(
          <div
            key={i}
            className="grid grid-cols-2 gap-4 py-2 border-b border-[var(--border)] text-[var(--text-dim)]"
          >
            {cells.map((cell, ci) => (
              <div key={ci} className={ci === 0 ? 'font-medium' : ''}>
                {formatInline(cell)}
              </div>
            ))}
          </div>
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
    flushCodeBlock()
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
