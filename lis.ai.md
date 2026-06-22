Create a NestJS


Add the appropriate types to the entities

Create the entities as Model.entity.ts

//Disable Location Children when Parent is disabbled - cascade ehaviour
//Implement Controllers to pass Page and Filters
//Implement swagger
//Ignore created_at, created_by during creation and make fields readonly
//Controllers have CRUD List All takes Pagination and Filters 
//All codes use Codegenerator service
//Add appropriate filters


CodeGeneratorService  / used for generatinng and validating codes, hardcoded into the service 
- code 
- espression

Implementationis 
Database > Model.entity(which appropriate inndeks , validations, relationships and constraints) > Model.domain > Repository(which uses appropriate repo util) > Service (which contains business validations)
//TODO: finish how CRUD repo is implemented

@Entity('test_definitions')
export class TestDefinition extends BaseEntity {
  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @ManyToMany(() => Panel, { eager: false })
  program: Program;


  @ManyToMany(() => Panel, { eager: false })
  panels: Panel[];

  @ManyToOne(() => Loinc, { nullable: true })
  loinc: Loinc;

  @ManyToOne(() => TestCategory, { nullable: true })
  category: TestCategory;

  @Column()
  methodology: string;

  @Column()
  result_type: string;

  @ManyToMany(() => SampleType, { eager: false })
  @JoinTable({ name: 'test_definition_sample_types' })
  sample_types: SampleType[];

  @ManyToOne(() => UnitOfMeasurement, { nullable: true })
  uom: UnitOfMeasurement;

  @Column({ nullable: true })
  min_value: string;

  @Column({ nullable: true })
  max_value: string;

  @Column({ nullable: true })
  critical_min: string;

  @Column({ nullable: true })
  critical_max: string;

  @Column('int', { nullable: true })
  turnaround_time_minutes: number;

  @Column('int', { nullable: true })
  test_duration_minutes: number;

  @Column({ default: true })
  active: boolean;

  @Column({ default: true })
  reportable: boolean;

  @OneToMany(() => ReferenceRange, rr => rr.test, { cascade: true })
  referenceRanges: ReferenceRange[];
}


UI - CRUD, with foreign fields using autocomplete input, boolean fields should use switch, sample types should use multiselect ReferenceRange should be on a Tabgroup
SEED - create seeder to seed LOINC codes, also add a sample TestDefinition
Entity

RejectionReason
- code: string
- name: string
- description: string
- active: boolean
UI - Dynamic CRUD based on Feild and Column definition, Ability to add new reason on the UI this is used
SEED - Generate seed for some default rejection reasons


@Entity()
export class ReferenceRange extends BaseEntity {
  @ManyToOne(() => TestDefinition, t => t.referenceRanges, { onDelete: 'CASCADE' })
  test: TestDefinition;

  @Column({ type: 'enum', enum: ['MALE', 'FEMALE', 'DEFAULT'] })
  gender: 'MALE' | 'FEMALE' | 'DEFAULT';

  @Column('int')
  min_age: number;

  @Column('int')
  max_age: number;

  @Column('decimal', { precision: 20, scale: 6 })
  low_value: number;

  @Column('decimal', { precision: 20, scale: 6 })
  high_value: number;

  @ManyToOne(() => UnitOfMeasurement)
  unit: UnitOfMeasurement;

  @Column({ default: true })
  active: boolean;

  @Column({ type: 'enum', enum: OperatorEnum })
  operator: OperatorEnum;

  @Column('decimal', { nullable: true })
  critical_low: number;

  @Column('decimal', { nullable: true })
  critical_high: number;
}
UI - CRUD Dynamic CRUD based on Feild and Column definition,  Ability to add new reason on the UI this is used with test as autocomplete, ability to identify uncovered/overlapping range
SEED - generate 5 sample reference range for the default TestDefinition
Validation: Ability to identify uncovered/overlapping range

Programs
- name: string
- description: string
- Test Definitions
UI - Dynamic CRUD based on Feild and Column definition
SEED - Create a default program and also ability to create on demand using the autocomplete UI
CACHE - Cache all 


