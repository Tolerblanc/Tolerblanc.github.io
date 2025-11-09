import * as React from "react"
import { Button } from "@/components/ui/button"
import { ArrowUpIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function ScrollToTop() {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility, { passive: true })

    // Initial check
    toggleVisibility()

    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <Button
      onClick={scrollToTop}
      size="icon"
      className={cn(
        "fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full shadow-lg transition-all duration-300",
        "bg-primary text-primary-foreground hover:bg-primary/90",
        "hover:shadow-xl hover:-translate-y-1",
        "active:translate-y-0",
        isVisible
          ? "opacity-100 visible translate-y-0"
          : "opacity-0 invisible translate-y-5",
        "md:bottom-6 md:right-6",
        "max-md:bottom-4 max-md:right-4 max-md:h-11 max-md:w-11"
      )}
      aria-label="맨 위로 이동"
    >
      <ArrowUpIcon className="h-5 w-5" />
    </Button>
  )
}
