import * as React from "react"
import { BlogPostCard } from "@/components/ui/blog-post-card"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import type { CollectionEntry } from 'astro:content'
import { calculateReadingTime } from '@/utils/readingTime'

interface SeriesPostListProps {
  posts: CollectionEntry<'blog'>[]
}

type SortOrder = 'order' | 'date-asc' | 'date-desc'

export function SeriesPostList({ posts }: SeriesPostListProps) {
  const [sortOrder, setSortOrder] = React.useState<SortOrder>('order')

  const sortedPosts = React.useMemo(() => {
    const postsCopy = [...posts]

    switch (sortOrder) {
      case 'date-asc':
        return postsCopy.sort((a, b) => a.data.date.getTime() - b.data.date.getTime())
      case 'date-desc':
        return postsCopy.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
      case 'order':
      default:
        return postsCopy.sort((a, b) =>
          (a.data.series?.order || 0) - (b.data.series?.order || 0)
        )
    }
  }, [posts, sortOrder])

  const getSortIcon = () => {
    if (sortOrder === 'date-asc') return <ArrowUp className="h-4 w-4" />
    if (sortOrder === 'date-desc') return <ArrowDown className="h-4 w-4" />
    return <ArrowUpDown className="h-4 w-4" />
  }

  const getSortLabel = () => {
    if (sortOrder === 'date-asc') return '작성일 오름차순'
    if (sortOrder === 'date-desc') return '작성일 내림차순'
    return '시리즈 순서'
  }

  const handleSortChange = () => {
    if (sortOrder === 'order') setSortOrder('date-desc')
    else if (sortOrder === 'date-desc') setSortOrder('date-asc')
    else setSortOrder('order')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">전체 포스트</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSortChange}
          className="gap-2"
        >
          {getSortIcon()}
          <span className="hidden sm:inline">{getSortLabel()}</span>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedPosts.map((post, index) => {
          const originalIndex = posts.findIndex(p => p.id === post.id)
          const displayOrder = sortOrder === 'order' ? index + 1 : (post.data.series?.order || originalIndex + 1)

          return (
            <div key={post.id} className="relative">
              {/* Series Order Badge */}
              <div className="absolute -left-2 -top-2 z-10">
                <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shadow-md">
                  {displayOrder}
                </div>
              </div>

              <BlogPostCard
                title={post.data.title}
                excerpt={post.data.excerpt}
                date={post.data.date}
                slug={post.id}
                categories={post.data.categories}
                tags={post.data.tags}
                readingTime={post.body ? calculateReadingTime(post.body) : '1분'}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
