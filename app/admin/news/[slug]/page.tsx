import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Calendar, Tag, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type Props = {
  params: Promise<{ slug: string }>
}

async function getNewsArticle(slug: string) {
  console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log('Has ANON_KEY:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  
  const supabase = await createClient()
  // ... rest of code
  
  console.log('Looking for article with slug:', slug)
  
  // Try to find by slug first
  let { data, error } = await supabase
    .from('news_updates')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  console.log('Result by slug:', { data, error })

  // If not found by slug, try by ID
  if (!data) {
    console.log('Not found by slug, trying by ID...')
    const result = await supabase
      .from('news_updates')
      .select('*')
      .eq('id', slug)
      .maybeSingle()
    
    data = result.data
    error = result.error
    console.log('Result by ID:', { data, error })
  }

  if (error) {
    console.error('Supabase error:', error)
  }

  return data
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params
  console.log('Page slug param:', slug)
  
  const article = await getNewsArticle(slug)

  if (!article) {
    console.log('Article not found, showing 404')
    notFound()
  }

  console.log('Article found:', article.title)

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <Link 
            href="/#news"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to News
          </Link>
        </div>
      </div>

      {/* Article */}
      <article className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-medium border border-blue-100">
                <Tag className="w-3.5 h-3.5" />
                {article.category}
              </span>
              <span className="inline-flex items-center gap-1.5 text-gray-500">
                <Calendar className="w-4 h-4" />
                {new Date(article.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {article.title}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              {article.excerpt}
            </p>
          </div>

          {/* Featured Image */}
          {article.image_url && (
            <div className="relative h-96 bg-gray-200 rounded-2xl overflow-hidden mb-12">
              <Image
                src={article.image_url}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              {article.content ? (
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {article.content}
                </div>
              ) : (
                <p className="text-gray-500 italic">No additional content available.</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link 
              href="/#news"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all news
            </Link>
          </div>
        </div>
      </article>
    </main>
  )
}