import { NextResponse, NextRequest } from 'next/server'

/**
 * API route to fetch community workflows from OpenArt.ai
 * 
 * This provides a server-side proxy to avoid CORS issues
 * and allows searching/browsing public ComfyUI workflows.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q') || ''
  const page = searchParams.get('page') || '1'
  const source = searchParams.get('source') || 'openart'

  try {
    switch (source) {
      case 'openart': {
        return await fetchOpenArtWorkflows(query, page)
      }
      case 'civitai': {
        return await fetchCivitaiWorkflows(query, page)
      }
      default: {
        return await fetchOpenArtWorkflows(query, page)
      }
    }
  } catch (error) {
    console.error(`Failed to fetch ${source} workflows:`, error)
    return NextResponse.json(
      { error: `Failed to fetch workflows from ${source}` },
      { status: 500 }
    )
  }
}

async function fetchOpenArtWorkflows(query: string, page: string) {
  const searchQuery = query || 'trending'
  
  // OpenArt.ai doesn't have a public documented API,
  // so we proxy through their search page
  const url = `https://openart.ai/api/workflows/search?q=${encodeURIComponent(searchQuery)}&page=${page}`
  
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Clapper/1.0',
      },
    })

    if (!response.ok) {
      // Fallback: return empty results if the API isn't available
      console.warn(`OpenArt API returned ${response.status}, returning empty results`)
      return NextResponse.json({ workflows: [], total: 0, page: parseInt(page) })
    }

    const data = await response.json()
    
    // Normalize the response to a common format
    const workflows = (data.workflows || data.results || data.data || []).map((w: any) => ({
      id: w.id || w._id,
      title: w.title || w.name || 'Untitled Workflow',
      description: w.description || '',
      author: w.author || w.user?.username || 'Unknown',
      thumbnailUrl: w.thumbnailUrl || w.thumbnail_url || w.image || '',
      tags: w.tags || [],
      category: w.category || 'image',
      downloadUrl: w.downloadUrl || w.download_url || w.file || '',
      nodeCount: w.node_count || w.nodes?.length || 0,
      likes: w.likes || w.like_count || 0,
      source: 'openart',
    }))

    return NextResponse.json({
      workflows,
      total: data.total || data.total_count || workflows.length,
      page: parseInt(page),
      source: 'openart',
    })
  } catch (error) {
    console.error('Error fetching from OpenArt:', error)
    return NextResponse.json({ workflows: [], total: 0, page: parseInt(page), source: 'openart' })
  }
}

async function fetchCivitaiWorkflows(query: string, page: string) {
  const searchQuery = query || ''
  
  // CivitAI has a public API
  const params = new URLSearchParams()
  if (searchQuery) params.set('query', searchQuery)
  params.set('page', page)
  params.set('limit', '20')
  params.set('types', 'checkpoint,lora,textualinversion')

  const url = `https://civitai.com/api/v1/models?${params.toString()}`

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      console.warn(`CivitAI API returned ${response.status}, returning empty results`)
      return NextResponse.json({ workflows: [], total: 0, page: parseInt(page) })
    }

    const data = await response.json()

    const workflows = (data.items || []).map((item: any) => ({
      id: item.id,
      title: item.name || 'Untitled',
      description: item.description || '',
      author: item.creator?.username || item.author?.username || 'Unknown',
      thumbnailUrl: item.images?.[0]?.url || item.thumbnail || '',
      tags: item.tags || [],
      category: item.type || 'checkpoint',
      downloadUrl: item.downloadUrl || '',
      nodeCount: 0,
      likes: item.stats?.favoriteCount || 0,
      source: 'civitai',
    }))

    return NextResponse.json({
      workflows,
      total: data.totalItems || data.metadata?.totalItems || workflows.length,
      page: parseInt(page),
      source: 'civitai',
    })
  } catch (error) {
    console.error('Error fetching from CivitAI:', error)
    return NextResponse.json({ workflows: [], total: 0, page: parseInt(page), source: 'civitai' })
  }
}