@Entity('location_type_definitions')
export class LocationTypeDefinition extends BaseEntity {
  @Column({ unique: true, length: 50 })
  code: string;                    // ORGANISATION, FREEZER, etc.

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ default: false })
  allow_children: boolean;

  @ManyToMany(() => LocationTypeDefinition)
  @JoinTable({
    name: 'location_type_allowed_children',
    joinColumn: { name: 'parent_id' },
    inverseJoinColumn: { name: 'child_id' }
  })
  allowed_child_types: LocationTypeDefinition[];

  @OneToMany(() => AttributeDefinition, attr => attr.applies_to_type)
  attributeDefinitions: AttributeDefinition[];

  @Column({ default: true })
  active: boolean;
}
UI - Dynamic CRUD based on Feild and Column definition, allowed_child_types is multiselect of LocationTypeDefinition
SEED - Create a sample of all ORGANISATION | FACILITY | DEPARTMENT | CLINNIC | WARD | ROOM | SHELF | FREEZER | ROW | COLUMN with respective hierachies
VALIDATIONS: Implement appropriate validations in the service when creating

@Entity('locations')
export class Location extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true, nullable: true })
  reference: string;               // Auto-generated

  @ManyToOne(() => LocationTypeDefinition, { eager: true })
  type: LocationTypeDefinition;

  @ManyToOne(() => Location, loc => loc.children, { nullable: true })
  parent: Location;

  @OneToMany(() => Location, loc => loc.parent)
  children: Location[];

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => AttributeValue, av => av.entity_id, { cascade: true })
  attributeValues: AttributeValue[];
}
UI - CRUD, But another TabGroup for attribute management (Load all location Type definitions)
SEED - Create one location for each nameed Default ${LocationTypeDefinition.name}, seed attribute definitions for type FREEZER
protocol,host,port,serial_port,baud_rate,data_bits,stop_bits,parity,slave_id,temperature_register,humidity_register,temperature_scale,temperature_offset,humidity_scale,humidity_offset,target_temperature,warning_threshold,critical_threshold,polling_interval_seconds,active,last_updated,storage_device_id
VALIDATIONS - Check validations file


SampleType
- name: string
- description: string
- key: string
- accession_code: stirng //3 LETTER part used in coding
UI - CRUD
SEEDS
id,description,domain,lastupdated,local_abbrev,is_active,sort_order,name_localization_id,display_key
5,Actual type will be selected by user,H,2013-09-19 14:31:47.008874,Variable,,2147483647,136,
3,Plasma,H,2012-10-24 11:58:25.215565,Plasma,1,20,137,sample.type.Plasma
2,Serum,H,2012-10-24 11:58:25.215565,Serum,1,10,139,sample.type.Serum
4,Whole Blood,H,2012-10-24 11:58:25.215565,Whole Bld,1,50,138,sample.type.Sang
1,Urines,H,2012-10-24 11:58:25.215565,Urines,1,30,140,sample.type.Urines
24,Dry Tube,H,2020-01-22 21:46:41.326636,Dry,1,2147483647,141,sample.type.dryTube
25,EDTA Tube,H,2020-01-22 21:46:41.326636,EDTA,1,2147483647,142,sample.type.edtaTube
26,DBS,H,2020-01-22 21:46:41.326636,DBS,1,2147483647,143,sample.type.DBS
30,Respiratory Swab,H,2026-05-08 22:08:48.396201,Resp Swab,1,0,402,Sample.type.Swab
31,Sputum,H,2026-05-08 22:08:49.440124,Sputum,1,0,404,Sample.type.Sputum
32,Fluid,H,2026-05-08 22:08:50.103845,Fluid,1,0,403,Sample.type.Fluid
34,Histopathology specimen,H,2026-05-08 22:09:22.831701,HPS,1,2147483647,438,sample.type.HPSsampleType
35,Immunohistochemistry specimen,H,2026-05-08 22:09:26.185308,IMMUNO,1,2147483647,440,sample.type.immunohistochemistrySpecimen
36,Tissue antemortem,H,2026-05-08 22:09:34.03064,TAM,1,2147483647,556,sample.type.anteMortemsampleType
37,Tissue post mortem,H,2026-05-08 22:09:34.255945,TMP,1,2147483647,557,sample.type.postMortemsampleType

