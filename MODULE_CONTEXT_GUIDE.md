# Module Context Provider - Usage Guide

## Overview

The Module Context Provider replaces the Zustand-based module store with a React Context API implementation. It provides a centralized way to manage module selection and access module-specific data across your application.

## Architecture

### Files Created:

1. **`src/context/module-context.tsx`** - Context definition and hooks
2. **`src/context/module-provider.tsx`** - Provider component
3. **`src/stores/module-store.ts`** - Compatibility layer (updated)
4. **`src/main.tsx`** - Root wrapper (updated)

## Available Hooks

### `useModuleContext()`
Returns the complete module context with all properties.

```tsx
import { useModuleContext } from '@/context/module-context'

function MyComponent() {
  const {
    selectedModule,      // Current module ID
    setSelectedModule,   // Change module
    currentModuleDefinition, // Full module definition object
    moduleId,           // Current module ID
    apiProvider,        // Axios instance for API calls
    moduleName,         // Module title/name
    moduleDescription,  // Module description
    moduleRoot,         // Module root path
    modules,            // All available modules
  } = useModuleContext()

  return <div>{moduleName}</div>
}
```

### `useModuleId()`
Get the current module ID only.

```tsx
import { useModuleId } from '@/context/module-context'

function MyComponent() {
  const moduleId = useModuleId() // 'rxsoft' | 'lis' | 'conversation' | ...
  return <div>{moduleId}</div>
}
```

### `useApiProvider()`
Get the API provider (Axios instance) for the current module.

```tsx
import { useApiProvider } from '@/context/module-context'

async function fetchData() {
  const apiProvider = useApiProvider()
  const response = await apiProvider.get('/some-endpoint')
  return response.data
}
```

### `useModuleName()`
Get the current module's display name.

```tsx
import { useModuleName } from '@/context/module-context'

function Header() {
  const moduleName = useModuleName()
  return <h1>{moduleName}</h1>
}
```

### `useModuleDefinition()`
Get the full module definition object.

```tsx
import { useModuleDefinition } from '@/context/module-context'

function ModuleInfo() {
  const module = useModuleDefinition()
  return (
    <div>
      <h2>{module.title}</h2>
      <p>{module.description}</p>
      <p>Root: {module.root}</p>
    </div>
  )
}
```

### `useSetSelectedModule()`
Get the function to change the selected module.

```tsx
import { useSetSelectedModule } from '@/context/module-context'

function ModuleSwitcher() {
  const setSelectedModule = useSetSelectedModule()

  return (
    <button onClick={() => setSelectedModule('lis')}>
      Switch to LIS Module
    </button>
  )
}
```

### `useAvailableModules()`
Get all available modules.

```tsx
import { useAvailableModules } from '@/context/module-context'

function ModuleList() {
  const modules = useAvailableModules()

  return (
    <ul>
      {modules.map((module) => (
        <li key={module.id}>{module.title}</li>
      ))}
    </ul>
  )
}
```

### `useModuleStore()` (Deprecated)
Backward compatibility wrapper - use `useModuleContext()` instead.

```tsx
import { useModuleStore } from '@/stores/module-store'

function LegacyComponent() {
  const store = useModuleStore()
  return <div>{store.moduleName}</div>
}
```

## Migration from Zustand Store

### Before (Zustand):
```tsx
import { useModuleStore } from '@/stores/module-store'

function Component() {
  const { selectedModule, setSelectedModule } = useModuleStore()
  return (
    <div>
      {selectedModule}
      <button onClick={() => setSelectedModule('lis')}>
        Switch to LIS
      </button>
    </div>
  )
}
```

### After (Context):
```tsx
// Option 1: Use complete context
import { useModuleContext } from '@/context/module-context'

function Component() {
  const { moduleId, setSelectedModule } = useModuleContext()
  return (
    <div>
      {moduleId}
      <button onClick={() => setSelectedModule('lis')}>
        Switch to LIS
      </button>
    </div>
  )
}

// Option 2: Use individual hooks (recommended for most cases)
import { useModuleId, useSetSelectedModule } from '@/context/module-context'

function Component() {
  const moduleId = useModuleId()
  const setSelectedModule = useSetSelectedModule()
  
  return (
    <div>
      {moduleId}
      <button onClick={() => setSelectedModule('lis')}>
        Switch to LIS
      </button>
    </div>
  )
}
```

## Module Types and Values

Available module IDs:
- `'conversation'` → Conversation
- `'communication'` → Switch
- `'coding-concept'` → Coding Concept
- `'lis'` → Laboratory Information System
- `'rxsoft'` → RxSoft (default)
- `'admin'` → Admin Console

Each module has:
- `id`: ModuleId - Unique identifier
- `title`: string - Display name
- `description`: string - Module description
- `root`: string - Base route path
- `apiProvider`: AxiosInstance - Axios instance for API calls

## Storage

Module selection is persisted in localStorage under the key `rxsoft_admin_selected_module`. The provider automatically:
- Loads the last selected module on app startup
- Saves the selection when changed
- Defaults to `'rxsoft'` if no valid selection is stored

## Example: Complete Module Switcher Component

```tsx
import { useModuleId, useSetSelectedModule, useAvailableModules } from '@/context/module-context'

export function ModuleSwitcher() {
  const currentModuleId = useModuleId()
  const setSelectedModule = useSetSelectedModule()
  const availableModules = useAvailableModules()

  return (
    <div className="module-switcher">
      <p>Current Module: <strong>{currentModuleId}</strong></p>
      <div className="module-buttons">
        {availableModules.map((module) => (
          <button
            key={module.id}
            onClick={() => setSelectedModule(module.id)}
            className={currentModuleId === module.id ? 'active' : ''}
            title={module.description}
          >
            {module.title}
          </button>
        ))}
      </div>
    </div>
  )
}
```

## Example: Module-Aware API Component

```tsx
import { useApiProvider, useModuleName } from '@/context/module-context'
import { useQuery } from '@tanstack/react-query'

export function ModuleData() {
  const apiProvider = useApiProvider()
  const moduleName = useModuleName()

  const { data, isLoading, error } = useQuery({
    queryKey: [moduleName, 'data'],
    queryFn: async () => {
      const response = await apiProvider.get('/data')
      return response.data
    },
  })

  if (isLoading) return <div>Loading {moduleName} data...</div>
  if (error) return <div>Error loading {moduleName}</div>

  return (
    <div>
      <h2>{moduleName} Data</h2>
      {/* Render data */}
    </div>
  )
}
```

## Features

✅ Application-wide module state management
✅ Persistent module selection (localStorage)
✅ Direct access to module definitions and API providers
✅ Type-safe with TypeScript
✅ Multiple granular hooks for flexibility
✅ Backward compatible with existing code
✅ Zero additional dependencies (uses React Context)

## Notes

- The provider must wrap the entire application for all hooks to work
- Module selection is persisted across page reloads
- The context is available to all components within the provider tree
- SSR-safe: checks for `window` before accessing localStorage
