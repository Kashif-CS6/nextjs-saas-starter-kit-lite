'use client'

import { useState, useEffect } from 'react'
import { supabase } from '~/lib/supabase/client'
import Link from 'next/link'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  author_name: string
  published_at: string
}

export default function BlogPostList() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const postsPerPage = 5

  useEffect(() => {
    fetchPosts()
  }, [page])

  async function fetchPosts() {
    try {
      setLoading(true)
      const from = (page - 1) * postsPerPage
      const to = from + postsPerPage - 1

      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false })
        .range(from, to)

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
      // Fallback: show some mock data for testing
      setPosts([
        {
          id: '1',
          title: 'Welcome to Our Blog',
          excerpt: 'This is the first post on our amazing new blog platform...',
          author_name: 'Admin',
          published_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Getting Started with Next.js',
          excerpt: 'Next.js is a React framework that enables server-side rendering...',
          author_name: 'Developer',
          published_at: new Date().toISOString()
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <BlogListSkeleton />

  return (
    <div className="space-y-6">
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-2">No blog posts yet.</p>
          <p className="text-gray-500 text-sm">Be the first to create one!</p>
        </div>
      ) : (
        <>
          {posts.map((post) => (
            <article key={post.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
              <Link href={`/blog/${post.id}`} className="block">
                <h2 className="text-2xl font-bold mb-3 hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {post.excerpt}...
                </p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span className="font-medium">By {post.author_name}</span>
                  <time dateTime={post.published_at}>
                    {new Date(post.published_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </time>
                </div>
              </Link>
            </article>
          ))}
          
          {/* Pagination */}
          <div className="flex justify-center items-center space-x-4 mt-8">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page <span className="font-semibold">{page}</span>
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={posts.length < postsPerPage}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function BlogListSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border rounded-lg p-6 animate-pulse">
          <div className="h-7 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  )
}