Priority
- name: string
- description: string
- index: int
SEED: Generate default priorities, ROUTINE | ASAP | STAT | TIMED | FUTURE STAT


SampleStatus
- name: string
- description: string
- index: int
- status_type: ORDER | EZTERNAL_ORDER
- active: boolean
SEED
id,description,code,status_type,lastupdated,name,display_key,is_active
4,This test has not yet been done,1,ANALYSIS,2011-02-16 12:45:57.196561,Not Tested,status.test.notStarted,Y
7,The Biologist did not accept this result as valid,1,ANALYSIS,2011-11-08 11:48:51.093674,Biologist Rejection,status.test.biologist.reject,Y
14,Test was requested but then canceled,1,ANALYSIS,2011-11-08 11:48:51.093674,Test Canceled,status.test.canceled,Y
15,The results of the test were accepted by technician as being valid,1,ANALYSIS,2011-11-08 11:48:51.093674,Technical Acceptance,status.test.tech.accepted,Y
16,The results of the test were not accepted by the technicain,1,ANALYSIS,2011-11-08 11:48:51.093674,Technical Rejected,status.test.tech.rejected,Y
6,The results of the analysis are final,1,ANALYSIS,2011-02-16 12:45:57.196561,Finalized,status.test.valid,Y
1,No tests have been run for this order,1,ORDER,2011-02-16 12:45:57.196561,Test Entered,status.sample.notStarted,Y
2,Some tests have been run on this order,1,ORDER,2011-02-16 12:45:57.196561,Testing Started,status.sample.started,Y
3,All tests have been run on this order,1,ORDER,2011-02-16 12:45:57.196561,Testing finished,status.sample.finished,Y
19,The sample has been canceled by the user,1,SAMPLE,2012-05-14 11:24:08.768263,SampleCanceled,status.sample.entered,Y
20,The sample has been entered into the system,1,SAMPLE,2012-05-14 11:24:08.768263,SampleEntered,status.sample.entered,Y
12,The order is non-conforming,1,ORDER,2011-08-23 09:30:01.227121,NonConforming,status.sample.nonConforming,N
13,The order is non-conforming,1,ANALYSIS,2011-08-23 09:30:01.227121,NonConforming,status.analysis.nonConforming,N
21,The electronic order has been entered into OE,1,EXTERNAL_ORDER,2013-04-10 16:00:05.19233,Entered,status.sample.entered,Y
22,The electronic order has been cancelled,1,EXTERNAL_ORDER,2013-04-10 16:00:05.19233,Cancelled,status.sample.cancelled,Y
23,The patient associated with the electronic order has appeared at the lab,1,EXTERNAL_ORDER,2013-04-10 16:00:05.19233,Realized,status.sample.realized,Y
24,This order is non-conforming,1,EXTERNAL_ORDER,2026-05-08 22:08:42.407509,NonConforming,status.order.nonConforming,Y
26,The sample has been rejected,1,ANALYSIS,2026-05-08 22:09:12.558122,Sample Rejected,status.sample.rejected,Y
27,The sample has been rejected,1,SAMPLE,2026-05-08 22:09:12.558122,Sample Rejected,status.sample.rejected,Y
28,Sample has been physically disposed,1,SAMPLE,2026-05-08 22:10:01.438629,SampleDisposed,status.sample.disposed,Y


Sample
- sampleType: SampleType
- accession_number
- entered_date: Date
- received_date: Date
- collected_by: User
- collection_date: Date // Represents the date and time the sample was taken from the patient or source (e.g., blood draw, water sample pickup). This is when the laboratory analysis starts, conceptually.
- released_by: User 
- released_date: Date // Represents the date and time the sample was logged into the laboratory information system upon arrival at the laboratory.
- sticker_reference: string
- barcode: string
- subject: Subject
- spec_or_isolate: SPECIMEN | ISOLATE
- priority: Priority
- status: Status
- transmission_date: Date // represents the specific timestamp when laboratory results or order updates were electronically sent from the LIMS to an external system.
- referral_reference: string
- order_id: string
- fhir_uuid: string
- order_priority: string
- gps_latitude: string
- gps_longitude: string
- consent_reference_no: string
- consent_recorded_at: string
- consent_recorded_by: string
- created_at: Date
- updated_at: Date
UI: CRUD 

