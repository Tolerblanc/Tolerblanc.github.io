import * as React from "react"

export function CodeCopyButton() {
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null)

  React.useEffect(() => {
    const initCodeCopyButtons = () => {
      const codeBlocks = document.querySelectorAll('pre > code')

      codeBlocks.forEach((codeBlock) => {
        const pre = codeBlock.parentElement
        if (!pre) return

        // Skip if button already exists
        if (pre.querySelector('.copy-button-wrapper')) return

        // Create wrapper if doesn't exist
        if (!pre.parentElement?.classList.contains('code-block-wrapper')) {
          const wrapper = document.createElement('div')
          wrapper.className = 'code-block-wrapper relative'
          pre.parentNode?.insertBefore(wrapper, pre)
          wrapper.appendChild(pre)
        }

        // Create button wrapper
        const buttonWrapper = document.createElement('div')
        buttonWrapper.className = 'copy-button-wrapper absolute top-2 right-2 z-10'

        const code = codeBlock.textContent || ''
        const buttonId = `copy-btn-${Math.random().toString(36).substring(2, 11)}`
        buttonWrapper.innerHTML = `<button id="${buttonId}" class="copy-button"></button>`

        pre.parentElement?.appendChild(buttonWrapper)

        // Add click handler
        const button = document.getElementById(buttonId)
        if (button) {
          button.addEventListener('click', async () => {
            try {
              await navigator.clipboard.writeText(code)
              setCopiedCode(buttonId)
              setTimeout(() => {
                setCopiedCode(null)
              }, 2000)
            } catch (err) {
              console.error('Failed to copy code:', err)
            }
          })
        }
      })
    }

    // Initialize on load
    initCodeCopyButtons()

    // Re-initialize on navigation
    document.addEventListener('astro:page-load', initCodeCopyButtons)

    return () => {
      document.removeEventListener('astro:page-load', initCodeCopyButtons)
    }
  }, [])

  // Render buttons with React
  React.useEffect(() => {
    const buttons = document.querySelectorAll('.copy-button')
    buttons.forEach((buttonElement) => {
      const button = buttonElement as HTMLElement
      const buttonId = button.id
      const isCopied = copiedCode === buttonId

      // Clear existing content
      button.innerHTML = ''

      // Create button content
      const iconWrapper = document.createElement('span')
      iconWrapper.className = 'flex items-center justify-center'

      if (isCopied) {
        iconWrapper.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`
        button.className = 'copy-button inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-8 w-8 bg-green-500 text-white hover:bg-green-600'
      } else {
        iconWrapper.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`
        button.className = 'copy-button inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-8 w-8 border border-input bg-background hover:bg-accent hover:text-accent-foreground'
      }

      button.appendChild(iconWrapper)
    })
  }, [copiedCode])

  return null
}
