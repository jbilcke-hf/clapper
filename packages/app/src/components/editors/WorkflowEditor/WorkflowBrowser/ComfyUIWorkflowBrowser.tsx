import { useState, useEffect, useCallback } from 'react'
import { FaSearch, FaTimes, FaDownload, FaImage, FaVideo, FaMusic, FaMicrophone } from 'react-icons/fa'
import { ComfyuiWorkflow } from '../WorkflowViewer/ReactFlowCanvas/formats/comfyui/types'

export type ComfyUIWorkflowCategory = 'image' | 'video' | 'sound' | 'voice' | 'music' | 'all'

export type ComfyUIWorkflowEntry = {
  id: string
  name: string
  description: string
  thumbnail: string
  category: ComfyUIWorkflowCategory
  workflow: ComfyuiWorkflow
  source: 'openart' | 'comfyicu' | 'local' | 'community'
  author?: string
  downloads?: number
  tags?: string[]
}

export function ComfyUIWorkflowBrowser({ onSelect, onClose }: {
  onSelect: (workflow: ComfyuiWorkflow) => void
  onClose: () => void
}) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<ComfyUIWorkflowCategory>('all')
  const [workflows, setWorkflows] = useState<ComfyUIWorkflowEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<ComfyUIWorkflowEntry | null>(null)

  const builtIn: ComfyUIWorkflowEntry[] = [
    { id: 'img-default', name: 'Default Image (SDXL)', description: 'Standard SDXL txt2img', thumbnail: '', category: 'image', workflow: {} as ComfyuiWorkflow, source: 'local', tags: ['sdxl','txt2img'] },
    { id: 'vid-default', name: 'Default Video (AnimateDiff)', description: 'AnimateDiff video from text', thumbnail: '', category: 'video', workflow: {} as ComfyuiWorkflow, source: 'local', tags: ['animatediff','txt2vid'] },
  ]

  useEffect(() => { setWorkflows(builtIn) }, [])

  const handleSearch = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`https://openart.ai/api/v1/workflows?q=${encodeURIComponent(search)}&type=${category}&limit=20`)
      if (res.ok) {
        const data = await res.json()
        const community: ComfyUIWorkflowEntry[] = (data.workflows || []).map((w: any) => ({
          id: w.id, name: w.name, description: w.description || '', thumbnail: w.thumbnail || '',
          category: (w.category || 'image') as ComfyUIWorkflowCategory, workflow: w.workflow || {} as ComfyuiWorkflow,
          source: 'openart' as const, author: w.author, downloads: w.downloads, tags: w.tags || [],
        }))
        setWorkflows([...builtIn, ...community])
      }
    } catch { setWorkflows(builtIn) } finally { setLoading(false) }
  }, [search, category])

  const filtered = workflows.filter(w => {
    if (category !== 'all' && w.category !== category) return false
    if (search) { const q = search.toLowerCase(); return w.name.toLowerCase().includes(q) || w.description.toLowerCase().includes(q) || (w.tags||[]).some(t => t.toLowerCase().includes(q)) }
    return true
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="flex h-[80vh] w-[80vw] max-w-5xl flex-col rounded-lg bg-neutral-900 border border-neutral-700">
        <div className="flex items-center justify-between border-b border-neutral-700 p-4">
          <h2 className="text-lg font-semibold text-neutral-100">ComfyUI Workflow Browser</h2>
          <button onClick={onClose} className="rounded p-2 text-neutral-400 hover:bg-neutral-800"><FaTimes /></button>
        </div>
        <div className="flex gap-2 border-b border-neutral-700 p-4">
          <div className="relative flex-1"><FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input type="text" value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSearch()} placeholder="Search workflows..." className="w-full rounded bg-neutral-800 py-2 pl-10 pr-4 text-sm text-neutral-100" />
          </div>
          <select value={category} onChange={e=>setCategory(e.target.value as ComfyUIWorkflowCategory)} className="rounded bg-neutral-800 px-3 py-2 text-sm text-neutral-100">
            <option value="all">All</option><option value="image">Image</option><option value="video">Video</option><option value="sound">Sound</option><option value="voice">Voice</option><option value="music">Music</option>
          </select>
          <button onClick={handleSearch} className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-500">Search</button>
        </div>
        <div className="flex-1 overflow-auto p-4">
          {loading ? <div className="flex h-full items-center justify-center text-neutral-500">Loading...</div> :
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {filtered.map(w => (
                <div key={w.id} onClick={()=>setSelected(w)} className={`cursor-pointer rounded-lg border p-3 ${selected?.id===w.id?'border-blue-500 bg-blue-950/30':'border-neutral-700 bg-neutral-800 hover:border-neutral-600'}`}>
                  <div className="mb-2 flex h-24 items-center justify-center rounded bg-neutral-900 text-2xl text-neutral-600">{w.category==='image'?<FaImage/>:w.category==='video'?<FaVideo/>:w.category==='music'?<FaMusic/>:<FaMicrophone/>}</div>
                  <div className="text-sm font-medium text-neutral-200">{w.name}</div>
                  <div className="mt-1 text-xs text-neutral-500">{w.description}</div>
                  {w.tags&&w.tags.length>0&&<div className="mt-2 flex flex-wrap gap-1">{w.tags.slice(0,3).map(t=><span key={t} className="rounded bg-neutral-700 px-1.5 py-0.5 text-xs text-neutral-400">{t}</span>)}</div>}
                  <div className="mt-2 text-xs text-neutral-600">{w.source==='openart'?'OpenArt.ai':w.source==='local'?'Built-in':w.source}</div>
                </div>
              ))}
            </div>}
        </div>
        <div className="flex items-center justify-between border-t border-neutral-700 p-4">
          <div className="text-sm text-neutral-500">{selected?`Selected: ${selected.name}`:'Select a workflow'}</div>
          <div className="flex gap-2">
            <button onClick={onClose} className="rounded px-4 py-2 text-sm text-neutral-400 hover:bg-neutral-800">Cancel</button>
            <button onClick={()=>{if(selected){onSelect(selected.workflow);onClose()}}} disabled={!selected} className="flex items-center gap-2 rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-500 disabled:opacity-50"><FaDownload/> Apply</button>
          </div>
        </div>
      </div>
    </div>
  )
}
