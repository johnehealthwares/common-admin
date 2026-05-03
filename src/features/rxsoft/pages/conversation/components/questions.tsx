import { useMemo, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { AsyncSelectField } from '@/features/components/form/async-field'
import { PaginatedDataTable } from '@/features/components/paginated-data-table'
import { RxPage } from '@/features/components/rx-page'
import { conversationApi } from '@/lib/conversation-api'
import {
  buildQuestionForm,
  buildQuestionPayload,
  defaultQuestionForm,
  QuestionEditorDialog,
  type QuestionFormState,
} from './question-editor'
import {
  getBoolean,
  normalizeRows,
  useConversationCrud,
  useConversationList,
} from './shared'
import { Button, Switch } from '@mantine/core'

export function RxQuestionsPage() {
  const [search, setSearch] = useState('')
  const [questionnaireFilter, setQuestionnaireFilter] = useState('')
  const [showDialog, setShowDialog] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState<QuestionFormState>(defaultQuestionForm)

  const questionsQuery = useConversationList(
    '/questions',
    search,
    questionnaireFilter ? { questionnaireId: questionnaireFilter } : undefined
  )
  const { createMutation, updateMutation, deleteMutation } = useConversationCrud('/questions')

  const rows = useMemo(
    () =>
      normalizeRows(questionsQuery.data ?? []).sort(
        (a, b) => Number(a.index ?? 0) - Number(b.index ?? 0)
      ),
    [questionsQuery.data]
  )

  const nextIndex =
    Math.max(
      0,
      ...rows
        .filter((row) =>
          questionnaireFilter ? String(row.questionnaireId ?? '') === questionnaireFilter : true
        )
        .map((row) => Number(row.index ?? 0))
    ) + 1

  function openCreateDialog() {
    setForm({
      ...defaultQuestionForm,
      questionnaireId: questionnaireFilter,
      index: nextIndex,
    })
    setShowDialog(true)
  }

  function openEditDialog(row: Record<string, unknown>) {
    setForm(buildQuestionForm(row))
    setShowDialog(true)
  }

  function submitForm() {
    const payload = buildQuestionPayload(form, rows)

    if (form.id) {
      updateMutation.mutate(
        { id: form.id, payload, method: 'put' },
        { onSuccess: () => setShowDialog(false) }
      )
      return
    }

    createMutation.mutate(payload, {
      onSuccess: () => {
        setShowDialog(false)
        setForm(defaultQuestionForm)
      },
    })
  }

  return (
    <RxPage
      title='Questions'
      description='Browse questions in a paginated table, with quick editing and questionnaire-aware creation defaults.'
      actions={
        <div className='flex flex-col gap-3 md:flex-row md:items-center'>
          <div className='min-w-[280px]'>
            <AsyncSelectField
              value={questionnaireFilter}
              field={{
                name: 'questionnaireId',
                label: 'Questionnaire',
                type: 'async-select',
                endpoint: '/questionnaires',
                searchParam: 'search',
                minChars: 0,
                valueKey: 'id',
                labelKey: 'name',
                placeholder: 'Filter by questionnaire',
              }}
              onChange={setQuestionnaireFilter}
              apiClient={conversationApi}
            />
          </div>
          <Button type='button' onClick={openCreateDialog}>
            <Plus className='size-4' />
            Add Question
          </Button>
        </div>
      }
    >
      <PaginatedDataTable
        columns={[
          { key: 'index', label: '#' },
          { key: 'attribute', label: 'Attribute' },
          { key: 'text', label: 'Text' },
          { key: 'questionType', label: 'Type' },
          { key: 'renderMode', label: 'Render' },
          { key: 'processMode', label: 'Process' },
          {
            key: 'required',
            label: 'Required',
            render: (row) => (
              <Switch
                checked={getBoolean(row.isRequired)}
                onChange={(checked) =>
                  updateMutation.mutate({
                    id: String(row.id),
                    payload: { isRequired: checked },
                    method: 'put',
                  })
                }
              />
            ),
          },
          {
            key: 'active',
            label: 'Active',
            render: (row) => (
              <Switch
                checked={getBoolean(row.isActive)}
                onChange={(checked) =>
                  updateMutation.mutate({
                    id: String(row.id),
                    payload: { isActive: checked },
                    method: 'put',
                  })
                }
              />
            ),
          },
          {
            key: 'actions',
            label: 'Actions',
            render: (row) => (
              <div className='flex gap-2'>
                <Button
                  type='button'
                  size='icon'
                  variant='outline'
                  onClick={() => openEditDialog(row)}
                >
                  <Pencil className='size-4' />
                </Button>
                <Button
                  type='button'
                  size='icon'
                  variant='outline'
                  onClick={() => setDeleteId(String(row.id))}
                >
                  <Trash2 className='size-4' />
                </Button>
              </div>
            ),
          },
        ]}
        rows={rows}
        isLoading={questionsQuery.isLoading}
        isError={questionsQuery.isError}
        searchValue={search}
        onSearchChange={setSearch}
      />

      <QuestionEditorDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        form={form}
        setForm={setForm}
        onSubmit={submitForm}
        loading={createMutation.isPending || updateMutation.isPending}
        questionnaireLocked={Boolean(questionnaireFilter && !form.id)}
        minIndex={form.id ? 1 : nextIndex}
      />

      <ConfirmDialog
        open={deleteId != null}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null)
        }}
        title='Delete question'
        desc='This will permanently remove the selected question.'
        confirmText='Delete'
        destructive
        handleConfirm={() => {
          if (deleteId) {
            deleteMutation.mutate(deleteId)
          }
          setDeleteId(null)
        }}
      />
    </RxPage>
  )
}
