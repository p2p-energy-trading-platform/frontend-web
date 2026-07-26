import * as React from 'react'
import { Check } from 'lucide-react'
import { cn } from '#/lib/utils'

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    const [isChecked, setIsChecked] = React.useState(props.checked || false)
    const inputRef = React.useRef<HTMLInputElement>(null)

    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsChecked(e.target.checked)
      props.onChange?.(e)
    }

    const handleContainerClick = () => {
      if (inputRef.current) {
        inputRef.current.click()
      }
    }

    return (
      <div
        className="relative inline-block cursor-pointer"
        onClick={handleContainerClick}
      >
        <input
          type="checkbox"
          ref={inputRef}
          checked={isChecked}
          onChange={handleChange}
          className="sr-only"
          {...props}
        />
        <div
          className={cn(
            'h-4 w-4 rounded border-2 border-input bg-background transition-all ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            isChecked && 'border-primary bg-primary',
            props.disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          {isChecked && (
            <Check className="h-3 w-3 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          )}
        </div>
      </div>
    )
  }
)
Checkbox.displayName = 'Checkbox'

export { Checkbox }
