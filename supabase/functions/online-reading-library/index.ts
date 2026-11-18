import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

const url = Deno.env.get('SUPABASE_URL')
const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const sessionSecret = Deno.env.get('ONLINE_LIBRARY_SESSION_SECRET')
const initialPassword = Deno.env.get('ONLINE_LIBRARY_INITIAL_PASSWORD')
const supabase = url && serviceKey ? createClient(url, serviceKey) : null
const encoder = new TextEncoder()
const BUCKET = 'online-library'
const COVER_BUCKET = 'online-library-covers'

const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
})

const bytesToBase64Url = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
const base64UrlToBytes = (value: string) => Uint8Array.from(atob(value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - value.length % 4) % 4)), c => c.charCodeAt(0))

async function digestPassword(password: string, salt: string) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits'])
  const result = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: encoder.encode(salt), iterations: 180000, hash: 'SHA-256' }, key, 256)
  return bytesToBase64Url(new Uint8Array(result))
}

async function signPayload(payload: Record<string, unknown>) {
  if (!sessionSecret) throw new Error('Server signing is not configured')
  const body = bytesToBase64Url(encoder.encode(JSON.stringify(payload)))
  const key = await crypto.subtle.importKey('raw', encoder.encode(sessionSecret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(body))
  return `${body}.${bytesToBase64Url(new Uint8Array(signature))}`
}

async function verifyToken(token: string, audience: 'reader' | 'admin') {
  if (!sessionSecret) return null
  const [body, signature] = token.split('.')
  if (!body || !signature) return null
  const key = await crypto.subtle.importKey('raw', encoder.encode(sessionSecret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify'])
  const valid = await crypto.subtle.verify('HMAC', key, base64UrlToBytes(signature), encoder.encode(body))
  if (!valid) return null
  const payload = JSON.parse(new TextDecoder().decode(base64UrlToBytes(body))) as { aud?: string; exp?: number }
  if (payload.aud !== audience || !payload.exp || payload.exp < Date.now()) return null
  return payload
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (!supabase || !initialPassword || !sessionSecret) return reply({ error: 'Library service is not configured' }, 503)

  try {
    const input = await req.json()
    const action = typeof input.action === 'string' ? input.action : ''

    if (action === 'unlock') {
      const password = typeof input.password === 'string' ? input.password.slice(0, 256) : ''
      if (!password) return reply({ error: 'പാസ്‌വേഡ് നൽകുക' }, 400)
      const { data: settings, error } = await supabase.from('online_library_settings').select('password_salt,password_hash').eq('id', 'access').maybeSingle()
      if (error) throw error
      const valid = settings?.password_hash && settings.password_salt
        ? (await digestPassword(password, settings.password_salt)) === settings.password_hash
        : password === initialPassword
      if (!valid) return reply({ error: 'പാസ്‌വേഡ് ശരിയല്ല' }, 401)
      const token = await signPayload({ aud: 'reader', exp: Date.now() + 8 * 60 * 60 * 1000 })
      return reply({ token })
    }

    if (action === 'admin-login') {
      const username = typeof input.username === 'string' ? input.username.trim().slice(0, 255) : ''
      const password = typeof input.password === 'string' ? input.password.slice(0, 256) : ''
      if (!username || !password) return reply({ error: 'യൂസർനെയിമും പാസ്‌വേഡും നൽകുക' }, 400)
      const { data, error } = await supabase.from('admin_credentials').select('id,username,password_hash').eq('id', 'admin').eq('username', username).maybeSingle()
      if (error) throw error
      if (!data || data.password_hash !== password) return reply({ error: 'തെറ്റായ യൂസർനെയിം അല്ലെങ്കിൽ പാസ്‌വേഡ്' }, 401)
      const token = await signPayload({ aud: 'admin', exp: Date.now() + 8 * 60 * 60 * 1000, username: data.username, id: data.id })
      return reply({ token })
    }

    if (action === 'admin-verify') {
      const password = typeof input.password === 'string' ? input.password.slice(0, 256) : ''
      const { data, error } = await supabase.from('admin_credentials').select('id,username,password_hash').eq('id', 'admin').maybeSingle()
      if (error) throw error
      if (!data || !password || data.password_hash !== password) return reply({ error: 'തെറ്റായ അഡ്മിൻ പാസ്‌വേഡ്' }, 401)
      const token = await signPayload({ aud: 'admin', exp: Date.now() + 8 * 60 * 60 * 1000, username: data.username, id: data.id })
      return reply({ token })
    }

    if (action === 'admin-credentials') {
      const currentPassword = typeof input.currentPassword === 'string' ? input.currentPassword.slice(0, 256) : ''
      const { data, error } = await supabase.from('admin_credentials').select('id,username,password_hash').eq('id', 'admin').maybeSingle()
      if (error) throw error
      if (!data || !currentPassword || data.password_hash !== currentPassword) return reply({ error: 'നിലവിലെ പാസ്‌വേഡ് തെറ്റാണ്' }, 401)
      const update: Record<string, string> = { updated_at: new Date().toISOString() }
      if (typeof input.username === 'string' && input.username.trim()) update.username = input.username.trim().slice(0, 255)
      if (typeof input.newPassword === 'string' && input.newPassword) {
        if (input.newPassword.length < 8 || input.newPassword.length > 128 || !/[0-9!@#$%^&*(),.?":{}|<>]/.test(input.newPassword)) return reply({ error: 'പുതിയ പാസ്‌വേഡിൽ 8 അക്ഷരവും ഒരു നമ്പർ അല്ലെങ്കിൽ പ്രത്യേക ചിഹ്നവും വേണം' }, 400)
        update.password_hash = input.newPassword
      }
      const { error: updateError } = await supabase.from('admin_credentials').update(update).eq('id', 'admin')
      if (updateError) throw updateError
      return reply({ success: true })
    }

    const authorization = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? ''
    if (action.startsWith('admin-')) {
      const admin = await verifyToken(authorization, 'admin')
      if (!admin) return reply({ error: 'Admin login required' }, 401)
      const tokenUsername = typeof admin.username === 'string' ? admin.username : ''
      const { data: adminRow, error: adminError } = await supabase.from('admin_credentials').select('id,username').eq('id', 'admin').eq('username', tokenUsername).maybeSingle()
      if (adminError) throw adminError
      if (!adminRow) return reply({ error: 'Admin session expired' }, 401)

      if (action === 'admin-password-change') {
        const newPassword = typeof input.newPassword === 'string' ? input.newPassword.trim() : ''
        if (newPassword.length < 8 || newPassword.length > 128) return reply({ error: 'Password must contain 8–128 characters' }, 400)
        const salt = bytesToBase64Url(crypto.getRandomValues(new Uint8Array(16)))
        const password_hash = await digestPassword(newPassword, salt)
        const { error } = await supabase.from('online_library_settings').upsert({ id: 'access', password_salt: salt, password_hash, updated_at: new Date().toISOString() })
        if (error) throw error
        return reply({ success: true })
      }

      if (action === 'admin-current') return reply({ username: adminRow.username })

      if (action === 'admin-list') {
        const { data: books, error } = await supabase.from('online_library_books').select('*').order('display_order').order('created_at', { ascending: false })
        if (error) throw error
        const storageBytes = await Promise.all([BUCKET, COVER_BUCKET].map(async bucket => {
          const { data: roots, error: fileError } = await supabase.storage.from(bucket).list('', { limit: 1000 })
          if (fileError) throw fileError
          let size = 0
          for (const item of roots ?? []) {
            if (item.id) size += Number(item.metadata?.size ?? 0)
            else {
              const { data: nested } = await supabase.storage.from(bucket).list(item.name, { limit: 1000 })
              size += (nested ?? []).reduce((sum, file) => sum + Number(file.metadata?.size ?? 0), 0)
            }
          }
          return size
        })).then(values => values.reduce((sum, value) => sum + value, 0))
        return reply({ books: books ?? [], storageBytes })
      }

      if (action === 'admin-save') {
        const book = input.book as Record<string, unknown> | undefined
        if (!book || typeof book.title !== 'string' || !book.title.trim() || typeof book.pdf_path !== 'string' || !book.pdf_path.startsWith('books/')) return reply({ error: 'Book title and PDF are required' }, 400)
        const pages = Number(book.total_pages)
        if (!Number.isInteger(pages) || pages < 1 || pages > 500) return reply({ error: 'A book must contain 1–500 pages' }, 400)
        if (!/^[^/]+\/(?:pdf|covers)\//.test(book.pdf_path as string)) return reply({ error: 'Invalid PDF location' }, 400)
        const id = typeof book.id === 'string' ? book.id : undefined
        if (book.visibility !== 'published' && book.visibility !== 'unpublished') return reply({ error: 'Choose a valid publication state' }, 400)
        if (typeof book.reading_direction !== 'string' || !['ltr', 'rtl'].includes(book.reading_direction)) return reply({ error: 'Choose a valid reading direction' }, 400)
        if (typeof book.page_format !== 'string' || !['a4-portrait', 'a4-landscape', 'a5-portrait', 'a5-landscape', 'custom', 'original'].includes(book.page_format)) return reply({ error: 'Choose a valid page format' }, 400)
        const coverPath = typeof book.cover_path === 'string' && book.cover_path.startsWith('covers/') ? book.cover_path : null
        const { data: pdfInfo, error: pdfInfoError } = await supabase.storage.from(BUCKET).info(book.pdf_path as string)
        if (pdfInfoError || !pdfInfo || pdfInfo.metadata?.mimetype !== 'application/pdf') return reply({ error: 'Uploaded PDF not found or file type is invalid' }, 400)
        if (Number(pdfInfo.metadata?.size ?? 0) > 500 * 1024 * 1024) return reply({ error: 'PDF must be 500 MB or smaller' }, 400)
        if (coverPath) {
          const { data: coverInfo, error: coverError } = await supabase.storage.from(COVER_BUCKET).info(coverPath)
          if (coverError || !coverInfo || !['image/jpeg', 'image/png', 'image/webp'].includes(String(coverInfo.metadata?.mimetype))) return reply({ error: 'Uploaded cover is missing or invalid' }, 400)
          if (Number(coverInfo.metadata?.size ?? 0) > 10 * 1024 * 1024) return reply({ error: 'Cover must be 10 MB or smaller' }, 400)
        }
        const fields = {
          title: book.title.trim().slice(0, 255),
          author: typeof book.author === 'string' ? book.author.trim().slice(0, 255) : '',
          description: typeof book.description === 'string' ? book.description.slice(0, 5000) : '',
          category: typeof book.category === 'string' ? book.category.trim().slice(0, 100) || 'General' : 'General',
          cover_path: coverPath,
          pdf_path: book.pdf_path as string,
          total_pages: pages,
          publication_date: typeof book.publication_date === 'string' && book.publication_date ? book.publication_date : null,
          book_language: typeof book.book_language === 'string' ? book.book_language.slice(0, 20) : 'ml',
          reading_direction: book.reading_direction,
          visibility: book.visibility,
          page_format: book.page_format,
          custom_page_width: Number.isFinite(Number(book.custom_page_width)) && Number(book.custom_page_width) > 0 ? Number(book.custom_page_width) : null,
          custom_page_height: Number.isFinite(Number(book.custom_page_height)) && Number(book.custom_page_height) > 0 ? Number(book.custom_page_height) : null,
          display_order: Number.isInteger(Number(book.display_order)) ? Number(book.display_order) : 0,
          updated_at: new Date().toISOString(),
        }
        if (id) {
          const { data: existing, error: existingError } = await supabase.from('online_library_books').select('pdf_path,cover_path').eq('id', id).maybeSingle()
          if (existingError) throw existingError
          if (!existing) return reply({ error: 'Book not found' }, 404)
          const oldPdf = existing.pdf_path
          const oldCover = existing.cover_path
          const { error: updateError } = await supabase.from('online_library_books').update(fields).eq('id', id)
          if (updateError) throw updateError
          if (oldPdf !== fields.pdf_path && typeof oldPdf === 'string' && oldPdf.startsWith('books/')) {
            const { error: removalError } = await supabase.storage.from(BUCKET).remove([oldPdf])
            if (removalError) throw removalError
          }
          if (oldCover !== fields.cover_path && typeof oldCover === 'string' && oldCover.startsWith('covers/')) {
            const { error: removalError } = await supabase.storage.from(COVER_BUCKET).remove([oldCover])
            if (removalError) throw removalError
          }
          const { data: saved, error: selectError } = await supabase.from('online_library_books').select().eq('id', id).single()
          if (selectError) throw selectError
          return reply({ book: saved })
        }
        const result = await supabase.from('online_library_books').insert(fields).select().single()
        if (result.error) throw result.error
        return reply({ book: result.data })
      }

      if (action === 'admin-delete') {
        const id = typeof input.id === 'string' ? input.id : ''
        const { data: book, error: readError } = await supabase.from('online_library_books').select('pdf_path,cover_path').eq('id', id).maybeSingle()
        if (readError) throw readError
        if (!book) return reply({ error: 'Book not found' }, 404)
        if (typeof book.pdf_path === 'string' && book.pdf_path.startsWith('books/')) {
          const { error: storageError } = await supabase.storage.from(BUCKET).remove([book.pdf_path])
          if (storageError) throw storageError
        }
        if (typeof book.cover_path === 'string' && book.cover_path.startsWith('covers/')) {
          const { error: coverError } = await supabase.storage.from(COVER_BUCKET).remove([book.cover_path])
          if (coverError) throw coverError
        }
        const { error } = await supabase.from('online_library_books').delete().eq('id', id)
        if (error) throw error
        return reply({ success: true })
      }

      if (action === 'admin-upload-url') {
        const name = typeof input.name === 'string' ? input.name : ''
        const type = typeof input.type === 'string' ? input.type : ''
        if (!['application/pdf', 'image/jpeg', 'image/png', 'image/webp'].includes(type)) return reply({ error: 'Use a PDF or JPG, PNG, WEBP cover' }, 400)
        const size = Number(input.size)
        const maxSize = type === 'application/pdf' ? 500 * 1024 * 1024 : 10 * 1024 * 1024
        if (!Number.isFinite(size) || size <= 0 || size > maxSize) return reply({ error: type === 'application/pdf' ? 'PDF must be 500 MB or smaller' : 'Cover must be 10 MB or smaller' }, 400)
        const safeName = name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-100)
        const folder = type === 'application/pdf' ? 'pdf' : 'covers'
        const path = `books/${folder}/${crypto.randomUUID()}-${safeName}`
        const bucket = type === 'application/pdf' ? BUCKET : COVER_BUCKET
        const { data, error } = await supabase.storage.from(bucket).createSignedUploadUrl(path)
        if (error) throw error
        return reply({ path, token: data.token })
      }

      return reply({ error: 'Unknown administrator action' }, 400)
    }

    const reader = await verifyToken(authorization, 'reader')
    if (!reader) return reply({ error: 'Enter the library password first' }, 401)

    if (action === 'catalog') {
      const { data, error } = await supabase.from('online_library_books').select('id,title,author,description,category,total_pages,publication_date,book_language,reading_direction,visibility,page_format,custom_page_width,custom_page_height,display_order,cover_path').eq('visibility', 'published').order('display_order').order('created_at', { ascending: false })
      if (error) throw error
      const books = await Promise.all((data ?? []).map(async book => {
        let coverUrl: string | null = null
        if (book.cover_path) {
          const { data: signed } = await supabase.storage.from(COVER_BUCKET).createSignedUrl(book.cover_path, 60 * 60)
          coverUrl = signed?.signedUrl ?? null
        }
        return { ...book, cover_url: coverUrl }
      }))
      return reply({ books })
    }

    if (action === 'read-url') {
      const id = typeof input.id === 'string' ? input.id : ''
      const { data: book, error } = await supabase.from('online_library_books').select('pdf_path').eq('id', id).eq('visibility', 'published').maybeSingle()
      if (error) throw error
      if (!book) return reply({ error: 'Book not available' }, 404)
      const { data: signed, error: signError } = await supabase.storage.from(BUCKET).createSignedUrl(book.pdf_path, 60 * 60)
      if (signError) throw signError
      return reply({ url: signed.signedUrl })
    }

    return reply({ error: 'Unknown action' }, 400)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Request failed'
    return reply({ error: message }, 500)
  }
})