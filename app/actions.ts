'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createActionClient } from '../lib/supabase/server';
import { ensureCategory } from '../lib/categories';

export type CreatePromptState = {
  success: boolean;
  error?: string;
};

export type PromptActionHandler = (
  prevState: CreatePromptState,
  formData: FormData
) => Promise<CreatePromptState>;

export async function createPrompt(
  _prevState: CreatePromptState,
  formData: FormData
): Promise<CreatePromptState> {
  const supabase = createActionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'NOT_AUTHENTICATED' };
  }

  const redirectTo = (formData.get('redirectTo') as string | null)?.trim() || '';
  let title = (formData.get('title') as string | null)?.trim() || '';
  const content = (formData.get('content') as string | null)?.trim() || '';
  const selectedCategoryId = (formData.get('category_id') as string | null)?.trim() || null;
  const customCategoryName = (formData.get('category_name') as string | null)?.trim() || '';

  if (!content) {
    return { success: false, error: 'CONTENT_REQUIRED' };
  }

  if (!title) {
    const fallback = content.split('\n').map((line) => line.trim()).filter(Boolean)[0] ?? '';
    if (!fallback) {
      return { success: false, error: 'TITLE_REQUIRED' };
    }
    title = fallback.slice(0, 80);
  }

  let categoryId = selectedCategoryId;
  if (customCategoryName) {
    try {
      categoryId = await ensureCategory(supabase, customCategoryName);
    } catch {
      return { success: false, error: 'CATEGORY_CREATE_FAILED' };
    }
  }

  const { error: insertError } = await supabase
    .from('prompts')
    .insert({
      title,
      content,
      category_id: categoryId,
      user_id: user.id,
    })
    .select('id')
    .single();

  if (insertError) {
    return { success: false, error: insertError.message };
  }

  revalidatePath('/');
  revalidatePath('/dashboard');

  if (redirectTo && redirectTo !== 'stay') {
    redirect(redirectTo);
  }

  return { success: true };
}

export async function updatePrompt(
  _prevState: CreatePromptState,
  formData: FormData
): Promise<CreatePromptState> {
  const supabase = createActionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'NOT_AUTHENTICATED' };
  }

  const promptId = (formData.get('prompt_id') as string | null)?.trim();
  if (!promptId) {
    return { success: false, error: 'MISSING_PROMPT_ID' };
  }

  const redirectTo = (formData.get('redirectTo') as string | null)?.trim() || '';
  let title = (formData.get('title') as string | null)?.trim() || '';
  const content = (formData.get('content') as string | null)?.trim() || '';
  const selectedCategoryId = (formData.get('category_id') as string | null)?.trim() || null;
  const customCategoryName = (formData.get('category_name') as string | null)?.trim() || '';

  if (!content) {
    return { success: false, error: 'CONTENT_REQUIRED' };
  }

  if (!title) {
    const fallback = content.split('\n').map((line) => line.trim()).filter(Boolean)[0] ?? '';
    if (!fallback) {
      return { success: false, error: 'TITLE_REQUIRED' };
    }
    title = fallback.slice(0, 80);
  }

  let categoryId = selectedCategoryId;
  if (customCategoryName) {
    try {
      categoryId = await ensureCategory(supabase, customCategoryName);
    } catch {
      return { success: false, error: 'CATEGORY_CREATE_FAILED' };
    }
  }

  const { error: updateError } = await supabase
    .from('prompts')
    .update({
      title,
      content,
      category_id: categoryId,
    })
    .eq('id', promptId)
    .eq('user_id', user.id);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  revalidatePath('/');
  revalidatePath('/dashboard');
  revalidatePath(`/prompts/${promptId}`);

  if (redirectTo && redirectTo !== 'stay') {
    redirect(redirectTo);
  }

  return { success: true };
}

export async function importPackPrompt(formData: FormData) {
  const supabase = createActionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  let title = (formData.get('title') as string | null)?.trim() || '';
  const content = (formData.get('content') as string | null)?.trim() || '';
  const redirectTo = (formData.get('redirectTo') as string | null)?.trim() || '/';

  if (!content) {
    redirect(redirectTo || '/');
  }

  if (!title) {
    const fallback = content.split('\n').map((line) => line.trim()).filter(Boolean)[0] ?? '';
    title = fallback.slice(0, 80) || 'Imported prompt';
  }

  const { error: insertError } = await supabase
    .from('prompts')
    .insert({
      title,
      content,
      category_id: null,
      user_id: user.id,
    })
    .select('id')
    .single();

  if (insertError) {
    throw insertError;
  }

  revalidatePath('/');
  revalidatePath('/dashboard');
  redirect(redirectTo || '/');
}
