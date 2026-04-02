# YAML Schema Preparation Guide

> For developers writing `codegen/schemas/*.schema.yaml` files.
> This guide uses Education ERP examples throughout.

---

## What Is a Schema YAML?

A schema YAML is the **single source of truth** for a module. You write it once. The codegen command reads it and generates:

- Mongoose model (database schema + indexes)
- Joi validation (all input rules)
- GraphQL schema (queries, mutations, types)
- Lambda handler (all business logic)
- AppSync resolvers
- SAM stack fragment (Lambda + DataSource + resolvers)
- Unit tests (50–70 real tests)
- MODULE.md documentation

**You do not write any of those files manually.** You write the YAML. The agent writes everything else.

---

## The Golden Rule

> **Never include** `tenant_id`, `created_at`, `updated_at`, `created_by`, `updated_by`, `isDeleted`, `deletedAt`, `deletedBy` in your fields list.
>
> They are injected automatically into every module, every time, without exception.

---

## File Location & Naming

```
codegen/schemas/{entity-kebab}.schema.yaml
```

Examples:
```
codegen/schemas/student.schema.yaml
codegen/schemas/admission.schema.yaml
codegen/schemas/fee-payment.schema.yaml
codegen/schemas/exam-schedule.schema.yaml
```

---

## Full Schema Structure

```yaml
entity:        ← Who are you defining?
fields:        ← What data do they hold?
operations:    ← What can users do with them?
events:        ← What events get published?
permissions:   ← Who is allowed to do what?
preconditions: ← (Optional) Business rules that gate writes
eventHandlers: ← (Optional) React to events from other modules
```

---

## Section 1 — `entity`

```yaml
entity:
  name:        Student           # PascalCase singular
  plural:      Students          # PascalCase plural
  module:      student-management    # kebab-case directory name
  description: Core student profile record for an enrolled student
```

**Rules:**
- `name` — always PascalCase, always singular: `Student`, `FeePayment`, `ExamSchedule`
- `plural` — used for `listStudents`, `countStudents`, `batchDeleteStudents`
- `module` — becomes the directory `src/app-modules/student-management/` and the SAM stack file
- `description` — one line; appears in MODULE.md header

**Education examples:**

| `name` | `plural` | `module` |
|---|---|---|
| `Student` | `Students` | `student-management` |
| `Admission` | `Admissions` | `admission-management` |
| `FeePayment` | `FeePayments` | `fee-management` |
| `ExamSchedule` | `ExamSchedules` | `exam-management` |
| `AttendanceRecord` | `AttendanceRecords` | `attendance-management` |
| `CourseEnrollment` | `CourseEnrollments` | `enrollment-management` |
| `Faculty` | `Faculty` | `faculty-management` |

---

## Section 2 — `fields`

This is the most important section. Map each field to exactly one entry.

### Scalar Field (most common)

```yaml
fields:
  - name: rollNumber        # camelCase field name
    type: String
    required: true          # must be provided on create
    unique: true            # no two students can share a roll number (within tenant)
    searchable: true        # included in text search
```

### The External ID Field

Every entity should have one external ID — a stable ULID used by other services.

```yaml
  - name: student_id        # must be snake_case with _id suffix
    type: String
    external_id: true       # generates ULID automatically on create
    unique: true
```

> You can only have **one** `external_id: true` field per entity.

### Field Types Quick Reference

| What you want | `type` to use | Notes |
|---|---|---|
| Name, description, code | `String` | |
| Marks, fees, percentage | `Number` | add `percentage: true` for 0–100 fields |
| Count, age, year, rank | `Number` + `integer: true` | add `min: 0` |
| True/false flags | `Boolean` | e.g. `isScholarship`, `isHosteller` |
| Date of birth, join date | `Date` | generates `AWSDateTime` in GraphQL |
| A list of tags or codes | `[String]` | e.g. `tags`, `allergies`, `languages` |
| A fixed set of values | `String` + `enum: [...]` | see Enum section below |
| A nested address/contact | `Object` + `fields:` | see Nested Object section |
| A list of subjects/items | `[Object]` + `fields:` | see Array of Objects section |

