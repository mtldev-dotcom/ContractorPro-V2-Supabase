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

    // Ownership / authorization check
    const { data: projectRow, error: projectErr } = await supabase
      .from('projects_new')
      .select('owner_id')
      .eq('id', projectId)
      .single()

    if (projectErr || !projectRow) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    if ((projectRow as any).owner_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { error } = await supabase
      .from('projects_new')
      .update({ status: 'cancelled' })
      .eq('id', projectId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Internal server error' }, { status: 500 })
  }
}
