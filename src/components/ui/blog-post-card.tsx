import * as React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, ClockIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface BlogPostCardProps {
  title: string
  excerpt: string
  date: Date
  slug: string
  categories?: string[]
  tags?: string[]
  readingTime?: string
  className?: string
}

export function BlogPostCard({
  title,
  excerpt,
  date,
  slug,
  categories = [],
  tags = [],
  readingTime,
  className
}: BlogPostCardProps) {
  return (
    <Card className={cn("group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:border-primary/50", className)}>
      <a href={`/${slug}`} className="block">
        <CardHeader>
          <div className="flex items-start justify-between gap-2 mb-2">
            {categories.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {categories[0]}
              </Badge>
            )}
            {readingTime && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <ClockIcon className="h-3 w-3" />
                <span>{readingTime}</span>
              </div>
            )}
          </div>
          <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="line-clamp-3">
            {excerpt}
          </CardDescription>
        </CardContent>
        <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-3.5 w-3.5" />
            <time dateTime={date.toISOString()}>
              {date.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
          {tags.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
              {tags.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{tags.length - 2}
                </Badge>
              )}
            </div>
          )}
        </CardFooter>
      </a>
    </Card>
  )
}
