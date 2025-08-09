# Auth with Supabase (SSR)

This project uses `@supabase/ssr` to unify Supabase client usage across browser and server environments. Below is a summary of how to use the utilities provided in `/utils/supabase/`.

## Utilities

### 1. `client.ts`
- **Purpose**: For use in Client Components.
- **Usage**:
  ```typescript
  import { createClient } from '@/utils/supabase/client';
  const supabase = createClient();
  ```

### 2. `server.ts`
- **Purpose**: For use in Server Components, Actions, and Route Handlers.
- **Usage**:
  ```typescript
  import { createClient } from '@/utils/supabase/server';
  const supabase = await createClient();
  ```

### 3. `middleware.ts`
- **Purpose**: Handles session management in middleware.
- **Usage**:
  The root `middleware.ts` already integrates this utility. No additional setup is required.

## Environment Variables
Ensure the following environment variables are set:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

If these variables are missing, the application will throw an error at runtime.

## Notes
- The `@supabase/ssr` package manages cookies and session storage automatically.
- Avoid duplicating client logic; always use the provided utilities.
- Business logic (e.g., user authentication) should be handled in layouts or actions, not in middleware.
