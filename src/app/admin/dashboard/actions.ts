'use server'

import { createClient } from '../../../lib/serverClient'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const ALLOWED_EMAILS = [
  'berlymarcellino25@gmail.com',
  'meilamustikaartjob@gmail.com',
]

async function checkAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !user.email || !ALLOWED_EMAILS.includes(user.email)) {
    throw new Error('Unauthorized')
  }

  return { supabase, user }
}

export async function createAlbum(formData: FormData) {
  const { supabase, user } = await checkAuth()
  const title = formData.get('title') as string
  const description = formData.get('description') as string

  const { error } = await supabase
    .from('albums')
    .insert([{ title, description, owner_id: user.id }])

  if (error) throw error

  revalidatePath('/admin/dashboard')
  redirect('/admin/dashboard')
}

export async function updateAlbum(formData: FormData) {
  const { supabase } = await checkAuth()
  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string

  const { error } = await supabase
    .from('albums')
    .update({ title, description })
    .eq('id', id)

  if (error) throw error

  revalidatePath('/admin/dashboard')
}

export async function deleteAlbum(formData: FormData) {
  const { supabase } = await checkAuth()
  const id = formData.get('id') as string

  // 1. Fetch all photos to get their paths for storage cleanup
  const { data: photos } = await supabase
    .from('photos')
    .select('image_url')
    .eq('album_id', id)

  if (photos && photos.length > 0) {
    const paths = photos
      .map((p) => {
        const parts = p.image_url.split('/photos/')
        return parts.length > 1 ? parts[1] : null
      })
      .filter(Boolean) as string[]

    if (paths.length > 0) {
      // Delete all photos in this album from storage
      await supabase.storage.from('photos').remove(paths)
    }
  }

  // 2. Delete the album (cascade should handle the photo records in DB)
  const { error } = await supabase
    .from('albums')
    .delete()
    .eq('id', id)

  if (error) throw error

  revalidatePath('/admin/dashboard')
}
export async function setAlbumCover(albumId: string, imageUrl: string) {
  const { supabase } = await checkAuth()

  const { error } = await supabase
    .from('albums')
    .update({ cover_url: imageUrl })
    .eq('id', albumId)

  if (error) throw error

  revalidatePath('/admin/dashboard')
  revalidatePath(`/admin/albums/${albumId}`)
  revalidatePath('/gallery')
}
