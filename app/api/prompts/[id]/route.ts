import { NextResponse } from 'next/server';
import { createActionClient } from '../../../../lib/supabase/server';

type Params = {
  params: {
    id: string;
  };
};

export async function DELETE(_: Request, { params }: Params) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: 'Missing prompt ID' }, { status: 400 });
  }

  try {
    const supabase = createActionClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { error } = await supabase.from('prompts').delete().eq('id', id).eq('user_id', user.id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete prompt error', error);
    return NextResponse.json({ error: error?.message || 'Failed to delete prompt' }, { status: 500 });
  }
}
