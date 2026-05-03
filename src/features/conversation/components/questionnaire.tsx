import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronLeft, ChevronRight, ListChecks, MonitorSmartphone, Star } from 'lucide-react'
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Group,
  Modal,
  Radio,
  ScrollArea,
  Stack,
  Tabs,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core'
import { cn } from '@/lib/utils'

export type QuestionnaireOption = {
  id?: string
  key?: string
  label: string
  value?: string
  index?: number
}

export type QuestionnaireQuestion = {
  id?: string
  attribute?: string
  text: string
  description?: string
  questionType?: string
  renderMode?: string
  processMode?: string
  index?: number
  isRequired?: boolean
  options?: QuestionnaireOption[]
}

type AnswerValue = string | string[] | number | boolean | null

export type QuestionnaireProps = {
  title?: string
  description?: string
  showTitle?: boolean
  showDescription?: boolean
  questions?: QuestionnaireQuestion[]
  initialAnswers?: Record<string, AnswerValue>
  initialCurrentQuestionId?: string
  initialMode?: 'horizontal' | 'vertical'
  onSaveProgress?: (payload: {
    currentQuestion: QuestionnaireQuestion
    answers: Record<string, AnswerValue>
    progress: number
    currentIndex: number
  }) => Promise<void> | void
  onComplete?: (payload: {
    answers: Record<string, AnswerValue>
    questions: QuestionnaireQuestion[]
  }) => Promise<void> | void
  onProcessAnswer?: (payload: {
    question: QuestionnaireQuestion
    answer: AnswerValue
    answers: Record<string, AnswerValue>
    currentIndex: number
    questions: QuestionnaireQuestion[]
  }) => Promise<{
    advance?: boolean
    nextQuestionId?: string
    complete?: boolean
    errorMessage?: string
    answers?: Record<string, AnswerValue>
  } | void> | {
    advance?: boolean
    nextQuestionId?: string
    complete?: boolean
    errorMessage?: string
    answers?: Record<string, AnswerValue>
  } | void
}

const MODE_STORAGE_KEY = 'rxsoft-questionnaire-mode'

export const SAMPLE_QUESTIONS: QuestionnaireQuestion[] = [
  {
    id: 'ux-1',
    attribute: 'overall_experience',
    text: 'How would you rate your overall experience with the product?',
    description: 'Choose a rating from 1 to 5 stars.',
    questionType: 'number',
    renderMode: 'star_rating',
    processMode: 'question_type',
    index: 1,
    isRequired: true,
  },
  {
    id: 'ux-2',
    attribute: 'recommendation',
    text: 'Would you recommend this product to a colleague?',
    description: 'This helps us understand confidence and satisfaction.',
    questionType: 'boolean',
    renderMode: 'yes_no',
    processMode: 'question_type',
    index: 2,
    isRequired: true,
  },
  {
    id: 'ux-3',
    attribute: 'favorite_feature',
    text: 'Which part of the experience do you value most?',
    questionType: 'single_choice',
    renderMode: 'radio',
    processMode: 'option_processed',
    index: 3,
    isRequired: true,
    options: [
      { key: 'A', label: 'Speed', value: 'speed', index: 1 },
      { key: 'B', label: 'Ease of use', value: 'ease_of_use', index: 2 },
      { key: 'C', label: 'Visual design', value: 'visual_design', index: 3 },
      { key: 'D', label: 'Reliability', value: 'reliability', index: 4 },
    ],
  },
  {
    id: 'ux-4',
    attribute: 'channels_used',
    text: 'Which channels did you use during your experience?',
    questionType: 'multi_choice',
    renderMode: 'checkbox',
    processMode: 'option_processed',
    index: 4,
    isRequired: true,
    options: [
      { key: 'A', label: 'Web app', value: 'web_app', index: 1 },
      { key: 'B', label: 'Mobile', value: 'mobile', index: 2 },
      { key: 'C', label: 'Email', value: 'email', index: 3 },
      { key: 'D', label: 'Support chat', value: 'support_chat', index: 4 },
    ],
  },
  {
    id: 'ux-5',
    attribute: 'improvement_short',
    text: 'What is one thing we should improve first?',
    questionType: 'text',
    renderMode: 'input',
    processMode: 'question_type',
    index: 5,
    isRequired: true,
  },
  {
    id: 'ux-6',
    attribute: 'additional_feedback',
    text: 'Share any extra feedback you want the team to see.',
    questionType: 'text',
    renderMode: 'textarea',
    processMode: 'question_type',
    index: 6,
    isRequired: false,
  },
]

