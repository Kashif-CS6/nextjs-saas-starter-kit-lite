'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@kit/supabase/hooks/use-supabase'
import { useAuth } from '~/lib/supabase/hooks/use-auth'
import { z } from 'zod'

const postSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters'),
  body: z.string()
    .min(1, 'Content is required')
    .min(10, 'Content must be at least 10 characters')
})

export default function CreatePostPage() {
  const router = useRouter()
  const client = useSupabase()
  const { user: authUser } = useAuth()
  
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [directUser, setDirectUser] = useState<any>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    let mounted = true

    async function syncSession() {
      try {
        const { data: { session } } = await client.auth.getSession()
        const { data: { user } } = await client.auth.getUser()
        
        if (mounted) {
          const foundUser = session?.user || user
          setDirectUser(foundUser || null)
          
          if (foundUser) {
            setAuthLoading(false)
            return
          }
          
          if (authUser) {
            setAuthLoading(false)
            return
          }
          
          setAuthLoading(false)
        }
      } catch (error) {
        console.error('Session sync error:', error)
        if (mounted) {
          setAuthLoading(false)
        }
      }
    }

    syncSession()

    const { data: { subscription } } = client.auth.onAuthStateChange(
      (event, session) => {
        if (mounted && session?.user) {
          setDirectUser(session.user)
          setAuthLoading(false)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [client, authUser])

  const user = authUser || directUser

  useEffect(() => {
    if (user && authLoading) {
      setAuthLoading(false)
    }
  }, [user, authLoading])

  useEffect(() => {
    const timeoutTimer = setTimeout(() => {
      if (authLoading) {
        setAuthLoading(false)
      }
    }, 10000)

    return () => clearTimeout(timeoutTimer)
  }, [authLoading])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})
    setLoading(true)

    const validation = postSchema.safeParse({ title, body })
    
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {}
      validation.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message
      })
      setErrors(fieldErrors)
      setLoading(false)
      return
    }

    if (!user) {
      setErrors({ submit: 'You must be logged in to create a post' })
      setLoading(false)
      return
    }

    try {
      const { data, error } = await client
        .from('blog_posts')
        .insert({
          title: title.trim(),
          body: body.trim(),
          author_id: user.id,
          author_name: user.email?.split('@')[0] || user.user_metadata?.name || 'Anonymous',
          published_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      
      router.push(`/blog/${data.id}`)
      router.refresh()
    } catch (error: any) {
      console.error('Error creating post:', error)
      setErrors({ 
        submit: error.message || 'Failed to create post.' 
      })
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
          <h1 className="text-xl font-semibold text-gray-700">Loading...</h1>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-3">Authentication Required</h1>
          <p className="text-gray-600 mb-6">
            Please sign in to create a blog post.
          </p>
          <button 
            onClick={() => router.push('/auth/sign-in')}
            className="px-5 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Blog Post</h1>
        <p className="text-gray-600 mt-2">Share your thoughts and knowledge with the community</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {errors.submit}
          </div>
        )}
        
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            placeholder="Enter a compelling title for your post"
            disabled={loading}
          />
          {errors.title && (
            <p className="mt-2 text-sm text-red-600">
              {errors.title}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {title.length}/255 characters
          </p>
        </div>
        
        <div>
          <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-h-[300px] resize-y ${
              errors.body ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            placeholder="Write your blog post here..."
            disabled={loading}
          />
          {errors.body && (
            <p className="mt-2 text-sm text-red-600">
              {errors.body}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {body.length} characters (minimum 10 required)
          </p>
        </div>
        
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Publishing...
              </>
            ) : (
              'Publish Post'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}