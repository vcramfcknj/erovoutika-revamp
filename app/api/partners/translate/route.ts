import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { translateFields } from '@/lib/translateText'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const lang = searchParams.get('lang') || 'en'
  const type = searchParams.get('type') // industry | academe

  try {
    let query = supabase.from('partners').select('*')

    if (type) {
      query = query.eq('type', type)
    }

    const { data, error } = await query.order('created_at', {
      ascending: false,
    })

    if (error) throw error

    if (lang !== 'en' && data) {
      const translatedPartners = await Promise.all(
        data.map((item) =>
          translateFields(
            item,
            ['name', 'description', 'category'],
            lang
          )
        )
      )

      return NextResponse.json(translatedPartners)
    }

    return NextResponse.json(data || [])
  } catch (error: any) {
    console.error('Error fetching/translating partners:', error)

    return NextResponse.json(
      { error: 'Failed to fetch partners', details: error.message },
      { status: 500 }
    )
  }
}