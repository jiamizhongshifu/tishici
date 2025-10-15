'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '../lib/supabase/server';

export async function createPrompt(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const title = (formData.get('title') as string)?.trim();
  const content = (formData.get('content') as string)?.trim();
  const category_id = (formData.get('category_id') as string) || null;

  if (!title || !content) return;

  await supabase.from('prompts').insert({
    title,
    content,
    category_id,
    user_id: user.id,
  });

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export async function deletePrompt(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const id = formData.get('id') as string;
  if (!id) return;

  await supabase.from('prompts').delete().eq('id', id);
  revalidatePath('/dashboard');
}

