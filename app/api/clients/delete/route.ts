import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const clientId: string | undefined = body?.clientId

    if (!clientId) {
      return NextResponse.json({ error: 'Missing clientId' }, { status: 400 })
    }

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Ownership / authorization check
    const { data: clientRow, error: clientErr } = await supabase
      .from('clients')
      .select('owner_id')
      .eq('id', clientId)
      .single()

    if (clientErr || !clientRow) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    if ((clientRow as any).owner_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Prefer an atomic DB-side operation if available (RPC). Fall back to safe sequenced operations.
    const { error: rpcErr } = await supabase.rpc('delete_client_and_children', { p_client_id: clientId })

    if (rpcErr) {
      // Fallback sequence (attempt to preserve data integrity as best-effort)
      const { error: e1 } = await supabase.from('projects_new').update({ client_id: null }).eq('client_id', clientId)
      if (e1) return NextResponse.json({ error: e1.message }, { status: 500 })

      const { error: e2 } = await supabase.from('documents').update({ client_id: null }).eq('client_id', clientId)
      if (e2) return NextResponse.json({ error: e2.message }, { status: 500 })

      const { error: e3 } = await supabase.from('communications').delete().eq('client_id', clientId)
      if (e3) return NextResponse.json({ error: e3.message }, { status: 500 })

      const { error: e4 } = await supabase.from('clients').delete().eq('id', clientId)
      if (e4) return NextResponse.json({ error: e4.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Internal server error' }, { status: 500 })
  }
}
