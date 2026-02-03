import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import React, { useState } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/themes/prism-tomorrow.css'
import { posts } from '../posts'
import { calculateReadingTime, extractHeadings } from '../blog-utils'

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

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 px-2 py-1 text-xs rounded bg-[var(--bg-secondary)] hover:bg-[var(--accent)] hover:text-white transition-colors"
      title="Copy code"
    >
      {copied ? '✓ Copied!' : 'Copy'}
    </button>
  )
}

function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false)

  const shareUrl = typeof window !== 'undefined' ? window.location.href : url
  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedTitle = encodeURIComponent(title)

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-3 mt-6">
      <span className="text-sm text-[var(--text-muted)]">Share:</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors"
        title="Share on Twitter"
      >
        𝕏
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors"
        title="Share on LinkedIn"
      >
        in
      </a>
      <button
        onClick={copyLink}
        className="text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors"
        title="Copy link"
      >
        {copied ? '✓' : '🔗'}
      </button>
    </div>
  )
}

function TableOfContents({
  headings,
}: {
  headings: Array<{ level: number; text: string; id: string }>
}) {
  if (headings.length < 3) return null

  return (
    <nav className="bg-[var(--bg-secondary)] rounded-lg p-4 mb-8">
      <h4 className="font-semibold mb-2 text-sm">Table of Contents</h4>
      <ul className="space-y-1 text-sm">
        {headings
          .filter((h) => h.level <= 2)
          .map((heading, i) => (
            <li key={i} className={heading.level === 2 ? 'ml-0' : 'ml-4'}>
              <a
                href={`#${heading.id}`}
                className="text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors"
              >
                {heading.text}
              </a>
            </li>
          ))}
      </ul>
    </nav>
  )
}

