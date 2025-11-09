import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

export interface Heading {
  depth: number
  slug: string
  text: string
}

interface TableOfContentsProps {
  headings: Heading[]
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = React.useState<string>('')
  const [isUserScrolling, setIsUserScrolling] = React.useState(false)
  const scrollTimeoutRef = React.useRef<number | null>(null)

  // Filter headings (h2, h3 only)
  const filteredHeadings = React.useMemo(
    () => headings.filter(h => h.depth >= 2 && h.depth <= 3),
    [headings]
  )

  React.useEffect(() => {
    if (filteredHeadings.length === 0) return

    const headingElements = filteredHeadings.map(h =>
      document.getElementById(h.slug)
    ).filter(Boolean) as HTMLElement[]

    if (headingElements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Ignore during user-initiated scrolling
        if (isUserScrolling) return

        const visibleEntries = entries.filter(entry => entry.isIntersecting)
        if (visibleEntries.length > 0) {
          const mostVisible = visibleEntries.reduce((prev, current) =>
            current.intersectionRatio > prev.intersectionRatio ? current : prev
          )
          setActiveId(mostVisible.target.id)
        }
      },
      {
        rootMargin: '-100px 0px -66% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    )

    headingElements.forEach(element => observer.observe(element))

    return () => observer.disconnect()
  }, [filteredHeadings, isUserScrolling])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    e.preventDefault()

    // Set user scrolling flag
    setIsUserScrolling(true)

    // Update active immediately
    setActiveId(slug)

    // Scroll to heading
    const element = document.getElementById(slug)
    if (element) {
      const headerOffset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })

      // Clear previous timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }

      // Reset flag after scroll completes
      scrollTimeoutRef.current = window.setTimeout(() => {
        setIsUserScrolling(false)
      }, 1000)
    }
  }

  if (filteredHeadings.length === 0) {
    return null
  }

  return (
    <Card className="sticky top-24 max-h-[calc(100vh-8rem)] border-border/40 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <CardHeader className="pb-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          목차
        </h2>
      </CardHeader>
      <CardContent className="p-0 pb-4">
        <ScrollArea className="h-[calc(100vh-14rem)] px-4">
          <ul className="space-y-1">
            {filteredHeadings.map((heading) => (
              <li
                key={heading.slug}
                className={cn(
                  "transition-all",
                  heading.depth === 3 && "pl-4"
                )}
              >
                <a
                  href={`#${heading.slug}`}
                  onClick={(e) => handleClick(e, heading.slug)}
                  className={cn(
                    "group relative block px-3 py-1.5 text-sm rounded-md transition-all",
                    "hover:bg-accent hover:text-accent-foreground",
                    activeId === heading.slug
                      ? "text-primary font-medium bg-accent/50"
                      : "text-muted-foreground"
                  )}
                >
                  <span className="relative z-10">{heading.text}</span>
                  {activeId === heading.slug && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-full bg-primary rounded-full transition-all" />
                  )}
                </a>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
