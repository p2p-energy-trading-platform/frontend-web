// import { Input as InputPrimitive } from '@base-ui/react/input'
import { useState } from 'react'
import { cn } from 'cn'
import { InputGroup, InputGroupButton, InputGroupInput } from './input-group'
import { Eye, EyeOff } from 'lucide-react'

function PasswordInput({
  className,
  innerClass,
  ...props
}: React.ComponentProps<'input'> & { innerClass?: string }) {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <InputGroup
      className={cn('bg-transparent shadow-xs dark:bg-transparent', className)}
    >
      <InputGroupInput
        {...props}
        type={showPassword ? 'text' : 'password'}
        className={cn('h-full', innerClass)}
      />
      <InputGroupButton
        onClick={() => setShowPassword((currentValue) => !currentValue)}
        className="mr-4"
        variant={'ghost'}
      >
        {showPassword ? (
          <EyeOff className="size-4" />
        ) : (
          <Eye className="size-4" />
        )}
      </InputGroupButton>
    </InputGroup>
  )
}

export { PasswordInput }
