import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
/* use the built-in crypto.randomUUID() available in the Node/Edge runtime instead of the uuid package */

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const name: string | undefined = body?.name
    const description: string | null = body?.description ?? null
    const project_id: string | null = body?.project_id ?? null
    const assigned_to: string | null = body?.assigned_to ?? null
    const priority: string = body?.priority ?? "medium"
    const status: string = body?.status ?? "not_started"
    const estimated_hours: number | null = body?.estimated_hours ?? null
    const due_date: string | null = body?.due_date ?? null
    const parent_task_id: string | null = body?.parent_task_id ?? null
    const notes: string | null = body?.notes ?? null

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: "Missing required field: name" }, { status: 400 })
    }

    const supabase = await createClient()

    // auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // If project specified, verify membership with the project's company (follow projects pattern)
    if (project_id) {
      const { data: projectRow, error: projectErr } = await supabase
        .from("projects_new")
        .select("company_id")
        .eq("id", project_id)
        .single()

      if (projectErr || !projectRow) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 })
      }

      const { data: membership, error: membershipErr } = await supabase
        .from("user_companies")
        .select("company_id")
        .eq("user_id", user.id)
        .eq("company_id", (projectRow as any).company_id)
        .single()

      if (membershipErr || !membership) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
    }

    const newId = (globalThis as any).crypto?.randomUUID ? (globalThis as any).crypto.randomUUID() : undefined

    const insertRow: any = {
      id: newId,
      project_id,
      parent_task_id,
      name,
      description,
      status,
      priority,
      assigned_to,
      estimated_hours,
      due_date,
      completion_percentage: 0,
    }

    const { data, error } = await supabase.from("tasks").insert(insertRow).select().single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ task: data })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Internal server error" }, { status: 500 })
  }
}