function getQuestionKey(question: QuestionnaireQuestion, index: number) {
  return question.attribute || question.id || `question-${index}`
}

function getOptionValue(option: QuestionnaireOption, index: number) {
  return option.key || option.label ||option.value ||  String(index + 1)
}

function normalizeQuestions(questions: QuestionnaireQuestion[]) {
  return [...questions]
    .map((question, index) => ({
      ...question,
      index: Number(question.index ?? index + 1),
      options: [...(question.options ?? [])].sort(
        (left, right) => Number(left.index ?? 0) - Number(right.index ?? 0)
      ),
    }))
    .sort((left, right) => Number(left.index ?? 0) - Number(right.index ?? 0))
}

function isQuestionAnswered(value: AnswerValue) {
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === 'boolean') return true
  if (typeof value === 'number') return value > 0
  return String(value ?? '').trim().length > 0
}

function formatAnswer(value: AnswerValue) {
  if (Array.isArray(value)) return value.join(', ')
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  return value == null || value === '' ? 'Not answered' : String(value)
}

function getInputKind(question: QuestionnaireQuestion) {
  if (question.renderMode === 'yes_no') return 'yes_no'
  if (question.renderMode === 'star_rating') return 'star_rating'
  if (question.questionType === 'boolean') return 'yes_no'
  if (question.questionType === 'multi_choice') return 'checkbox'
  if (question.questionType === 'single_choice') return 'radio'
  if (question.renderMode === 'textarea') return 'textarea'
  return 'input'
}

