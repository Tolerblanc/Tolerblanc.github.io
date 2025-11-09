import * as React from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import {
  InfoIcon,
  AlertTriangleIcon,
  XCircleIcon,
  CheckCircleIcon,
  FileTextIcon
} from "lucide-react"

type NoticeVariant = "info" | "warning" | "danger" | "success" | "primary"

interface NoticeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: NoticeVariant
  children: React.ReactNode
}

const noticeConfig = {
  info: {
    icon: InfoIcon,
    className: "border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100",
    iconClassName: "text-blue-600 dark:text-blue-400"
  },
  warning: {
    icon: AlertTriangleIcon,
    className: "border-yellow-200 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-900 dark:text-yellow-100",
    iconClassName: "text-yellow-600 dark:text-yellow-400"
  },
  danger: {
    icon: XCircleIcon,
    className: "border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100",
    iconClassName: "text-red-600 dark:text-red-400"
  },
  success: {
    icon: CheckCircleIcon,
    className: "border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-100",
    iconClassName: "text-green-600 dark:text-green-400"
  },
  primary: {
    icon: FileTextIcon,
    className: "border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20 text-purple-900 dark:text-purple-100",
    iconClassName: "text-purple-600 dark:text-purple-400"
  }
}

const Notice = React.forwardRef<HTMLDivElement, NoticeProps>(
  ({ variant = "info", children, className, ...props }, ref) => {
    const config = noticeConfig[variant]
    const Icon = config.icon

    return (
      <Alert
        ref={ref}
        className={cn(
          "border-l-4 my-4",
          config.className,
          className
        )}
        {...props}
      >
        <Icon className={cn("h-5 w-5", config.iconClassName)} />
        <AlertDescription className="[&_p]:leading-relaxed [&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_code]:bg-black/10 [&_code]:dark:bg-white/10 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_strong]:font-semibold [&_a]:underline [&_a]:underline-offset-2">
          {children}
        </AlertDescription>
      </Alert>
    )
  }
)

Notice.displayName = "Notice"

export { Notice, type NoticeVariant }
