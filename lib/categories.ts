export function slugifyCategory(name: string): string {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'category'
  ).slice(0, 64);
}

type SupabaseClient = {
  from: (table: string) => any;
};

export async function ensureCategory(
  supabase: SupabaseClient,
  name: string
): Promise<string> {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error('Category name required');
  }

  const baseSlug = slugifyCategory(trimmed);

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const slug = attempt === 0 ? baseSlug : `${baseSlug}-${attempt + 1}`;
    const { data: existing, error: selectError } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();

    if (selectError) {
      throw selectError;
    }

    if (existing?.id) {
      return existing.id;
    }

    const { data: inserted, error: insertError } = await supabase
      .from('categories')
      .insert({
        name: trimmed,
        slug,
      })
      .select('id')
      .single();

    if (!insertError && inserted?.id) {
      return inserted.id;
    }

    if (insertError?.message?.includes('duplicate key')) {
      continue;
    }

    if (insertError) {
      throw insertError;
    }
  }

  throw new Error('Unable to create category');
}
