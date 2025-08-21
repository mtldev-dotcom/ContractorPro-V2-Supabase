import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const projectId: string | undefined = body?.projectId

    if (!projectId) {
      return NextResponse.json({ error: 'Missing projectId' }, { status: 400 })
    }

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Authorization check: ensure the project exists and the user belongs to the same company
    const { data: projectRow, error: projectErr } = await supabase
      .from('projects_new')
      .select('company_id')
      .eq('id', projectId)
      .single()

    if (projectErr || !projectRow) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Verify user is associated with the project's company
    const { data: membership, error: membershipErr } = await supabase
      .from('user_companies')
      .select('company_id')
      .eq('user_id', user.id)
      .eq('company_id', (projectRow as any).company_id)
      .single()

    if (membershipErr || !membership) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Prefer atomic DB-side RPC if available
    const { error: rpcErr } = await supabase.rpc('delete_project_and_children', { p_project_id: projectId })

    if (rpcErr) {
      // Fallback sequence: attempt safe deletes/updates
      const { error: eqErr } = await supabase
        .from('equipment')
        .update({ current_project_id: null })
        .eq('current_project_id', projectId)
      if (eqErr) return NextResponse.json({ error: eqErr.message }, { status: 500 })

      const childTables = ['tasks', 'documents', 'communications', 'change_orders', 'material_usage']
      for (const table of childTables) {
        const { error } = await supabase.from(table).delete().eq('project_id', projectId)
        if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      }

      const { error: projectDeleteError } = await supabase.from('projects_new').delete().eq('id', projectId)
      if (projectDeleteError) return NextResponse.json({ error: projectDeleteError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Internal server error' }, { status: 500 })
  }
}
