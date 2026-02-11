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
    <div className="bg-card/50 border rounded-lg overflow-hidden my-8 shadow-sm">
      <div 
        className="flex justify-between items-center gap-4 px-5 py-4 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="p-2 bg-primary/10 rounded-md shrink-0">
            <BookOpen className="text-primary w-5 h-5" />
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">시리즈</span>
              <a
                href={`/series/${seriesSlug}`}
                className="text-base font-bold text-foreground hover:text-primary transition-colors no-underline truncate"
                onClick={(e) => e.stopPropagation()}
              >
                {seriesName}
              </a>
            </div>
            <span className="text-xs text-muted-foreground">
              총 {posts.length}편의 글
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <a
            href={`/series/${seriesSlug}`}
            className="hidden sm:flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors bg-background border px-2 py-1 rounded-md"
            onClick={(e) => e.stopPropagation()}
          >
            전체보기
            <ChevronRight size={12} />
          </a>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground rounded-md transition-colors hover:bg-muted"
            aria-label={isExpanded ? "시리즈 목록 접기" : "시리즈 목록 펼치기"}
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-2 border-t bg-card">
          <div className="flex flex-col gap-1 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
            {posts.map((post, index) => {
              const isCurrent = post.id === currentPostId
              const postUrl = `/${post.id}`

              return (
                <a
                  key={post.id}
                  href={postUrl}
                  className={cn(
                    "flex items-center gap-3 p-2.5 rounded-md no-underline transition-all group",
                    isCurrent
                      ? "bg-primary/5 hover:bg-primary/10"
                      : "hover:bg-muted"
                  )}
                  aria-current={isCurrent ? "page" : undefined}
                >
                  <div className={cn(
                    "flex items-center justify-center w-6 h-6 rounded text-xs font-semibold flex-shrink-0 transition-all",
                    isCurrent
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground group-hover:bg-muted-foreground/20"
                  )}>
                    {index + 1}
                  </div>
                  <div className={cn(
                    "text-sm flex-1 min-w-0 truncate transition-colors",
                    isCurrent
                      ? "font-semibold text-primary"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}>
                    {post.title}
                  </div>
                  {isCurrent && (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 ml-2 animate-pulse" />
                  )}
                </a>
              )
            })}
          </div>
          <div className="py-2 px-3 border-t mt-1 text-center sm:hidden">
            <a
              href={`/series/${seriesSlug}`}
              className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1"
            >
              시리즈 전체보기
              <ChevronRight size={12} />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