Event
- code: string
- name: string
- description: string

id,code,description,type,lastupdated
1,FSR,Fee sticker received,resolving,2007-08-21 16:48:38.434
2,CDC,Collection date corrected,resolving,2007-08-21 15:58:29.117
3,RQSOC,Request source corrected,resolving,2007-08-21 14:11:01.737
4,SNAC,Submitter name corrected,resolving,2007-08-21 14:21:11.696
26,DLRQR,Delayed request form received,internal,2008-01-11 04:17:09.054
25,CMRE,Communication reviewed,internal,2008-05-01 21:38:41.775
27,DURPS,Duplicate report to submitter,message,2008-01-11 04:22:59.507
28,SPDC,Specimen discarded,internal,2008-01-11 04:20:13.235
29,SCL,Submitter was called,message,2008-01-11 04:22:33.637
30,SPSOC,Specimen source corrected,internal,2008-01-11 04:24:33.863
31,DLRQRQ,Delayed request form requested,message,2008-01-11 04:46:58.057
32,RPDF,Report placed in dead file,internal,2008-01-11 04:47:25.498
33,RQIDC,Request form ID corrected,internal,2008-01-11 04:47:57.136
34,SPCA,Specimen canceled,internal,2008-01-11 04:48:25.614
35,SPIDC,Specimen ID corrected,internal,2008-01-11 04:48:47.451
36,SPUNS,Specimen declared unsatisfactory,internal,2008-01-11 04:49:13.262

Panel 
- name: string
- description: string
- testDefinitions: TestDefinition[]

UI- CRUD ynamic CRUD based on Feild and Column definition, tests is multiselect


@Entity('test_requests')
export class TestRequest extends BaseEntity {
  @Column({ unique: true })
  reference: string;                    // Auto-generated

  @ManyToOne(() => Subject)
  subject: Subject;

  @ManyToOne(() => Priority)
  priority: Priority;

  @Column({ type: 'timestamptz' })
  requestDate: Date;

  @Column({ type: 'timestamptz', nullable: true })
  receivedDate: Date;

  @ManyToOne(() => Location)
  facility: Location;

  @ManyToOne(() => Location)
  location: Location;

  @ManyToOne(() => Program)
  program: Program;

  @ManyToOne(() => Invoice, { nullable: true })
  invoice: Invoice;

  @ManyToMany(() => TestDefinition)
  @JoinTable()
  tests: TestDefinition[];

  @OneToMany(() => Sample, s => s.testRequest)
  samples: Sample[];

  @OneToMany(() => Action, a => a.testRequest)
  actions: Action[];

  @ManyToOne(() => RejectionReason, { nullable: true })
  reject_reason: RejectionReason;

  @Column('simple-array', { nullable: true })
  requester_result_notification: string[];   // EMAIL, SMS, VOICE

  @Column('simple-array', { nullable: true })
  referral_result_notification: string[];
  - requester : User
- refferer : User
- estimatedPickupDate : Date
}
TestRequest
- reference: string
- priority : Priority
- requestDate: DateTime
- receivedDate: DateTime
- dateOfNestVisit : Date
- estimatedPickupDate : Date
- facility : Location
- requester : User
- refferer : User
- location : Location
- program : Program
- invoice: Invoice
- reject_reason: RejectionReason
- testDefinition: TestDefinition
- requester_result_notification: EMAIL | SMS | VOICE []
- referral_result_notification: EMAIL | SMS | VOICE []
- created_by: User
- actions: Action[]
UI - Dynamic CRUD based on Feild and Column definition TabGroup for Sample, Action fields, uses codeService
SEED - No Seed
Validations - Add necessary validations

SampleRejection
- sample: Sample
- rejection_reason: RejectionReason
- rejection_date: Date
- reason
- rejected_by: User
UI - Dynamic CRUD based on Feild and Column definition
No Seed



TestResult
- test_request: TestRequest
- status: ResultStatus
- unit: UnitOfMeasurement
- value: string
- reference_range: ReferenceRange
- flag: ResultFlag
- entered_by: User
- verified_by: User
- approved_by: User
- approved_at: Date
UI - Dynamic CRUD based on Feild and Column definition

