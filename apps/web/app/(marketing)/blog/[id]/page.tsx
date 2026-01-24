import { createClient } from '~/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface BlogPostPageProps {
  params: Promise<{ id: string }>
}

export const revalidate = 60

async function getPost(id: string) {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return null
    }
    
    return data
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = await params
  const post = await getPost(id)

  if (!post) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <nav className="mb-8">
        <Link 
          href="/blog" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Blog
        </Link>
      </nav>
      
      <article className="bg-white rounded-lg shadow-sm p-6 md:p-8">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-gray-600 pb-6 border-b">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-600 font-semibold">
                  {post.author_name?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <div>
                <p className="font-medium">{post.author_name || 'Anonymous'}</p>
                <p className="text-sm">
                  Published on {new Date(post.published_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
            
            <div className="text-sm text-gray-500">
              <span>Updated: </span>
              <time dateTime={post.updated_at}>
                {new Date(post.updated_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </time>
            </div>
          </div>
        </header>
        
        <div className="prose prose-lg max-w-none">
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-lg">
            {post.body}
          </div>
        </div>
      </article>
    </div>
  )
}