import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { PinIcon, XIcon, HomeIcon, ClockIcon, FolderIcon } from "lucide-react"

interface Post {
  slug: string
  title: string
  date: Date
}

interface Category {
  id: string
  name: string
  path: string
  postCount: number
}

interface CategoryGroup {
  name: string
  totalPosts: number
  children: Category[]
}

interface BlogSidebarProps {
  recentPosts: Post[]
  categoryGroups: CategoryGroup[]
  currentCategory?: string | null
}

type SidebarMode = 'fixed' | 'floating' | 'collapsed'

interface SidebarState {
  mode: SidebarMode
  sections: {
    'recent-posts': boolean
    'categories': boolean
  }
}

const STORAGE_KEY = 'sidebar-state'

export function BlogSidebar({ recentPosts, categoryGroups, currentCategory }: BlogSidebarProps) {
  const [state, setState] = React.useState<SidebarState>({
    mode: 'fixed',
    sections: {
      'recent-posts': true,
      'categories': true,
    },
  })
  const [mounted, setMounted] = React.useState(false)

  // Load state from localStorage
  React.useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setState(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load sidebar state:', e)
      }
    }
  }, [])

  // Save state to localStorage
  React.useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    }
  }, [state, mounted])

  const togglePin = () => {
    if (state.mode === 'collapsed') return
    setState(prev => ({
      ...prev,
      mode: prev.mode === 'fixed' ? 'floating' : 'fixed'
    }))
  }

  const closeSidebar = () => {
    setState(prev => ({ ...prev, mode: 'collapsed' }))
  }

  const openSidebar = () => {
    setState(prev => ({ ...prev, mode: 'fixed' }))
  }

  // Accordion values
  const accordionValue = React.useMemo(() => {
    const values: string[] = []
    if (state.sections['recent-posts']) values.push('recent-posts')
    if (state.sections['categories']) values.push('categories')
    return values
  }, [state.sections])

  const handleAccordionChange = (value: string[]) => {
    setState(prev => ({
      ...prev,
      sections: {
        'recent-posts': value.includes('recent-posts'),
        'categories': value.includes('categories'),
      }
    }))
  }

  if (!mounted) {
    return null // Prevent hydration mismatch
  }

  return (
    <>
      {/* Sidebar Open Button (visible when collapsed) */}
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "fixed left-4 top-20 z-50 transition-opacity duration-300",
          state.mode === 'collapsed' ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}
        onClick={openSidebar}
        aria-label="사이드바 열기"
      >
        <FolderIcon className="h-5 w-5" />
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 bottom-0 z-40 transition-transform duration-300",
          "w-[280px] border-r bg-background",
          state.mode === 'collapsed' && "-translate-x-full",
          state.mode === 'floating' && "shadow-xl z-50"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <a
              href="/"
              className="flex items-center gap-2 text-lg font-bold hover:text-primary transition-colors"
            >
              <HomeIcon className="h-5 w-5" />
              <span>Tolerblanc's Blog</span>
            </a>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={togglePin}
                aria-label="사이드바 고정 토글"
                title={state.mode === 'fixed' ? "플로팅 모드로 전환" : "고정 모드로 전환"}
              >
                <PinIcon
                  className={cn(
                    "h-4 w-4 transition-transform",
                    state.mode === 'floating' && "rotate-45"
                  )}
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={closeSidebar}
                aria-label="사이드바 닫기"
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content with ScrollArea */}
          <ScrollArea className="flex-1 p-4">
            <Accordion
              type="multiple"
              value={accordionValue}
              onValueChange={handleAccordionChange}
              className="space-y-4"
            >
              {/* Recent Posts Section */}
              <AccordionItem value="recent-posts" className="border-none">
                <AccordionTrigger className="hover:no-underline py-2 px-3 hover:bg-accent rounded-md">
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4" />
                    <span className="text-sm font-semibold">Recent Posts</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-0">
                  <div className="space-y-2">
                    {recentPosts.map((post) => (
                      <a
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="block p-2 rounded-md hover:bg-accent transition-colors"
                      >
                        <div className="text-sm font-medium line-clamp-2 mb-1">
                          {post.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {post.date.toLocaleDateString('ko-KR', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </a>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Categories Section */}
              <AccordionItem value="categories" className="border-none">
                <AccordionTrigger className="hover:no-underline py-2 px-3 hover:bg-accent rounded-md">
                  <div className="flex items-center gap-2">
                    <FolderIcon className="h-4 w-4" />
                    <span className="text-sm font-semibold">Categories</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-0">
                  <div className="space-y-3">
                    {categoryGroups.map((group) => (
                      <div key={group.name} className="space-y-1">
                        <div className="flex items-center justify-between px-2 py-1">
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            {group.name}
                          </span>
                          <Badge variant="secondary" className="h-5 text-xs">
                            {group.totalPosts}
                          </Badge>
                        </div>
                        <div className="space-y-0.5">
                          {group.children.map((category) => (
                            <a
                              key={category.id}
                              href={category.path}
                              className={cn(
                                "flex items-center justify-between px-3 py-1.5 rounded-md text-sm transition-colors",
                                currentCategory === category.id
                                  ? "bg-primary text-primary-foreground font-medium"
                                  : "hover:bg-accent"
                              )}
                            >
                              <span className="truncate">{category.name}</span>
                              <Badge
                                variant={currentCategory === category.id ? "outline" : "secondary"}
                                className={cn(
                                  "h-5 text-xs ml-2",
                                  currentCategory === category.id && "border-primary-foreground/20 text-primary-foreground"
                                )}
                              >
                                {category.postCount}
                              </Badge>
                            </a>
                          ))}
                        </div>
                        {group !== categoryGroups[categoryGroups.length - 1] && (
                          <Separator className="my-2" />
                        )}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </ScrollArea>
        </div>
      </aside>

      {/* Overlay for floating mode */}
      {state.mode === 'floating' && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}
    </>
  )
}