ResultStatus
- PENDING
- ENTERED
- VERIFIED
- RELEASED
- REJECTED

ResultFlag
- code
- name
- description
- severity
- color
- requires_notification
- critical
- applies_to: NUMERIC | TEXT | SAMPLE | MICROBIOLOGY
UI - Dynamic CRUD based on Feild and Column definition
SEED - below
Code	name
PANIC	panic value
POS	positive
NEG	negative
IND	indeterminate
REJ	rejected
QNS	quantity not sufficient
HEM	hemolyzed
LIPEMIC	lipemic sample
CONT	contaminated

UI - readonly fields



Unit Of Measurement
- code
- name
- symbol
- ucum_code
UI - Dynamic CRUD based on Feild and Column definition

Loinc
- code
- name
- description



Subject
- id
- first_name
- last_name
- gender
- date_of_birth
- contact_phone
- contact_email
- address
- phone
- email
- address
- national_id
- fhir_uuid
- external_id
- deceased
- created_at
- updated_at
UI - Dynamic CRUD based on Feild and Column definition




@Entity()
export class AttributeDefinition extends BaseEntity {
  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ type: 'enum', enum: ['STRING', 'NUMBER', 'BOOLEAN', 'DATE', 'JSON'] })
  type: string;

  @Column({ default: false })
  required: boolean;

  @Column({ nullable: true })
  default_value: string;

  @Column({ nullable: true })
  validation_regex: string;

  @Column('decimal', { nullable: true })
  min: number;

  @Column('decimal', { nullable: true })
  max: number;

  @Column('simple-array', { nullable: true })
  options: string[];

  @ManyToOne(() => LocationTypeDefinition, lt => lt.attributeDefinitions)
  applies_to_type: LocationTypeDefinition;
}
UI - Dynamic CRUD based on Feild and Column definition



AttributeValue
- attribute_definition
- entity_type
- entity_id
- value

Notification
- type
- recipient
- channel
- status
- payload
- sent_at
- retry_count
- last_attempt_at
- failure_reason

Document
- entity_type
- entity_id
- file_name
- mime_type
- url
- storage_provider
- uploaded_by


 Seeds

Loaded into cache at boot.

Examples:

statuses
priorities
sample types
event codes
result flags
departments
attribute definitions


Validation Flow

When creating a location:
1. Load required attributes for type
2. Validate presence
3. Validate datatype
4. Validate regex/ranges
5. Save attribute values



Seed Sample
| Type         | Allowed Children |
| ------------ | ---------------- |
| ORGANIZATION | FACILITY         |
| FACILITY     | DEPARTMENT, WARD |
| WARD         | ROOM             |
| ROOM         | FREEZER          |
| FREEZER      | SHELF            |
| SHELF        | ROW              |
| ROW          | COLUMN           |

Seeding & CachingBoot-time Cache (loaded once at startup):SampleType, Priority, SampleStatus, ResultStatus, ResultFlag, Event, Program, UnitOfMeasurement, LocationTypeDefinition, AttributeDefinition, RejectionReason.

Seed Data:Full LocationType hierarchy (ORGANISATION → FACILITY → DEPARTMENT/CLINIC/WARD → ROOM → FREEZER → SHELF → ROW → COLUMN).
All provided SampleType rows.
Default Priorities (ROUTINE, ASAP, STAT, TIMED, FUTURE STAT).
All listed SampleStatus.
Sample TestDefinition + 5 ReferenceRanges.
Default RejectionReasons, ResultFlags, Events.

