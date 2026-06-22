# Form System Refactoring - Implementation Plan

**Status**: IN PROGRESS
**Start Date**: May 16, 2026
**Target Completion**: TBD

## 📋 Overview

Refactoring the React + Mantine + TanStack Query dynamic form system from scattered state management to a fully declarative, FormProvider-driven architecture.

---

## 🎯 Phase 1: Core Architecture Setup (45% complete)

### 1.1 Enhanced FormProvider Context
- [ ] **1.1.1** Create unified FormProvider with complete API
  - [ ] `getField(name)` - retrieve field value with nested support
  - [ ] `setField(name, value)` - update single field
  - [ ] `setFields(partial)` - batch updates
  - [ ] `reset()` - reset to initial state
  - [ ] `subscribe(listener)` - optional reactivity optimization
  - [ ] Support for nested structures (FieldGroup, TabGroups)
  - [ ] Type-safe field operations

- [ ] **1.1.2** Update form-provider.tsx
  - [ ] Remove basic createFormContext
  - [ ] Implement full FormProvider component
  - [ ] Add useFormContext hook
  - [ ] Add useFormField(name) hook for individual field access
  - [ ] Add type definitions for FormContextType

### 1.2 Form Field Types & Schema
- [ ] **1.2.1** Define comprehensive Field type
  - [ ] Support for all field types (text, select, async-select, multi-select, switch, textarea, etc.)
  - [ ] Validation schema (required, pattern, min, max, etc.)
  - [ ] Default values and initial state
  - [ ] Nested field support

- [ ] **1.2.2** Define FieldGroupSpec type
  - [ ] title, formStateField, mutationMode
  - [ ] fields[], columns[]
  - [ ] endpoint configuration
  - [ ] effects system
  - [ ] Validation rules per group

### 1.3 FormProvider Tests
- [ ] Unit tests for getField, setField, setFields, reset
- [ ] Tests for nested field access
- [ ] Subscription/listener tests
- [ ] Type check tests

---

## 🎨 Phase 2: FieldGroup Refactoring (15% complete)

### 2.1 MutationMode Standardization
- [ ] **2.1.1** Implement 'row' mode
  - [ ] Form fills fields → "Add" appends row → resets input
  - [ ] No sync bugs between input and state
  - [ ] Proper array handling (no splice mutations)

- [ ] **2.1.2** Implement 'cell' mode
  - [ ] Pure local editing
  - [ ] No persistence triggers
  - [ ] Save via explicit action only

- [ ] **2.1.3** Implement 'collection' mode
  - [ ] Maintain localRows internally
  - [ ] Add row / edit row / delete row operations
  - [ ] Single setField on Save

- [ ] **2.1.4** Implement 'field' mode
  - [ ] Immediate FormProvider update on field change
  - [ ] Debouncing allowed for performance
  - [ ] No batching required

### 2.2 FieldGroup Component Refactoring
- [ ] **2.2.1** Remove prop drilling
  - [ ] Eliminate formState prop
  - [ ] Eliminate updateField prop chain
  - [ ] Use FormProvider exclusively

- [ ] **2.2.2** Remove mixed RHF/external state
  - [ ] Remove unnecessary Controller usage
  - [ ] Remove manual sync effects
  - [ ] Standardize on FormProvider or RHF, not both

- [ ] **2.2.3** Implement Effects System
  - [ ] fetch effect (mount/watch triggers)
  - [ ] sync-form effect (field → field sync)
  - [ ] compute effect (computed fields)
  - [ ] Proper dependency tracking
  - [ ] No race conditions

- [ ] **2.2.4** Implement FieldGroup as spec runner
  - [ ] Create FieldGroupEngine component
  - [ ] Parse and execute spec
  - [ ] Handle all mutation modes
  - [ ] Execute effects pipeline

### 2.3 RenderField Refactoring
- [ ] **2.3.1** Use FormProvider exclusively
  - [ ] useFormContext() hook calls
  - [ ] useFormField(name) for individual fields
  - [ ] Remove value prop dependency

- [ ] **2.3.2** Pure event emission
  - [ ] No direct state mutation
  - [ ] Call FormProvider.setField() on change
  - [ ] Consistent change handling

- [ ] **2.3.3** Support all field types
  - [ ] text, email, password, textarea
  - [ ] select, multi-select
  - [ ] async-select, multi-async-select
  - [ ] remote-select
  - [ ] switch, checkbox
  - [ ] json-editor
  - [ ] custom field types

---

## 📊 Phase 3: Progression & Stepper System (5% complete)

### 3.1 Breadcrumb/Stepper System
- [ ] **3.1.1** Create unified progress tracker
  - [ ] Active step tracking
  - [ ] Completed steps tracking
  - [ ] Disabled steps (waitFor conditions)
  - [ ] Form progression state

- [ ] **3.1.2** Implement Mantine Stepper integration
  - [ ] Display correct active step
  - [ ] Disable incomplete steps
  - [ ] Sync with TabGroups.activeTab
  - [ ] Navigation controls

- [ ] **3.1.3** Optional URL sync
  - [ ] Sync step progress to URL params
  - [ ] Restore progress from URL
  - [ ] Browser back/forward support

