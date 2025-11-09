import * as React from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { HomeIcon } from "lucide-react"

interface BreadcrumbSegment {
  label: string
  href?: string
}

interface BlogBreadcrumbProps {
  segments: BreadcrumbSegment[]
  className?: string
}

export function BlogBreadcrumb({ segments, className }: BlogBreadcrumbProps) {
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="flex items-center gap-1">
            <HomeIcon className="h-3.5 w-3.5" />
            <span>Home</span>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {segments.map((segment, index) => (
          <React.Fragment key={index}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {segment.href && index < segments.length - 1 ? (
                <BreadcrumbLink href={segment.href}>
                  {segment.label}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{segment.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