Location Type Validation Rules
Create Rules
Child Relationship Rules
If allow_children = false, allowed_child_types must be empty.
If allow_children = true, allowed_child_types is required and cannot be empty.
Every child type in allowed_child_types must already exist.
A location type cannot reference itself as a child.
Circular hierarchies must be prevented (e.g. ROOM → FREEZER → ROOM).
System Type Protection
Reserved/system types (e.g. ORGANIZATION, FACILITY, ROOM, FREEZER) should not be editable or deletable.
Update Rules
Hierarchy Integrity
Cannot remove a child type if existing locations depend on that relationship.
Cannot disable children if locations already contain child locations.
Location type codes should be immutable to avoid breaking integrations, attributes, caches, and validations.
Every update must revalidate:
graph cycles
self-reference
existing hierarchy compatibility
Delete Rules
Cannot delete a location type if locations use it.
Cannot delete a location type if other types reference it in allowed_child_types.
Location Validation Rules
Create Rules
Required Fields
name is required.
type is required.
type must exist.
Parent Validation
Parent location must exist.
Parent type must allow the child type.
Some location types may require a parent (non-root types).
Hierarchy Validation
Prevent circular parent relationships in the location tree.
Attribute Validation

For all attributes defined for the location type:

Load attribute definitions for the type.
Validate required attributes exist.
Validate datatype correctness.
Validate regex patterns.
Validate numeric ranges.
Validate allowed option values.
Reject unknown attributes.
Uniqueness Rules
reference must be unique.
Sibling locations should not share the same name under the same parent.
Immutability
Location type should not change after creation because it can invalidate attributes and hierarchy rules.
Update Rules
Revalidate hierarchy and compatibility when parent changes.
Revalidate all attributes on every update.
Prevent updates that invalidate child relationships.
Optionally prevent deactivation when active child locations exist.
Delete Rules
Cannot delete locations that have child locations.
Cannot delete locations that are still referenced elsewhere (samples, instruments, requests, etc.).
Recommended Validation Pipelines
LocationTypeDefinition Pipeline
Validate required fields
Validate uniqueness
Validate child types exist
Prevent self-reference
Detect cycles
Validate existing hierarchy compatibility
Save
Refresh cache
Location Pipeline
Validate required fields
Validate type exists
Validate parent exists
Validate parent-child compatibility
Prevent cycles
Load attribute definitions
Validate required attributes
Validate datatypes
Validate ranges/options/regex
Reject unknown attributes
Save location
Save attribute values
Audit/log changes

Architecture LayersEntity → Indexes, unique constraints, relations, soft delete.
Domain → Rich domain objects.
Repository → Uses generic repo utils + TypeORM QueryBuilder.
Service → All business validations (hierarchy, attributes, overlap detection, etc.).
Controller → CRUD + List (Pagination + Filters), Swagger.

CodeGeneratorService: Hardcoded logic for generating and validating all code fields.

Program: name, description; ManyToMany with TestDefinition.

Panel: name, description; ManyToMany with TestDefinition.

Entity → Indexes, unique constraints, relations, soft delete.
Domain → Rich domain objects.
Repository → Uses generic repo utils + TypeORM QueryBuilder.
Service → All business validations (hierarchy, attributes, overlap detection, etc.).
Controller → CRUD + List (Pagination + Filters), Swagger.

CodeGeneratorService: Hardcoded logic for generating and validating all code fields.

Accession Number generation logic is in services



for esample

export async function executeListQuery<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  alias: string,
  query: ListQuery
): Promise<ListResult<T>> {
  const page = Math.max(Number(query.page || 1), 1)
  const limit = Math.min(Math.max(Number(query.limit || 20), 1), 100)

  applyFilters(qb, alias, query.filters || {})

  const [data, total] = await qb
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount()

  const totalPages = Math.ceil(total / limit)

  const pagination = {
    page,
    limit,
    total,
    totalPages,
  }

  return {
    data,
    pagination,
    meta: pagination,
  }
}




import { ObjectLiteral, SelectQueryBuilder } from 'typeorm'

type ListQuery = {
  page?: number
  limit?: number
  filters?: Record<string, any>
}

type ListResult<T> = {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  meta: any
}

export async function executeListQuery<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  alias: string,
  query: ListQuery
): Promise<ListResult<T>> {
  const page = Math.max(Number(query.page || 1), 1)
  const limit = Math.min(Math.max(Number(query.limit || 20), 1), 100)

  applyFilters(qb, alias, query.filters || {})

  const [data, total] = await qb
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount()

  const totalPages = Math.ceil(total / limit)

  const pagination = {
    page,
    limit,
    total,
    totalPages,
  }

  return {
    data,
    pagination,
    meta: pagination,
  }
}


