import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const taskId: string | undefined = body?.taskId
    const updates: Record<string, any> = body?.updates ?? {}

    if (!taskId) {
      return NextResponse.json({ error: "Missing taskId" }, { status: 400 })
    }

    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch the task to determine project membership for authorization
    const { data: taskRow, error: taskErr } = await supabase.from("tasks").select("project_id").eq("id", taskId).single()
    if (taskErr || !taskRow) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    const projectId = (taskRow as any).project_id

    if (projectId) {
      const { data: projectRow, error: projectErr } = await supabase
        .from("projects_new")
        .select("company_id")
        .eq("id", projectId)
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

    // Perform update
    const { data, error } = await supabase.from("tasks").update(updates).eq("id", taskId).select().single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ task: data })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Internal server error" }, { status: 500 })
  }
}