### 3.2 TabGroups Integration
- [ ] **3.2.1** Extend TabGroups with step tracking
  - [ ] Map tabs to steps
  - [ ] Reflect waitFor conditions
  - [ ] Sync activeTab with stepper

- [ ] **3.2.2** FieldGroup progression
  - [ ] Track completion state
  - [ ] Support conditional visibility
  - [ ] Enable/disable based on conditions

---

## ✨ Phase 4: Advanced Features (0% complete)

### 4.1 Validation Layer
- [ ] **4.1.1** Per-FieldGroup validation
  - [ ] Schema-based validation (Zod/Yup/etc.)
  - [ ] Async validation support
  - [ ] Error aggregation and display

- [ ] **4.1.2** Per-field validation
  - [ ] Real-time validation feedback
  - [ ] Debounced async validation
  - [ ] Error messages and styling

### 4.2 State Tracking
- [ ] **4.2.1** Dirty-state tracking
  - [ ] Track which fields were modified
  - [ ] Per-step/tab dirty state
  - [ ] Enable/disable Save based on dirty state

- [ ] **4.2.2** Autosave for field mode
  - [ ] Debounced auto-save
  - [ ] Save indicator/feedback
  - [ ] Error handling for failed saves

### 4.3 Advanced Field Dependencies
- [ ] **4.3.1** Dependency graph system
  - [ ] Field A change triggers recompute of B
  - [ ] Cascade effects
  - [ ] Circular dependency detection
  - [ ] Computed field values

### 4.4 Async Field Optimization
- [ ] **4.4.1** Deduplication of requests
  - [ ] Cache async select options
  - [ ] Debounce search requests
  - [ ] Abort in-flight requests when unmounting

- [ ] **4.4.2** Remote Select Field improvements
  - [ ] Proper error handling
  - [ ] Loading state management
  - [ ] Fallback handling

---

## 🧹 Phase 5: Full Refactoring & Cleanup (0% complete)

### 5.1 Remove Old Code
- [ ] Remove formState prop drilling from all components
- [ ] Remove updateField chains
- [ ] Eliminate mixed RHF Controller usage
- [ ] Remove unsafe mutations (splice, direct object mutation)

### 5.2 Normalize Value Types
- [ ] [ ] Define strict value type: `string | number | boolean | Option | Option[] | null`
- [ ] [ ] Validate all fields conform to type
- [ ] [ ] Add type guards and helpers

### 5.3 Code Modernization
- [ ] [ ] Remove deprecated React patterns
- [ ] [ ] Update to latest Mantine v7+ API
- [ ] [ ] Add proper TypeScript strict mode support
- [ ] [ ] Optimize performance with React.memo where needed

### 5.4 Testing & Documentation
- [ ] [ ] Write comprehensive unit tests for all components
- [ ] [ ] Integration tests for form flows
- [ ] [ ] Update documentation with examples
- [ ] [ ] Add JSDoc comments to all public APIs

---

## 📁 File Structure Changes

### Core Files to Create/Update
```
src/features/components/form/
├── form-provider.tsx          ✏️ REFACTOR
├── FieldGroup.tsx             ✏️ REFACTOR → FieldGroupEngine
├── RenderField.tsx            ✏️ REFACTOR
├── ModalDataForm.tsx          ✏️ REFACTOR
├── async-field.tsx            ✏️ REFACTOR
├── remote-select-field.tsx    ✏️ REFACTOR
├── select.tsx                 ✏️ REFACTOR
├── multiselect.tsx            ✏️ REFACTOR
├── form-context.ts            🆕 CREATE (types & hooks)
├── field-group-engine.tsx     🆕 CREATE
├── field-renderer.tsx         🆕 CREATE
├── mutations.ts               🆕 CREATE (mutation handlers)
├── effects.ts                 🆕 CREATE (effects system)
├── stepper.tsx                🆕 CREATE
├── hooks/
│   ├── useFormContext.ts      🆕 CREATE
│   ├── useFormField.ts        🆕 CREATE
│   ├── useFieldArray.ts       🆕 CREATE (optional)
│   └── useFormSubscription.ts 🆕 CREATE (optional)
└── types/
    ├── form.ts                🆕 CREATE
    ├── field.ts               🆕 CREATE
    ├── effects.ts             🆕 CREATE
    └── mutations.ts           🆕 CREATE
```

---

## 📊 Success Criteria

✅ Single FormProvider state layer (no prop drilling)
✅ No sync bugs between inputs and form state
✅ Predictable mutationMode behavior (row/cell/collection/field)
✅ TabGroups + FieldGroups unified under one progression system
✅ Fully schema-driven form system (no imperative logic in UI)
✅ 100% TypeScript coverage
✅ Comprehensive test suite
✅ Zero breaking changes for existing implementations (backward compatibility)

---

## 🚀 Next Immediate Steps

1. **Create enhanced FormProvider** (Phase 1.1)
2. **Define comprehensive types** (Phase 1.2)
3. **Refactor FieldGroup** (Phase 2.1-2.2)
4. **Refactor RenderField** (Phase 2.3)
5. **Add Stepper system** (Phase 3)

---

## 📝 Notes

- Keep existing ModalDataForm working during refactor (incremental approach)
- Aim for zero breaking changes for current consumers
- Add deprecation warnings before removing old patterns
- Benchmark performance improvements
