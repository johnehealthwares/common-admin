import { RxPage } from '@/features/components/page/rx-page'
import { Tabs } from '@mantine/core'
import { Concepts } from './components/concepts'
import { Values } from './components/values'
import { Mapping } from './components/mappings'
import { useState } from 'react'


export function CodingConceptRegistryPage() {

  const [formState, setFormState] = useState<any>({});
      const updateField = (name: string, value: unknown) => {
          console.log({ name, value })
          setFormState((prev: any) => ({
              ...prev,
              [name]: value,
          }))
      }
  
  return (
    <RxPage
      title='Coding Concept Registry'
      description='Manage concept codes, concept metadata values, and external mappings for the terminology service.'
    >
      <Tabs defaultValue='concepts' className='space-y-4'>
        <Tabs.List>
          <Tabs.Tab value='concepts'>Concept codes</Tabs.Tab>
          <Tabs.Tab value='values'>Concept values</Tabs.Tab>
          <Tabs.Tab value='mappings'>External mappings</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value='concepts'>
            <Concepts  />
        </Tabs.Panel>

        <Tabs.Panel value='values'>
          <Values />
        </Tabs.Panel>

        <Tabs.Panel value='mappings'>
          <Mapping  />
        </Tabs.Panel>
      </Tabs>
    </RxPage>
  )
}
