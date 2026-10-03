'use client'

import * as React from 'react'
import { UploadCloud } from 'lucide-react'
import { cn } from 'cn'

export interface FileDropzoneProps extends Omit<
  React.ComponentProps<'button'>,
  'onChange' | 'title'
> {
  /** Callback fired when a file is selected or dropped */
  onFileSelect?: (file: File | null) => void
  /** Accepted MIME types or extensions */
  accept?: string
  /** Primary label/heading */
  title?: React.ReactNode
  /** Subtext or constraint notes */
  description?: React.ReactNode
  /** Custom icon component */
  icon?: React.ReactNode
}

export function FileDropzone({
  className,
  onFileSelect,
  accept = 'image/png, image/jpeg, application/pdf',
  disabled = false,
  title,
  description = 'PNG, JPG, PDF up to 10 MB',
  icon,
  onClick,
  ref,
  ...props
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    onFileSelect?.(files[0])
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (!event.defaultPrevented) {
      inputRef.current?.click()
    }
  }

  const handleDragEnter = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    if (!disabled) setIsDragging(true)
  }

  const handleDragOver = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const handleDragLeave = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(false)

    if (disabled) return
    handleFiles(event.dataTransfer.files)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files)
    event.target.value = ''
  }

  return (
    <div className="relative w-full">
      <input
        type="file"
        ref={inputRef}
        accept={accept}
        disabled={disabled}
        className="sr-only"
        onChange={handleInputChange}
        tabIndex={-1}
      />
      <button
        type="button"
        ref={ref}
        disabled={disabled}
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'mt-1.5 flex min-h-28 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-strong bg-secondary/60 px-4 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'hover:border-accent/60 hover:bg-accent/[0.05]',
          isDragging && 'border-accent bg-accent/[0.08]',
          disabled &&
            'cursor-not-allowed opacity-50 hover:border-strong hover:bg-secondary/60',
          className,
        )}
        {...props}
      >
        {icon ?? <UploadCloud className="size-6 text-accent" />}
        <span className="mt-2 text-sm font-semibold">
          {title ?? (
            <>
              Drop your document here or{' '}
              <span className="text-accent">browse</span>
            </>
          )}
        </span>
        {description && (
          <span className="mt-1 text-xs text-text-tertiary">{description}</span>
        )}
      </button>
    </div>
  )
}