export function applyFilters(
  qb: SelectQueryBuilder<any>,
  alias: string,
  filters: Record<string, any>
) {
  Object.entries(filters).forEach(([field, raw]) => {
    if (!raw) return

    const { type, value, valueTo } = parseFilter(raw)
    applyFilter(qb, alias, field, type, value, valueTo)
  })
}

function parseFilter(raw: string) {
  const [type, value, valueTo] = raw.split('|')

  return {
    type,
    value,
    valueTo,
  }
}

function resolveField(alias: string, field: string) {
  return field.includes('.') ? field : `${alias}.${field}`
}

function paramName(field: string, type: string) {
  return `${field.replace('.', '_')}_${type}_${Date.now()}`
}

export function applyFilter(
  qb: SelectQueryBuilder<any>,
  alias: string,
  field: string,
  type: string,
  value?: any,
  valueTo?: any
) {
  const column = resolveField(alias, field)
  const param = paramName(field, type)

  switch (type) {
    case 'EQUALS':
      qb.andWhere(`${column} = :${param}`, { [param]: value })
      break

    case 'NOT_EQUALS':
      qb.andWhere(`${column} != :${param}`, { [param]: value })
      break

    case 'CONTAINS':
    case 'FUZZY_MATCH':
      qb.andWhere(`${column} LIKE :${param}`, {
        [param]: `%${value}%`,
      })
      break

    case 'GREATER_THAN':
      qb.andWhere(`${column} > :${param}`, { [param]: value })
      break

    case 'GREATER_THAN_OR_EQUAL':
      qb.andWhere(`${column} >= :${param}`, { [param]: value })
      break

    case 'LESS_THAN':
      qb.andWhere(`${column} < :${param}`, { [param]: value })
      break

    case 'LESS_THAN_OR_EQUAL':
      qb.andWhere(`${column} <= :${param}`, { [param]: value })
      break

    case 'BETWEEN': {
      const from = `${param}_from`
      const to = `${param}_to`

      qb.andWhere(`${column} BETWEEN :${from} AND :${to}`, {
        [from]: value,
        [to]: valueTo,
      })
      break
    }

    case 'MISSING':
      qb.andWhere(`${column} IS NULL`)
      break
  }
}

import { 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn, 
  DeleteDateColumn, 
  Column 
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deleted_at: Date | null;

  @Column({ nullable: true })
  created_by: string;   // User ID

  @Column({ nullable: true })
  updated_by: string;   // User ID

  // Optional: For optimistic locking
  // @VersionColumn()
  // version: number;
}

import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { TestDefinition } from './TestDefinition';

@Entity('test_categories')
export class TestCategory extends BaseEntity {
  @Column({ unique: true, length: 50 })
  code: string;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => TestDefinition, test => test.category)
  testDefinitions: TestDefinition[];
}
UI - CRUD

export enum OperatorEnum {
  EQUAL = 'EQUAL',
  GREATER_THAN = 'GREATER_THAN',
  GREATER_THAN_OR_EQUAL = 'GREATER_THAN_OR_EQUAL',
  LESS_THAN = 'LESS_THAN',
  LESS_THAN_OR_EQUAL = 'LESS_THAN_OR_EQUAL',
  BETWEEN = 'BETWEEN',
  ANY = 'ANY',           // For default ranges
}

import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { TestRequest } from './TestRequest';
import { Location } from './Location';

@Entity('invoices')
export class Invoice extends BaseEntity {
  @Column({ unique: true })
  invoice_number: string;   // Generated via CodeGeneratorService

  @Column('decimal', { precision: 12, scale: 2 })
  total_amount: number;

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  paid_amount: number;

  @Column({ type: 'timestamptz', nullable: true })
  due_date: Date;

  @Column({ type: 'enum', enum: ['PENDING', 'PAID', 'PARTIAL', 'OVERDUE', 'CANCELLED'] })
  status: string;

  @ManyToOne(() => Location)
  facility: Location;

  @OneToMany(() => TestRequest, tr => tr.invoice)
  testRequests: TestRequest[];

  @Column({ nullable: true })
  notes: string;
}

import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { TestRequest } from './TestRequest';
import { User } from './User';   // Assuming User entity exists

