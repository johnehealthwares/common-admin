import { useMemo, useState } from 'react'
import { RxPage } from '@/features/components/rx-page'
import { switchApi } from '@/lib/switch-api'
import { SelectField } from '@/features/components/form/select'
import { Button, Textarea } from '@mantine/core'
import { notifications } from '@mantine/notifications'

const options = [
  { label: 'Healthstack Order Model', value: 'order-model' },
  { label: 'HL7 Order', value: 'hl7-order' },
  { label: 'HL7 Patient', value: 'hl7-patient' },
]

const targetAeOptions = [
  { label: 'DCM4CHEE', value: 'dcm4chee' },
  { label: 'OpenELIS', value: 'openelis' },
]

export function MessageTesterPage() {
  const [type, setType] = useState('order-model')
  const [targetAE, setTargetAE] = useState('dcm4chee')
  const [payload, setPayload] = useState('')
  const [response, setResponse] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)

  const samplePayload = useMemo(() => {
    switch (type) {
      case 'hl7-order':
        return 'MSH|^~\\&|HEALTHSTACK|HS|SWITCH|RXSOFT|202604251200||ORM^O01|123|P|2.5\rPID|1||123456^^^HOSPITAL^MR||Doe^Jane||19840501|F\rORC|NW|ORDER-123|||||R\rOBR|1|ORDER-123||RAD-CHEST^Chest X-Ray^99LOCAL|||202604251200'
      case 'hl7-patient':
        return 'MSH|^~\\&|HEALTHSTACK|HS|SWITCH|RXSOFT|202604251200||ADT^A04|456|P|2.5\rPID|1||987654^^^HOSPITAL^MR||Smith^John||19780312|M'
      default:
        return JSON.stringify({
          _id: 'order-123',
          documentationId: 'order-123',
          clientId: 'client-123',
          clientname: 'Jane Doe',
          client: { firstname: 'Jane', lastname: 'Doe', dob: '1984-05-01', gender: 'F' },
          order: 'Chest X-Ray',
          order_code: 'RAD-CHEST',
          order_category: 'RADIOLOGY',
          targetAE,
          requestingdoctor_Id: 'doc-001',
          requestingdoctor_facilityname: 'Healthstack Hospital',
        }, null, 2)
    }
  }, [targetAE, type])

  const handleSend = async () => {
    setIsSending(true)
    setResponse(null)

    try {
      let result
      if (type === 'order-model') {
        result = await switchApi.post('/flow/healthstack/order-model', {
          orderModel: JSON.parse(payload || samplePayload),
          targetAE,
        })
      } else if (type === 'hl7-order') {
        result = await switchApi.post('/flow/healthstack/order', {
          hl7Message: payload || samplePayload,
          targetAE,
        })
      } else {
        result = await switchApi.post('/flow/healthstack/patient', { hl7Message: payload || samplePayload })
      }

      setResponse(JSON.stringify(result.data ?? result, null, 2))
      notifications.show({message:'Payload sent successfully'})
    } catch (error) {
      setResponse(String(error))
      notifications.show({color: 'red', message: 'Failed to send payload'})
    } finally {
      setIsSending(false)
    }
  }

  return (
    <RxPage
      title="Message Tester"
      description="Send test HL7, FHIR, or order model payloads into the switch."
    >
      <div className="space-y-6 rounded-lg border bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[240px_1fr]">
          <SelectField
            label="Message Type"
            value={type}
            onChange={setType}
            options={options}
            placeholder='Message type'
          />
          <div className="grid gap-4 md:grid-cols-[220px_1fr]">
            <SelectField
              value={targetAE}
              onChange={(value) => setTargetAE(value)}
              options={targetAeOptions}
              placeholder='Target AE'
            />
            <Button onClick={() => setPayload(samplePayload)}>
              Load Sample Payload
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Payload</label>
            <Textarea
              value={payload || samplePayload}
              onChange={(event) => setPayload(event.target.value)}
              className="min-h-[260px] font-mono text-sm"
            />
          </div>

          <Button onClick={handleSend} disabled={isSending}>
            {isSending ? 'Sending…' : 'Send Payload'}
          </Button>

          {response ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold">Response</p>
              <pre className="mt-2 whitespace-pre-wrap text-xs">{response}</pre>
            </div>
          ) : null}
        </div>
      </div>
    </RxPage>
  )
}
