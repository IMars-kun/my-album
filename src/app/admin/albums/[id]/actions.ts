'use server'

import { createClient } from '../../../../lib/serverClient'
import { revalidatePath } from 'next/cache'

import { ALLOWED_EMAILS } from '../../../../lib/auth'


async function checkAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !user.email || !ALLOWED_EMAILS.includes(user.email)) {
    throw new Error('Unauthorized')
  }

  return { supabase, user }
}

export async function uploadPhoto(formData: FormData) {
  const { supabase, user } = await checkAuth()
  const albumId = formData.get('albumId') as string
  const file = formData.get('file') as File

  if (!file) throw new Error('No file uploaded')

  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `${albumId}/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('photos')
    .upload(filePath, file)

  if (uploadError) throw uploadError

  const { data: { publicUrl } } = supabase.storage
    .from('photos')
    .getPublicUrl(filePath)

  const { error: dbError } = await supabase
    .from('photos')
    .insert([{
      album_id: albumId,
      image_url: publicUrl,
      uploaded_by: user.id
    }])

  if (dbError) throw dbError

  revalidatePath(`/admin/albums/${albumId}`)
}

export async function deletePhoto(formData: FormData) {
  const { supabase } = await checkAuth()
  const photoId = formData.get('photoId') as string
  const albumId = formData.get('albumId') as string
  const imageUrl = formData.get('imageUrl') as string

  // Extract file path from URL
  // Public URL format: .../storage/v1/object/public/photos/ALBUM_ID/FILE_NAME
  const pathParts = imageUrl.split('/photos/')
  if (pathParts.length > 1) {
    const filePath = pathParts[1]
    await supabase.storage
      .from('photos')
      .remove([filePath])
  }

  const { error } = await supabase
    .from('photos')
    .delete()
    .eq('id', photoId)

  if (error) throw error

  revalidatePath(`/admin/albums/${albumId}`)
}

export async function updatePhoto(formData: FormData) {
  const { supabase, user } = await checkAuth()
  const photoId = formData.get('photoId') as string
  const albumId = formData.get('albumId') as string
  const oldImageUrl = formData.get('oldImageUrl') as string
  const file = formData.get('file') as File

  if (!file || file.size === 0) throw new Error('No file selected')

  // Upload new file
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `${albumId}/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('photos')
    .upload(filePath, file)

  if (uploadError) throw uploadError

  const { data: { publicUrl } } = supabase.storage
    .from('photos')
    .getPublicUrl(filePath)

  // Delete old file from storage
  const pathParts = oldImageUrl.split('/photos/')
  if (pathParts.length > 1) {
    await supabase.storage
      .from('photos')
      .remove([pathParts[1]])
  }

  // Update DB record with new URL
  const { error: dbError } = await supabase
    .from('photos')
    .update({
      image_url: publicUrl,
      uploaded_by: user.id
    })
    .eq('id', photoId)

  if (dbError) throw dbError

  revalidatePath(`/admin/albums/${albumId}`)
}
