import { Badge, Button, Text, Textarea } from '@mantine/core'
import { useEffect, useMemo, useState } from 'react'


type JsonEditorFieldProps = {
  value: unknown
  onChange: (value: Record<string, unknown> | unknown[]) => void
  label?: string
  helpText?: string
  placeholder?: string
  rows?: number
}

function formatJson(value: unknown) {
  if (value == null || value === '') {
    return ''
  }

  if (typeof value === 'string') {
    try {
      return JSON.stringify(JSON.parse(value), null, 2)
    } catch {
      return value
    }
  }

  return JSON.stringify(value, null, 2)
}

export function JsonEditorField({
  value,
  onChange,
  label,
  helpText,
  placeholder = '{\n  "key": "value"\n}',
  rows = 8,
}: JsonEditorFieldProps) {
  const [text, setText] = useState(() => formatJson(value))

  useEffect(() => {
    setText(formatJson(value))
  }, [value])

  const parseState = useMemo(() => {
    if (!text.trim()) {
      return { valid: true, message: 'Empty JSON' }
    }

    try {
      JSON.parse(text)
      return { valid: true, message: 'Valid JSON' }
    } catch (error) {
      return {
        valid: false,
        message: error instanceof Error ? error.message : 'Invalid JSON',
      }
    }
  }, [text])

  const lines = text.split('\n')

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(text)
      const formatted = JSON.stringify(parsed, null, 2)
      setText(formatted)
      onChange(parsed)
    } catch {
      // Ignore if invalid JSON
    }
  }

  return (
    <div className='space-y-2'>
      {label && <Text size="sm" fw={500}>
  {label}
</Text>}
      <div className='relative flex'>
        {/* Line numbers */}
        <div className='absolute inset-y-0 left-0 w-8 bg-gray-100 text-right pr-2 select-none font-mono text-xs text-gray-500'>
          {lines.map((_, idx) => (
            <div key={idx}>{idx + 1}</div>
          ))}
        </div>
        <Textarea
          rows={rows}
          className='pl-10 font-mono text-xs'
          value={text}
          placeholder={placeholder}
          onChange={(event) => {
            const nextValue = event.target.value
            setText(nextValue)
            try {
              const parsed = JSON.parse(nextValue)
              if (parsed && (typeof parsed === 'object' || Array.isArray(parsed))) {
                onChange(parsed)
              }
            } catch {
              // Keep editing state even when JSON is invalid.
            }
          }}
        />
      </div>
      {helpText && <p className='text-sm text-muted-foreground'>{helpText}</p>}

      <div className='flex justify-between items-center'>
        <Badge variant={parseState.valid ? 'secondary' : 'destructive'}>
          {parseState.message}
        </Badge>
        <Button size='sm' onClick={handleFormat} disabled={!parseState.valid}>
          Format JSON
        </Button>
      </div>
    </div>
  )
}