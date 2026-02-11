import * as React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface SeriesCardProps {
  name: string
  description: string
  slug: string
  postCount: number
  category?: string
  lastUpdated?: Date
  className?: string
}

export function SeriesCard({
  name,
  description,
  slug,
  postCount,
  category,
  lastUpdated,
  className
}: SeriesCardProps) {
  return (
    <Card className={cn("group hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 ease-out hover:border-primary/30", className)}>
      <a href={`/series/${slug}`} className="block">
        <CardHeader>
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              {category && (
                <Badge variant="secondary" className="text-xs">
                  {category}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <FileText className="h-3 w-3" />
              <span>{postCount}편</span>
            </div>
          </div>
          <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
            {name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="line-clamp-3">
            {description}
          </CardDescription>
        </CardContent>
        {lastUpdated && (
          <CardFooter className="text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <span>마지막 업데이트:</span>
              <time dateTime={lastUpdated.toISOString()}>
                {lastUpdated.toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
          </CardFooter>
        )}
      </a>
    </Card>
  )
}
