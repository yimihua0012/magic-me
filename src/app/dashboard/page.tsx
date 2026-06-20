'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import Button from '@/components/ui/button'
import Card from '@/components/ui/card'
import { 
  Camera, 
  Clock, 
  Download, 
  Share2, 
  Trash2,
  Plus,
  Image as ImageIcon,
  ExternalLink
} from 'lucide-react'

interface Generation {
  id: string
  status: 'completed' | 'processing' | 'failed'
  plan_type: string
  style_count: number
  created_at: string
  thumbnail?: string
}

export default function DashboardPage() {
  const [generations, setGenerations] = useState<Generation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchGenerations = async () => {
      try {
        const res = await fetch('/api/generations')
        if (res.ok) {
          const data = await res.json()
          setGenerations(data.generations || [])
        }
      } catch {
        setGenerations([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchGenerations()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Your Headshots</h1>
              <p className="text-slate-600 mt-1">Manage and download your AI-generated headshots</p>
            </div>
            <Link href="/upload">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Generation
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="p-4 animate-pulse">
                  <div className="aspect-square bg-slate-200 rounded-xl mb-4" />
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </Card>
              ))}
            </div>
          ) : generations.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-8 h-8 text-slate-400" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">No headshots yet</h2>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Upload a selfie and let our AI create professional headshots for you in just 3 minutes.
              </p>
              <Link href="/upload">
                <Button>
                  <Camera className="w-4 h-4 mr-2" />
                  Generate Your First Headshots
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generations.map((gen) => (
                <Card key={gen.id} className="overflow-hidden group">
                  <div className="aspect-square bg-slate-200 relative">
                    {gen.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={gen.thumbnail}
                        alt="Headshot"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Camera className="w-12 h-12 text-slate-400" />
                      </div>
                    )}
                    
                    {gen.status === 'processing' && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-2" />
                          <span className="text-sm">Processing...</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <Link href={`/generate/${gen.id}`}>
                        <Button size="sm" className="bg-white text-slate-900 hover:bg-white">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button size="sm" variant="ghost" className="bg-white/90 text-slate-900 hover:bg-white">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                        gen.status === 'completed' 
                          ? 'bg-accent-100 text-accent-700' 
                          : gen.status === 'processing'
                          ? 'bg-primary-100 text-primary-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {gen.status === 'completed' && <><span className="w-1.5 h-1.5 bg-accent-500 rounded-full" /> Completed</>}
                        {gen.status === 'processing' && <><span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse" /> Processing</>}
                        {gen.status === 'failed' && <><span className="w-1.5 h-1.5 bg-red-500 rounded-full" /> Failed</>}
                      </span>
                      <span className="text-xs text-slate-500">{gen.style_count} styles</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDate(gen.created_at)}
                      </span>
                      <div className="flex gap-1">
                        <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                          <Download className="w-4 h-4 text-slate-600" />
                        </button>
                        <button className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {generations.length > 0 && (
            <div className="mt-8 text-center">
              <Link href="/upload">
                <Button variant="secondary">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Generation
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