### Field Flags

```yaml
  - name: bloodGroup
    type: String
    filterable: true    # → added to FilterInput, buildMongoQuery, and compound DB index
    sortable: true      # → added to SortField enum (enables sort by this field)
    searchable: true    # → included in the $or regex text search
```

**When to use each flag:**

| Flag | Use when... | Example fields |
|---|---|---|
| `filterable` | users will filter list by this field | `status`, `department`, `gender`, `academicYear` |
| `sortable` | users will sort list by this field | `rollNumber`, `name`, `created_at`, `marks` |
| `searchable` | this text field should appear in search results | `name`, `rollNumber`, `email` |

> `filterable`, `sortable`, `searchable` do NOT work on `Object` or `[Object]` fields.

### Enum Field

```yaml
  - name: gender
    type: String
    enum: [male, female, other, preferNotToSay]
    filterable: true

  - name: admissionStatus
    type: String
    enum: [applied, shortlisted, admitted, cancelled, waitlisted]
    default: applied
    filterable: true
    sortable: true
```

### Number Constraints

```yaml
  - name: attendancePercentage
    type: Number
    percentage: true        # shorthand for min:0, max:100

  - name: totalMarks
    type: Number
    min: 0
    max: 600

  - name: academicYear
    type: Number
    integer: true
    min: 2000
    max: 2100

  - name: currentSemester
    type: Number
    integer: true
    min: 1
    max: 12
```

### Nested Object (`type: Object`)

Use when a group of related fields belongs together as a single value. The entire object is replaced atomically on update.

```yaml
  - name: guardianDetails
    type: Object
    fields:
      - name: name
        type: String
        required: true
      - name: relation
        type: String
        enum: [father, mother, guardian]
      - name: phone
        type: String
        required: true
      - name: email
        type: String
      - name: occupation
        type: String

  - name: permanentAddress
    type: Object
    fields:
      - name: line1
        type: String
        required: true
      - name: city
        type: String
        required: true
      - name: state
        type: String
        required: true
      - name: pincode
        type: String
      - name: country
        type: String
        enum: [IN, US, GB, AU, SG]
        default: IN
```

> Nested `fields` support only scalar types — `String`, `Number`, `Boolean`, `Date`, `[String]`, enum. No further nesting.

### Array of Objects (`type: "[Object]"`)

Use when an entity has a variable-length list of structured items that are managed individually. This generates three automatic sub-operations: `add*`, `update*`, `remove*`.

```yaml
  - name: documents
    type: "[Object]"
    item_name: Document         # singular name used in sub-op names + GraphQL types
    fields:
      - name: documentType
        type: String
        enum: [aadhaar, passport, marksheet, transferCertificate, birthCertificate]
        required: true
      - name: fileKey
        type: String            # S3 key from storage-management
        required: true
      - name: uploadedAt
        type: Date
      - name: verified
        type: Boolean
        default: false

  - name: previousEducation
    type: "[Object]"
    item_name: EducationRecord
    fields:
      - name: institution
        type: String
        required: true
      - name: board
        type: String
        enum: [CBSE, ICSE, STATE, IB, OTHER]
      - name: passingYear
        type: Number
        integer: true
      - name: percentage
        type: Number
        percentage: true
```

> Sub-operations generated: `addStudentDocument`, `updateStudentDocument`, `removeStudentDocument`
> The `item_name` field controls this naming. If omitted, it's derived from the field name.

---

## Section 3 — `operations`

### Standard Operations

Remove anything you don't need. Most entities need the core set:

```yaml
operations:
  include:
    - create
    - update
    - softDelete
    - hardDelete
    - restore
    - get
    - getByExternalId     # only if you have external_id: true on a field
    - list
    - listDeleted
    - count
    - batchDelete
    - bulkCreate          # only if bulk import is needed
    - csvExport           # only if users need to download data
```

**Education-domain guidance:**

| Module | Remove these | Keep these |
|---|---|---|
| `admission-management` | `hardDelete` (keep records) | all others |
| `attendance-management` | `bulkCreate` can be useful for importing | most |
| `exam-management` | `bulkCreate` | most |
| `fee-management` | `update` (receipts are immutable) | create, get, list, count, csv |
| `student-management` | `hardDelete` rarely needed | all others |