@Entity('actions')
export class Action extends BaseEntity {
  @ManyToOne(() => TestRequest, tr => tr.actions)
  testRequest: TestRequest;

  @Column()
  action_type: string;   // e.g., 'REJECT', 'HOLD', 'PRIORITY_CHANGE', 'NOTE'

  @Column('text')
  description: string;

  @ManyToOne(() => User)
  performed_by: User;

  @Column({ type: 'timestamptz' })
  performed_at: Date;

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>;   // Additional context
}

Generates all code, reference, accession_number, invoice_number.
Supports 10-digit, 3-part format for samples (e.g., LAB-2025-000123 or similar).
Hardcoded generators per entity type.

create readme.md and implementation.md in the nestjs app

Dedicated CRUD pages per LocationType using URL parameter (/locations/:typeCode).
Dynamic attribute form generation for Location (runtime based on AttributeDefinition).
All other masters use dynamic CRUD via DataPageShellProps, TabGroup, etc.
LocationTypeDefinition changes are heavily restricted if dependent data exists.

Full attribute validation pipeline for Location (required, type, regex, range, options).
Location type immutability + hierarchy protection.
Reference range overlap/gap detection.
Strict LocationTypeDefinition update rules.

Make sure All parameters are typed, generate all the models in a shared folder

src/
├── common/                  # Shared utilities, decorators, filters, interceptors
├── config/                  # Configuration module
├── core/                    # Core module (global services)
├── database/                # Database configuration & TypeORM setup
├── modules/
│   ├── auth/
│   ├── user/
│   ├── location/
│   ├── test/
│   ├── sample/
│   ├── request/             # TestRequest
│   ├── result/
│   ├── subject/
│   ├── master/              # Shared masters
│   ├── invoice/
│   ├── notification/
│   ├── document/
│   └── audit/
├── seeds/                   # Database seeders
├── utils/                   # CodeGeneratorService, validators, etc.
└── main.ts

2. Detailed Module RecommendationsModule
Responsibility
Key Entities / Services
Recommended Scope
CoreModule
Global services, caching, logging, CodeGenerator
CodeGeneratorService, CacheService, AuditService
Global (@Global())
LocationModule
Location hierarchy, types, dynamic attributes
Location, LocationTypeDefinition, AttributeDefinition, AttributeValue
High priority
TestModule
Test definitions and reference ranges
TestDefinition, ReferenceRange, TestCategory, Loinc
High priority
SampleModule
Sample lifecycle and management
Sample, SampleType, SampleStatus, SampleRejection
High priority
RequestModule
Test requests, actions, panels, programs
TestRequest, Action, Panel, Program
High priority
ResultModule
Test results and flags
TestResult, ResultFlag, ReferenceRange (shared)
Medium
SubjectModule
Patients / Subjects
Subject
Medium
MasterModule
Reusable master data
Priority, RejectionReason, UnitOfMeasurement, Event
Shared
InvoiceModule
Invoicing
Invoice
Low
NotificationModule
Notifications
Notification
Cross-cutting
DocumentModule
File attachments
Document
Cross-cutting
AuditModule
Audit trail
Audit
Cross-cutting
UserModule
Users & authentication
User
Foundational
AuthModule
Authentication & Authorization
Guards, strategies
Foundational

CommonModule
Interceptors, filters (HttpExceptionFilter), decorators, pipes, response wrappers
DatabaseModule
TypeORM configuration, custom repository base class
UtilsModule
CodeGeneratorService, ValidationHelper, PaginationHelper
CacheModule
Boot-time cache for masters (@nestjs/cache-manager)
SeederModule
Run once at startup or via CLI

Use Custom Base Repositoryts

export abstract class BaseRepository<T> extends Repository<T> { ... }

Domain-Driven Design LightKeep business logic heavy in Services
Use Domain Events later if needed

Cross-Cutting ConcernsUse TypeORM Subscribers for Audit logging
Create EventEmitter2 for internal events (e.g., SampleRejected, ResultApproved)

Feature Flags & Future-ProofingKeep MasterModule for easy extension
Make LocationModule very independent due to its complexity

Module Imports StrategyAvoid circular dependencies (use forwardRef() when necessary)
Export only necessary services