export function Questionnaire({
  title = 'User Experience Feedback',
  description = 'Answer each question in order. Your progress is saved as you move through the form.',
  showTitle = true,
  showDescription = true,
  questions = SAMPLE_QUESTIONS,
  initialAnswers,
  initialCurrentQuestionId,
  initialMode = 'horizontal',
  onSaveProgress,
  onComplete,
  onProcessAnswer,
}: QuestionnaireProps) {
  const normalizedQuestions = useMemo(
    () => normalizeQuestions(questions.length > 0 ? questions : SAMPLE_QUESTIONS),
    [questions]
  )
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>(initialAnswers ?? {})
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (!initialCurrentQuestionId) return 0
    const index = normalizedQuestions.findIndex(
      (question) => question.id === initialCurrentQuestionId
    )
    return index >= 0 ? index : 0
  })
  const [mode, setMode] = useState<'horizontal' | 'vertical'>(() => {
    if (typeof window === 'undefined') return initialMode
    const stored = window.localStorage.getItem(MODE_STORAGE_KEY)
    return stored === 'vertical' || stored === 'horizontal' ? stored : initialMode
  })
  const [isComplete, setIsComplete] = useState(false)
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string>('')
  const currentQuestion = normalizedQuestions[currentIndex]
  const progress = normalizedQuestions.length
    ? Math.round((Math.min(currentIndex + (isComplete ? 1 : 0), normalizedQuestions.length) / normalizedQuestions.length) * 100)
    : 0
  const containerRef = useRef<HTMLDivElement | null>(null)
  const questionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(MODE_STORAGE_KEY, mode)
    }
  }, [mode])

  useEffect(() => {
    setAnswers(initialAnswers ?? {})
    setIsComplete(false)
    setShowCompletionDialog(false)
  }, [initialAnswers])

  useEffect(() => {
    if (!initialCurrentQuestionId) {
      setCurrentIndex(0)
      return
    }
    const index = normalizedQuestions.findIndex(
      (question) => question.id === initialCurrentQuestionId
    )
    setCurrentIndex(index >= 0 ? index : 0)
  }, [initialCurrentQuestionId, normalizedQuestions])

  function resetForm() {
    setAnswers(initialAnswers ?? {})
    setCurrentIndex(() => {
      if (!initialCurrentQuestionId) return 0
      const index = normalizedQuestions.findIndex(
        (question) => question.id === initialCurrentQuestionId
      )
      return index >= 0 ? index : 0
    })
    setError('')
    setIsComplete(false)
    setShowCompletionDialog(false)
  }

  useEffect(() => {
    if (mode !== 'vertical' || !currentQuestion) return
    const key = getQuestionKey(currentQuestion, currentIndex)
    questionRefs.current[key]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }, [currentIndex, currentQuestion, mode])

  async function saveProgress(nextIndex: number, nextAnswers: Record<string, AnswerValue>) {
    if (!onSaveProgress || !currentQuestion) return
    await onSaveProgress({
      currentQuestion,
      answers: nextAnswers,
      progress: normalizedQuestions.length
        ? Math.round(((nextIndex + 1) / normalizedQuestions.length) * 100)
        : 0,
      currentIndex: nextIndex,
    })
  }

  async function goNext() {
    if (!currentQuestion) return
    const key = getQuestionKey(currentQuestion, currentIndex)
    const value = answers[key]

    if (currentQuestion.isRequired && !isQuestionAnswered(value)) {
      setError('This question is required before you continue.')
      return
    }

    setError('')
    setIsSubmitting(true)

    let nextAnswers = answers

    try {
      if (onProcessAnswer) {
        const result = await onProcessAnswer({
          question: currentQuestion,
          answer: value,
          answers,
          currentIndex,
          questions: normalizedQuestions,
        })

        if (result?.answers) {
          nextAnswers = result.answers
          setAnswers(result.answers)
        }

        if (result?.errorMessage) {
          setError(result.errorMessage)
          return
        }

        if (result?.complete) {
          setIsComplete(true)
          setShowCompletionDialog(true)
          await onComplete?.({ answers: nextAnswers, questions: normalizedQuestions })
          return
        }

        if (result?.advance === false) {
          return
        }

        if (result?.nextQuestionId) {
          const requestedIndex = normalizedQuestions.findIndex(
            (question) => question.id === result.nextQuestionId
          )

          if (requestedIndex >= 0) {
            setCurrentIndex(requestedIndex)
            await saveProgress(requestedIndex, nextAnswers)
            return
          }
        }
      }

      if (currentIndex >= normalizedQuestions.length - 1) {
        setIsComplete(true)
        setShowCompletionDialog(true)
        await onComplete?.({ answers: nextAnswers, questions: normalizedQuestions })
        return
      }

      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex)
      await saveProgress(nextIndex, nextAnswers)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function goPrevious() {
    if (currentIndex === 0) return
    const nextIndex = currentIndex - 1
    setCurrentIndex(nextIndex)
    setError('')
    await saveProgress(nextIndex, answers)
  }

  function updateAnswer(question: QuestionnaireQuestion, index: number, value: AnswerValue) {
    const key = getQuestionKey(question, index)
    const nextAnswers = {
      ...answers,
      [key]: value,
    }
    setAnswers(nextAnswers)
    setError('')
  }

  if (isComplete) {
    return (
      <div className='mx-auto w-full max-w-4xl space-y-6'>
        <Card shadow="xl" radius="lg" withBorder className='overflow-hidden border-0 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white shadow-2xl'>
          <Stack gap="md" p="xl">
            <Badge className='w-fit bg-white/10 text-white hover:bg-white/10'>
              Questionnaire complete
            </Badge>
            <Title order={1} className='text-3xl'>{title}</Title>
            <Text c="dimmed" className='text-slate-200'>
              Thanks for finishing. Here is a summary of the answers captured in this session.
            </Text>

            {normalizedQuestions.map((question, index) => {
              const key = getQuestionKey(question, index)
              return (
                <Card key={key} withBorder padding="md" radius="md" bg="rgba(255, 255, 255, 0.05)" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                  <Text size="sm" className='text-slate-300'>Question {index + 1}</Text>
                  <Text fw={500} className='mt-1 text-white'>{question.text}</Text>
                  <Text size="sm" className='mt-2 text-slate-200'>{formatAnswer(answers[key])}</Text>
                </Card>
              )
            })}
            <Button type='button' variant="light" color="gray" onClick={() => setIsComplete(false)}>
              Review answers
            </Button>
          </Stack>
        </Card>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className='mx-auto w-full max-w-6xl space-y-6'
      aria-live='polite'
    >
      <div className='rounded-[28px] border bg-gradient-to-br from-background via-background to-muted/60 p-4 shadow-sm sm:p-6'>
        <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
          <div {...({ section: 'title' } as Record<string, string>)} className='space-y-2'>
            <Badge variant='secondary' className='rounded-full px-3 py-1'>
              {progress}% complete
            </Badge>
            {showTitle || showDescription ? (
              <div>
                {showTitle ? (
                  <h1 className='text-2xl font-semibold tracking-tight sm:text-3xl'>{title}</h1>
                ) : null}
                {showDescription ? (
                  <Text c="dimmed" size="sm" className='mt-1 max-w-3xl sm:text-base'>
                    {description}
                  </Text>
                ) : null}
              </div>
            ) : null}
          </div>
          <Tabs
            value={mode}
            onChange={(value) => setMode(value as 'horizontal' | 'vertical')}
          >
            <Tabs.List className='grid w-full grid-cols-2 sm:w-[280px]'>
              <Tabs.Tab value='horizontal' leftSection={<MonitorSmartphone className='size-4' />}>
                Horizontal
              </Tabs.Tab>
              <Tabs.Tab value='vertical' leftSection={<ListChecks className='size-4' />}>
                Vertical
              </Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </div>

        <div className='mt-6 flex gap-3 overflow-x-auto pb-2'>
          {normalizedQuestions.map((question, index) => {
            const key = getQuestionKey(question, index)
            const answered = isQuestionAnswered(answers[key])
            const isCurrent = currentIndex === index
            return (
              <button
                key={key}
                type='button'
                disabled={index > currentIndex}
                onClick={() => {
                  if (index <= currentIndex) {
                    setCurrentIndex(index)
                    setError('')
                  }
                }}
                className={cn(
                  'flex min-w-[88px] items-center gap-2 rounded-full border px-3 py-2 text-sm transition',
                  isCurrent && 'border-primary bg-primary text-primary-foreground shadow-sm',
                  !isCurrent && answered && 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
                  !isCurrent && !answered && 'border-border bg-background text-muted-foreground',
                  index > currentIndex && 'cursor-not-allowed opacity-55'
                )}
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={`Go to question ${index + 1}`}
              >
                <span
                  className={cn(
                    'flex size-6 items-center justify-center rounded-full border text-xs',
                    isCurrent && 'border-white/40',
                    answered && !isCurrent && 'border-emerald-500/40'
                  )}
                >
                  {answered && !isCurrent ? <Check className='size-3.5' /> : index + 1}
                </span>
                <span className='truncate'>{question.attribute || `Step ${index + 1}`}</span>
              </button>
            )
          })}
        </div>
      </div>

      {mode === 'horizontal' ? (
        <HorizontalQuestionView
          key={getQuestionKey(currentQuestion, currentIndex)}
          question={currentQuestion}
          questionIndex={currentIndex}
          total={normalizedQuestions.length}
          value={answers[getQuestionKey(currentQuestion, currentIndex)]}
          error={error}
          onChange={(value) => updateAnswer(currentQuestion, currentIndex, value)}
          onPrevious={goPrevious}
          onNext={goNext}
          isSubmitting={isSubmitting}
        />
      ) : (
        <VerticalQuestionView
          questions={normalizedQuestions}
          currentIndex={currentIndex}
          answers={answers}
          error={error}
          onAnswerChange={updateAnswer}
          onPrevious={goPrevious}
          onNext={goNext}
          isSubmitting={isSubmitting}
          registerRef={(key, node) => {
            questionRefs.current[key] = node
          }}
        />
      )}

      <Modal opened={showCompletionDialog} onClose={() => setShowCompletionDialog(false)} title="Questionnaire complete" centered size="lg">
        <Text size="sm" c="dimmed">
          The session has been completed successfully. You can review the summary or reset and start again.
        </Text>
        <Group justify="flex-end" mt="md">
          <Button type='button' variant='default' onClick={resetForm}>
            Reset Form
          </Button>
          <Button type='button' onClick={() => setShowCompletionDialog(false)}>
            Review Summary
          </Button>
        </Group>
      </Modal>
    </div>
  )
}

function HorizontalQuestionView({
  question,
  questionIndex,
  total,
  value,
  error,
  onChange,
  onPrevious,
  onNext,
  isSubmitting,
}: {
  question: QuestionnaireQuestion
  questionIndex: number
  total: number
  value: AnswerValue
  error: string
  onChange: (value: AnswerValue) => void
  onPrevious: () => void
  onNext: () => void
  isSubmitting: boolean
}) {
  return (
    <div className='grid min-h-[520px] place-items-center'>
      <Card withBorder radius="lg" shadow="xl" className='w-full max-w-3xl overflow-hidden bg-card/90 shadow-2xl ring-1 ring-border/60'>
        <Stack gap="md" p="xl" bg="var(--mantine-color-gray-0)" className="border-b">
          <Badge variant='outline' className='w-fit rounded-full'>
            Question {questionIndex + 1} of {total}
          </Badge>
          <Title order={3}>{question.text}</Title>
          {question.description && (
            <Text size="sm" c="dimmed">{question.description}</Text>
          )}
        </Stack>
        <Stack gap="lg" p="xl">
          <QuestionInput question={question} value={value} onChange={onChange} enabled />
          {error ? <Text size="sm" c="red">{error}</Text> : null}
          <Group justify="space-between">
            <Button
              type='button'
              variant='default'
              onClick={onPrevious}
              disabled={questionIndex === 0}
              className='min-w-[140px]'
            >
              <ChevronLeft className='size-4' />
              Previous
            </Button>
            <Button type='button' onClick={onNext} className='min-w-[140px]' disabled={isSubmitting}>
              {questionIndex === total - 1 ? 'Finish' : 'Next'}
              {questionIndex !== total - 1 ? <ChevronRight className='size-4' /> : null}
            </Button>
          </Group>
        </Stack>
      </Card>
    </div>
  )
}

function VerticalQuestionView({
  questions,
  currentIndex,
  answers,
  error,
  onAnswerChange,
  onPrevious,
  onNext,
  isSubmitting,
  registerRef,
}: {
  questions: QuestionnaireQuestion[]
  currentIndex: number
  answers: Record<string, AnswerValue>
  error: string
  onAnswerChange: (question: QuestionnaireQuestion, index: number, value: AnswerValue) => void
  onPrevious: () => void
  onNext: () => void
  isSubmitting: boolean
  registerRef: (key: string, node: HTMLDivElement | null) => void
}) {
  return (
    <Card withBorder radius="lg" shadow="xl" className='overflow-hidden border-0 shadow-xl ring-1 ring-border/60'>
      <Stack gap={2} p="lg" bg="var(--mantine-color-gray-0)" className="border-b">
        <Title order={4}>Sequential form view</Title>
        <Text size="sm" c="dimmed">
          Previous questions remain visible for context. Future questions unlock one by one.
        </Text>
      </Stack>
      <div className='p-0 min-h-0 overflow-hidden '>
        <ScrollArea className='h-[70vh]'>
          <div className='space-y-4 p-4 sm:p-6'>
            {questions.map((question, index) => {
              const key = getQuestionKey(question, index)
              const status =
                index < currentIndex ? 'previous' : index === currentIndex ? 'current' : 'future'
              return (
                <div
                  key={key}
                  ref={(node) => registerRef(key, node)}
                  className={cn(
                    'rounded-3xl border p-5 transition-all duration-300',
                    status === 'current' &&
                      'border-primary bg-primary/5 shadow-lg ring-2 ring-primary/20',
                    status === 'previous' && 'border-border/60 bg-muted/20 opacity-80',
                    status === 'future' && 'border-dashed border-border/60 bg-muted/10 opacity-55'
                  )}
                >
                  <div className='mb-4 flex items-start justify-between gap-4'>
                    <div>
                      <Text size="sm" c="dimmed">Question {index + 1}</Text>
                      <Text fw={600} size="lg" className='mt-1'>{question.text}</Text>
                      {question.description ? (
                        <Text size="sm" c="dimmed" className='mt-1'>{question.description}</Text>
                      ) : null}
                    </div>
                    <Badge variant={status === 'current' ? 'filled' : 'light'}>
                      {status === 'previous' ? 'Completed' : status === 'current' ? 'Current' : 'Locked'}
                    </Badge>
                  </div>

                  <QuestionInput
                    question={question}
                    value={answers[key]}
                    onChange={(value) => onAnswerChange(question, index, value)}
                    enabled={status === 'current'}
                  />

                  {status === 'current' ? (
                    <Group justify="space-between" mt="xl">
                      <Button
                        type='button'
                        variant='default'
                        onClick={onPrevious}
                        disabled={currentIndex === 0}
                      >
                        <ChevronLeft className='size-4' />
                        Previous
                      </Button>
                      <Button type='button' onClick={onNext} disabled={isSubmitting}>
                        {currentIndex === questions.length - 1 ? 'Finish' : 'Next'}
                        {currentIndex !== questions.length - 1 ? <ChevronRight className='size-4' /> : null}
                      </Button>
                    </Group>
                  ) : null}

                  {status === 'current' && error ? (
                    <Text size="sm" c="red" mt="xs">{error}</Text>
                  ) : null}
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </div>
    </Card>
  )
}

function QuestionInput({
  question,
  value,
  onChange,
  enabled,
}: {
  question: QuestionnaireQuestion
  value: AnswerValue
  onChange: (value: AnswerValue) => void
  enabled: boolean
}) {
  const inputKind = getInputKind(question)

  if (inputKind === 'radio') {
    return (
      <Radio.Group
        value={typeof value === 'string' ? value : ''}
        onChange={onChange}
        disabled={!enabled}
      >
        <Stack gap="sm" mt="md">
          {(question.options ?? []).map((option, index) => {
          const optionValue = getOptionValue(option, index)
          const inputId = `radio-${question.id || question.attribute || index}-${optionValue}`
          return (
            <label
              key={optionValue}
              htmlFor={inputId}
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition',
                enabled ? 'hover:border-primary/40 hover:bg-primary/5' : 'cursor-not-allowed opacity-60'
              )}
            >
              <Radio id={inputId} value={optionValue} disabled={!enabled} />
              <div>
                <Text fw={500}>{option.label}</Text>
                {option.key ? <Text size="xs" c="dimmed">{option.key}</Text> : null}
              </div>
            </label>
          )
        })}
        </Stack>
      </Radio.Group>
    )
  }

  if (inputKind === 'checkbox') {
    const selected = Array.isArray(value) ? value : []
    return (
      <div className='grid gap-3'>
        {(question.options ?? []).map((option, index) => {
          const optionValue = getOptionValue(option, index)
          const checked = selected.includes(optionValue)
          return (
            <label
              key={optionValue}
              className={cn(
                'flex items-center gap-3 rounded-2xl border p-4 transition',
                enabled ? 'cursor-pointer hover:border-primary/40 hover:bg-primary/5' : 'cursor-not-allowed opacity-60'
              )}
            >
              <Checkbox
                checked={checked}
                disabled={!enabled}
                onChange={(e) => {
                  const nextChecked = e.currentTarget.checked
                  if (!enabled) return
                  if (nextChecked) {
                    onChange([...selected, optionValue])
                    return
                  }
                  onChange(selected.filter((item) => item !== optionValue))
                }}
              />
              <Text size="sm">{option.label}</Text>
            </label>
          )
        })}
      </div>
    )
  }

  if (inputKind === 'textarea') {
    return (
      <Textarea
        value={typeof value === 'string' ? value : ''}
        onChange={(event) => onChange(event.target.value)}
        disabled={!enabled}
        rows={6}
        placeholder='Type your answer here...'
      />
    )
  }

  if (inputKind === 'yes_no') {
    return (
      <div className='grid gap-3 sm:grid-cols-2'>
        {[
          { label: 'Yes', value: true },
          { label: 'No', value: false },
        ].map((option) => (
          <Button
            key={option.label}
            type='button'
            variant={value === option.value ? 'filled' : 'default'}
            className='h-14 rounded-2xl text-base'
            disabled={!enabled}
            onClick={() => onChange(option.value)}
            aria-pressed={value === option.value}
          >
            {option.label}
          </Button>
        ))}
      </div>
    )
  }

  if (inputKind === 'star_rating') {
    const currentValue = typeof value === 'number' ? value : 0
    return (
      <div className='flex flex-wrap gap-2'>
        {Array.from({ length: 5 }, (_, index) => {
          const rating = index + 1
          return (
            <button
              key={rating}
              type='button'
              className={cn(
                'flex size-14 items-center justify-center rounded-2xl border transition',
                currentValue >= rating
                  ? 'border-amber-400 bg-amber-50 text-amber-500'
                  : 'border-border bg-background text-muted-foreground',
                enabled ? 'hover:-translate-y-0.5 hover:shadow-md' : 'cursor-not-allowed opacity-60'
              )}
              onClick={() => enabled && onChange(rating)}
              disabled={!enabled}
              aria-label={`Rate ${rating} star${rating === 1 ? '' : 's'}`}
            >
              <Star className={cn('size-6', currentValue >= rating && 'fill-current')} />
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <TextInput
      value={typeof value === 'string' ? value : ''}
      onChange={(event) => onChange(event.target.value)}
      disabled={!enabled}
      placeholder='Type your answer here...'
      size="lg"
      radius="lg"
    />
  )
}