### Custom Operations

Define operations outside the standard 17 when the logic involves computation, cross-entity reads, or special business rules.

**Simple custom mutation:**

```yaml
  custom:
    - name: promoteStudent
      type: mutation
      permission: "student:student:promote"
      description: "Advance a student to the next semester"
      input:
        - name: _id
          type: ID
          required: true
        - name: newSemester
          type: Number
          required: true
        - name: remarks
          type: String
      returns: Student
      event: StudentPromoted
```

**Custom query (no event):**

```yaml
    - name: getStudentReport
      type: query
      permission: "student:student:read"
      description: "Fetch combined academic, attendance, and fee summary for a student"
      input:
        - name: student_id
          type: String
          required: true
      returns: StudentReportSummary
      # No event — queries never publish
```

**Custom mutation with cross-entity reads (Pattern A):**

```yaml
    - name: generateFeeReceipt
      type: mutation
      permission: "fee:fee-payment:create"
      description: "Generate a fee receipt after payment is confirmed"
      input:
        - name: student_id
          type: String
          required: true
        - name: feeStructureId
          type: String
          required: true
        - name: amountPaid
          type: Number
          required: true
      returns: FeePayment
      event: FeeReceiptGenerated

      reads:
        - model: Student
          as: student
          lookupField: student_id
          inputField: student_id
          required: true
          filter: { isDeleted: { $ne: true } }
          error: "Student not found or inactive"
        - model: FeeStructure
          as: feeStructure
          lookupField: _id
          inputField: feeStructureId
          required: true
          filter: { isActive: true }
          error: "Fee structure not found or inactive"

      computedFields:
        - name: receiptNumber
          from: "auto-generated sequential number per tenant"
        - name: balanceDue
          from: "feeStructure.totalAmount - amountPaid"

      idempotencyCheck:
        fields: [student_id, feeStructureId, academicYear, term]
        error: "Fee receipt already generated for this student for this term"
```

---

## Section 4 — `events`

```yaml
events:
  source: "eduapp.student-management"
```