function BlogPost() {
  const post = Route.useLoaderData() as {
    slug: string
    title: string
    date: string
    tags?: string[]
    excerpt: string
    content: string
  }

  const readingTime = calculateReadingTime(post.content)
  const headings = extractHeadings(post.content)

  // Prism highlighting is now done inline in renderContent

  // Simple markdown-ish rendering (headers, bold, italic, lists, code blocks)
  const renderContent = (content: string) => {
    const lines = content.trim().split('\n')
    const elements: React.ReactElement[] = []
    let listItems: string[] = []
    let codeBlock: string[] = []
    let inCodeBlock = false
    let codeLanguage = ''
    let tableRows: string[][] = []
    let tableHeader: string[] | null = null

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

    const flushTable = () => {
      if (tableHeader || tableRows.length > 0) {
        elements.push(
          <div key={`table-${elements.length}`} className="my-6 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              {tableHeader && (
                <thead>
                  <tr className="border-b-2 border-[var(--border)]">
                    {tableHeader.map((cell, ci) => (
                      <th
                        key={ci}
                        className="text-left py-2 px-3 font-semibold text-[var(--text-primary)]"
                      >
                        {formatInline(cell)}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {tableRows.map((row, ri) => (
                  <tr key={ri} className="border-b border-[var(--border)]">
                    {row.map((cell, ci) => (
                      <td key={ci} className="py-2 px-3 text-[var(--text-dim)]">
                        {formatInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
        tableHeader = null
        tableRows = []
      }
    }

    const flushCodeBlock = () => {
      if (codeBlock.length > 0) {
        const code = codeBlock.join('\n')
        const langClass = codeLanguage ? `language-${codeLanguage}` : 'language-text'
        // Pre-highlight the code with Prism
        const grammar = codeLanguage && Prism.languages[codeLanguage]
        const highlighted = grammar ? Prism.highlight(code, grammar, codeLanguage) : code
        elements.push(
          <div key={`code-${elements.length}`} className="relative my-4">
            <CopyButton code={code} />
            <pre className="bg-[#2d2d2d] border border-[var(--border)] rounded-lg p-4 overflow-x-auto">
              <code
                className={`text-sm font-mono ${langClass}`}
                dangerouslySetInnerHTML={{ __html: highlighted }}
              />
            </pre>
          </div>
        )
        codeBlock = []
        codeLanguage = ''
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

    const makeHeadingId = (text: string) =>
      text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

    lines.forEach((line, i) => {
      // Code block fence
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          flushCodeBlock()
          inCodeBlock = false
        } else {
          flushList()
          inCodeBlock = true
          codeLanguage = line.trim().slice(3).trim()
        }
        return
      }

      // Inside code block
      if (inCodeBlock) {
        codeBlock.push(line)
        return
      }

      // Image
      const imageMatch = line.trim().match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
      if (imageMatch) {
        flushList()
        flushTable()
        elements.push(
          <figure key={i} className="my-6">
            <img
              src={imageMatch[2]}
              alt={imageMatch[1]}
              className="rounded-lg border border-[var(--border)] w-full"
            />
            {imageMatch[1] && (
              <figcaption className="text-center text-sm text-[var(--text-muted)] mt-2">
                {imageMatch[1]}
              </figcaption>
            )}
          </figure>
        )
        return
      }

      const trimmed = line.trim()

      // Empty line
      if (!trimmed) {
        flushList()
        flushTable()
        return
      }

      // Horizontal rule
      if (trimmed === '---') {
        flushList()
        flushTable()
        elements.push(<hr key={i} className="my-8 border-[var(--border)]" />)
        return
      }

      // H1
      if (trimmed.startsWith('# ')) {
        flushList()
        flushTable()
        const text = trimmed.slice(2)
        elements.push(
          <h1 key={i} id={makeHeadingId(text)} className="text-3xl font-bold mt-8 mb-4">
            {text}
          </h1>
        )
        return
      }

      // H2
      if (trimmed.startsWith('## ')) {
        flushList()
        flushTable()
        const text = trimmed.slice(3)
        elements.push(
          <h2 key={i} id={makeHeadingId(text)} className="text-2xl font-semibold mt-8 mb-3">
            {text}
          </h2>
        )
        return
      }

      // H3
      if (trimmed.startsWith('### ')) {
        flushList()
        flushTable()
        const text = trimmed.slice(4)
        elements.push(
          <h3 key={i} id={makeHeadingId(text)} className="text-xl font-semibold mt-6 mb-2">
            {text}
          </h3>
        )
        return
      }

      // Table row (simple support)
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        // Skip separator rows (|---|---|)
        if (/^\|[\s\-:|]+\|$/.test(trimmed)) return

        const cells = trimmed
          .slice(1, -1)
          .split('|')
          .map((c) => c.trim())

        // First row is header
        if (!tableHeader && tableRows.length === 0) {
          tableHeader = cells
        } else {
          tableRows.push(cells)
        }
        return
      }

      // List item
      if (trimmed.startsWith('- ')) {
        flushTable()
        listItems.push(trimmed.slice(2))
        return
      }

      // Regular paragraph
      flushList()
      flushTable()
      elements.push(
        <p key={i} className="text-[var(--text-dim)] my-4 leading-relaxed">
          {formatInline(trimmed)}
        </p>
      )
    })

    flushList()
    flushTable()
    flushCodeBlock()
    return elements
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link
        to="/blog"
        search={{ tag: undefined }}
        className="text-[var(--accent)] hover:underline mb-8 inline-block"
      >
        ← Back to blog
      </Link>

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--text-muted)]">
          <time>{post.date}</time>
          <span>•</span>
          <span>{readingTime} min read</span>
        </div>
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
      </header>

      {/* Table of Contents */}
      <TableOfContents headings={headings} />

      {/* Content */}
      <article className="prose-custom">{renderContent(post.content)}</article>

      {/* Share */}
      <ShareButtons title={post.title} url={`https://maudeco.de/blog/${post.slug}`} />

      <div className="mt-12 pt-8 border-t border-[var(--border)]">
        <Link
          to="/blog"
          search={{ tag: undefined }}
          className="text-[var(--accent)] hover:underline"
        >
          ← Back to all posts
        </Link>
      </div>
    </div>
  )
}
