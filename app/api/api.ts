export async function api(route: string | URL | Request, init?: RequestInit | undefined) {
  const config = useRuntimeConfig()
  const BASE_URL = `${config.public.BACK_URL}`
  try {
    const response = await fetch(`${BASE_URL}${route}`, { ...init, credentials: 'include' })
    if (response.ok) {
      const content = await response.json()

      if (content.success === false) {
        throw new Error(content.message)
      }

      return { data: content, err: null }
    } else {
      throw new Error(`${route} [${response.status}]: ${response.statusText}`)
    }
  } catch (e) {
    return { data: null, err: e }
  }
}

export async function login(password: string) {
  const { err } = await api('/auth/login', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      password,
    }),
  })

  if (err) {
    return false
  }

  return true
}

export async function checkLogged() {
  const { err } = await api('/auth/logged')

  if (err) {
    return false
  }

  return true
}

export async function listPhotos() {
  const { data, err } = await api('/media')

  if (err) {
    throw err
  }

  return data.photos as string[]
}

export async function signUpload(filename: string, folder: string) {
  const { data, err } = await api('/media', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename, folder }),
  })

  if (err) {
    throw err
  }

  return data as { url: string; fields: Record<string, string> }
}

export async function publishPage(name: string, component: string) {
  return await api(`/pages/publish/${name}`, {
    method: 'PUT',
    body: component,
  })
}