- Replace `eduapp` with your actual app name (must match what's in `samconfig.toml`)
- The module name must match your `entity.module` value
- EventBridge uses this as the `source` field for routing rules

Standard events are auto-published for each mutation:

| Operation | Event published |
|---|---|
| `create` | `StudentCreated` |
| `update` | `StudentUpdated` |
| `softDelete` | `StudentSoftDeleted` |
| `hardDelete` | `StudentHardDeleted` |
| `restore` | `StudentRestored` |
| `batchDelete` | `StudentBatchDeleted` |
| `bulkCreate` | `StudentBulkCreated` |
| custom mutation | whatever you name in `event:` |

---

## Section 5 — `permissions`

```yaml
permissions:
  prefix: "student:student"
```

Derived full permissions:

| Permission string | Operations covered |
|---|---|
| `student:student:read` | get, getByExternalId |
| `student:student:list` | list, listDeleted, count, csvExport |
| `student:student:create` | create, bulkCreate |
| `student:student:update` | update, all [Object] sub-ops |
| `student:student:delete` | softDelete, batchDelete, deleteStudent (alias) |
| `student:student:restore` | restore |
| `student:student:admin` | hardDelete |

**Education permission prefix conventions:**

| Module | Permission prefix |
|---|---|
| `student-management` | `student:student` |
| `admission-management` | `admission:application` |
| `fee-management` | `fee:fee-payment` |
| `exam-management` | `exam:exam-schedule` |
| `attendance-management` | `attendance:record` |
| `faculty-management` | `faculty:faculty` |
| `course-management` | `course:course` |

---

## Section 6 — `preconditions` (Optional)

Use preconditions to enforce business rules at the database level. Do not do this in application code unless necessary.

### Tier 1 — Status Gate

Prevents a write if the document is in the wrong state. Zero extra DB calls — enforced inside the atomic MongoDB filter.

```yaml
preconditions:
  statusGate:
    update:
      allowedStatuses: [applied, shortlisted]
      error: "Application cannot be modified after admission decision"

    softDelete:
      allowedStatuses: [applied, cancelled]
      error: "Only pending or cancelled applications can be deleted"

    hardDelete:
      requireSoftDeleted: true
      error: "Application must be soft-deleted before permanent deletion"

    documents:                        # [Object] field name → gates all 3 sub-ops
      allowedStatuses: [applied, shortlisted, admitted]
      error: "Cannot modify documents on a closed application"
```

### Tier 2 — Cross-Entity Guard

Validates a related entity in a different collection before writing. One extra DB read (~1–5 ms).

```yaml
  crossEntity:
    create:
      - guard: assertStudentActive
        field: student_id
        model: Student
        lookupField: student_id
        requiredFilter:
          isDeleted: false
          admissionStatus: admitted
        error: "Student not found or not admitted"

    update:
      - guard: assertCourseActive
        field: course_id
        model: Course
        lookupField: course_id
        requiredFilter:
          isActive: true
          isDeleted: { $ne: true }
        error: "Course not found or inactive"
```

---

## Section 7 — `eventHandlers` (Optional)

Use when this module needs to react to an event published by another module. The handler runs asynchronously — the original operation's response is already delivered to the caller.

```yaml
eventHandlers:

  # When a student is admitted, auto-create a fee structure entry
  - name: onStudentAdmitted
    description: "Create initial fee record when a student is admitted"
    triggers:
      - source: "eduapp.admission-management"
        detailType: AdmissionConfirmed
    action: "Create a pending fee record for the student's first semester"
    publishes: FeeRecordInitialised

  # When a student is deleted, void their pending fee records
  - name: onStudentSoftDeleted
    description: "Void unpaid fee records when a student is deleted"
    triggers:
      - source: "eduapp.student-management"
        detailType: StudentSoftDeleted
    action: "Update all pending FeeRecords for student_id to status: voided"
```

---

## Decision Checklist

Before writing a schema YAML, answer these questions:

```
1. What is the primary entity?
   → entity.name (PascalCase singular)

2. Does this entity have a stable external ID needed by other modules?
   → Add a field with external_id: true

3. What is the main display field? (shown in lists, search results)
   → Add required: true + primary: true + searchable: true

4. Which fields will users filter lists by?
   → filterable: true

5. Which fields will users sort by?
   → sortable: true

6. Does this entity have nested structured data (address, contact)?
   → type: Object with fields:

7. Does this entity have a variable list of items (documents, marks, subjects)?
   → type: "[Object]" with item_name: and fields:

8. Are there status transitions with rules?
   → preconditions.statusGate

9. Does this entity reference another entity and need to validate it exists?
   → preconditions.crossEntity

10. Does this module need to react to another module's events?
    → eventHandlers:

11. Does any operation need data from another module before writing?
    → operations.custom[].reads

12. Are any output fields computed server-side (never from client)?
    → operations.custom[].computedFields

13. Should any operation be idempotent (no duplicates)?
    → operations.custom[].idempotencyCheck
```

---

## Education ERP — Full Example: `student.schema.yaml`

```yaml
entity:
  name: Student
  plural: Students
  module: student-management
  description: Core student profile for an enrolled student

fields:

  - name: student_id
    type: String
    external_id: true
    unique: true

  - name: fullName
    type: String
    required: true
    primary: true
    searchable: true

  - name: rollNumber
    type: String
    required: true
    unique: true
    searchable: true
    filterable: true
    sortable: true

  - name: dateOfBirth
    type: Date

  - name: gender
    type: String
    enum: [male, female, other]
    filterable: true

  - name: bloodGroup
    type: String
    enum: [A+, A-, B+, B-, AB+, AB-, O+, O-]

  - name: email
    type: String
    searchable: true

  - name: phone
    type: String

  - name: department
    type: String
    filterable: true
    sortable: true

  - name: program
    type: String
    enum: [BCA, MCA, BBA, MBA, BTech, MTech]
    filterable: true

  - name: currentSemester
    type: Number
    integer: true
    min: 1
    max: 12
    filterable: true
    sortable: true

  - name: academicYear
    type: Number
    integer: true
    min: 2000
    filterable: true
    sortable: true

  - name: admissionStatus
    type: String
    enum: [active, graduated, suspended, withdrawn, deceased]
    default: active
    filterable: true

  - name: isScholarship
    type: Boolean
    default: false
    filterable: true

  - name: guardianDetails
    type: Object
    fields:
      - name: name
        type: String
        required: true
      - name: relation
        type: String
        enum: [father, mother, guardian, spouse]
      - name: phone
        type: String
        required: true
      - name: email
        type: String

  - name: permanentAddress
    type: Object
    fields:
      - name: line1
        type: String
      - name: city
        type: String
        required: true
      - name: state
        type: String
        required: true
      - name: pincode
        type: String
      - name: country
        type: String
        enum: [IN, US, GB, AU, SG]
        default: IN

  - name: documents
    type: "[Object]"
    item_name: Document
    fields:
      - name: documentType
        type: String
        enum: [aadhaar, passport, marksheet, transferCertificate, birthCertificate, photo]
        required: true
      - name: fileKey
        type: String
        required: true
      - name: verified
        type: Boolean
        default: false

operations:
  include:
    - create
    - update
    - softDelete
    - hardDelete
    - restore
    - get
    - getByExternalId
    - list
    - listDeleted
    - count
    - batchDelete
    - bulkCreate
    - csvExport

  custom:
    - name: promoteStudent
      type: mutation
      permission: "student:student:promote"
      description: "Move student to next semester"
      input:
        - name: _id
          type: ID
          required: true
        - name: newSemester
          type: Number
          required: true
        - name: remarks
          type: String
      returns: Student
      event: StudentPromoted

events:
  source: "eduapp.student-management"

permissions:
  prefix: "student:student"

preconditions:
  statusGate:
    update:
      allowedStatuses: [active, suspended]
      error: "Cannot update a graduated or withdrawn student"
    softDelete:
      allowedStatuses: [active, suspended, withdrawn]
      error: "Cannot delete a graduated student"
    hardDelete:
      requireSoftDeleted: true
      error: "Student must be soft-deleted before permanent deletion"
    documents:
      allowedStatuses: [active, suspended]
      error: "Cannot modify documents for inactive students"
```

---

## Common Mistakes to Avoid

| Mistake | Correct approach |
|---|---|
| Adding `tenant_id` to fields | Never — it's injected automatically |
| Adding `created_at` / `updated_at` | Never — timestamps are automatic |
| Using `type: Integer` | Use `type: Number` with `integer: true` |
| Forgetting `item_name:` on `[Object]` | Without it, the name is derived by stripping `s` — can be unexpected |
| Putting `filterable: true` on an `Object` or `[Object]` field | Not supported — only scalar fields |
| Two fields with `external_id: true` | One per entity only |
| Mixing PascalCase and camelCase in `entity.name` | `entity.name` must be PascalCase; field `name` must be camelCase |
| Custom mutation without `event:` | Every custom mutation MUST publish an event (INV-14) |
| Custom query with `event:` | Queries MUST NOT publish events |
| `reads:` in a standard operation | `reads:` is only for `operations.custom[]` entries |

---

## How to Run the Generator

```bash
# 1. Write your schema
vim codegen/schemas/student.schema.yaml

# 2. Generate the module
/generate-module codegen/schemas/student.schema.yaml

# 3. Integration steps (run after each generate)
npm run merge-graphql         # include new .graphql in root schema
npm run compose-template      # include new SAM stack fragment
npm test                      # all tests must pass

# 4. Add to app-config.yaml
# Open app-config.yaml, add "student-management" to app_modules list
```

---

## Getting Help

- **Schema contract (full spec):** `codegen/schema.contract.yaml`
- **Reference example (advanced patterns):** `codegen/examples/salary-management.schema.yaml`
- **Reference implementation (generated code):** `src/app-modules/item-management/`
- **All invariants:** `CLAUDE.md` → Generation Invariants section
- **Validate your generated module:** `/validate-module src/app-modules/student-management`
- **See what's missing:** `/diff-module src/app-modules/student-management`