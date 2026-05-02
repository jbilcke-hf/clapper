import { NextResponse, NextRequest } from 'next/server'

/**
 * API route to fetch and download a specific community workflow by ID.
 * 
 * GET /api/workflows/:source/:id
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { source: string; id: string } }
) {
  const { source, id } = params

  try {
    switch (source) {
      case 'openart': {
        return await fetchOpenArtWorkflowById(id)
      }
      case 'civitai': {
        return await fetchCivitaiWorkflowById(id)
      }
      default: {
        return NextResponse.json(
          { error: `Unknown source: ${source}` },
          { status: 400 }
        )
      }
    }
  } catch (error) {
    console.error(`Failed to fetch workflow ${id} from ${source}:`, error)
    return NextResponse.json(
      { error: `Failed to fetch workflow` },
      { status: 500 }
    )
  }
}

async function fetchOpenArtWorkflowById(id: string) {
  const url = `https://openart.ai/api/workflows/${id}`
  
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'Clapper/1.0',
    },
  })

  if (!response.ok) {
    throw new Error(`OpenArt API returned ${response.status}`)
  }

  const data = await response.json()

  // Normalize the workflow data
  return NextResponse.json({
    id: data.id || data._id,
    title: data.title || data.name || 'Untitled Workflow',
    description: data.description || '',
    author: data.author || data.user?.username || 'Unknown',
    thumbnailUrl: data.thumbnailUrl || data.thumbnail_url || data.image || '',
    tags: data.tags || [],
    category: data.category || 'image',
    // The actual workflow JSON data (ComfyUI API format)
    workflowData: data.workflow || data.workflow_data || data.graph || data.api_json || null,
    nodeCount: data.node_count || data.nodes?.length || 0,
    source: 'openart',
  })
}

async function fetchCivitaiWorkflowById(id: string) {
  const url = `https://civitai.com/api/v1/models/${id}`
  
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`CivitAI API returned ${response.status}`)
  }

  const data = await response.json()

  return NextResponse.json({
    id: data.id,
    title: data.name || 'Untitled',
    description: data.description || '',
    author: data.creator?.username || data.author?.username || 'Unknown',
    thumbnailUrl: data.images?.[0]?.url || data.thumbnail || '',
    tags: data.tags || [],
    category: data.type || 'checkpoint',
    workflowData: data.workflow || null,
    nodeCount: 0,
    source: 'civitai',
  })
}
