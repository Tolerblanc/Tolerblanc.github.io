import * as React from "react"
import { BookOpen, ChevronRight, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface SeriesNavigationProps {
  seriesName: string
  seriesSlug: string
  posts: Array<{
    id: string
    title: string
    order: number
  }>
  currentPostId: string
}

export function SeriesNavigation({
  seriesName,
  seriesSlug,
  posts,
  currentPostId
}: SeriesNavigationProps) {
  const [isExpanded, setIsExpanded] = React.useState(true)

  return (
    <div className="bg-card border rounded-lg p-6 my-8">
      <div className="flex justify-between items-start gap-4 pb-4 border-b">
        <div className="flex items-start gap-3 flex-1">
          <BookOpen className="text-primary flex-shrink-0 mt-0.5" size={20} />
          <div className="flex flex-col gap-1">
            <a
              href={`/series/${seriesSlug}`}
              className="text-lg font-bold text-foreground hover:text-primary transition-colors no-underline"
            >
              {seriesName}
            </a>
            <span className="text-sm text-muted-foreground">
              {posts.length}편의 시리즈
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`/series/${seriesSlug}`}
            className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-all whitespace-nowrap no-underline"
          >
            전체보기
            <ChevronRight size={16} />
          </a>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center w-8 h-8 bg-secondary hover:bg-secondary/80 text-foreground hover:text-primary rounded-md transition-all"
            aria-label={isExpanded ? "시리즈 목록 접기" : "시리즈 목록 펼치기"}
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="flex flex-col gap-2 mt-5">
          {posts.map((post, index) => {
            const isCurrent = post.id === currentPostId
            const postUrl = `/${post.id}`

            return (
              <a
                key={post.id}
                href={postUrl}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-md no-underline transition-all border",
                  isCurrent
                    ? "bg-primary border-primary"
                    : "border-transparent hover:bg-secondary hover:border-border"
                )}
                aria-current={isCurrent ? "page" : undefined}
              >
                <div className={cn(
                  "flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold flex-shrink-0 transition-all",
                  isCurrent
                    ? "bg-background text-primary"
                    : "bg-secondary text-muted-foreground"
                )}>
                  {index + 1}
                </div>
                <div className="flex items-center justify-between gap-3 flex-1 min-w-0">
                  <div className={cn(
                    "text-sm font-medium overflow-hidden text-ellipsis whitespace-nowrap transition-colors",
                    isCurrent
                      ? "text-primary-foreground font-bold"
                      : "text-foreground group-hover:text-primary"
                  )}>
                    {post.title}
                  </div>
                  {isCurrent && (
                    <div className="text-xs font-semibold text-primary-foreground bg-primary-foreground/20 px-2 py-1 rounded-sm flex-shrink-0">
                      현재 글
                    </div>
                  )}
                </div>
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
