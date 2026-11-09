export const token = ref()

export async function login(password: string) {
  const config = useRuntimeConfig()
  const BASE_URL = `${config.public.BACK_URL}`
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        password,
      }),
    })

    if (response.ok) {
      const content = await response.json()

      if (!content.success) {
        throw new Error(content.message)
      }

      token.value = content.token

      return true
    }
    return false
  } catch (e) {
    console.error(e)
    return false
  }
}

export async function checkLogged() {
  const config = useRuntimeConfig()
  const BASE_URL = `${config.public.BACK_URL}`
  try {
    const response = await fetch(`${BASE_URL}/auth/logged`, {
      method: 'GET',
      credentials: 'include',
    })
    if (response.ok) {
      const content = await response.json()

      if (!content.success) {
        throw new Error(content.message)
      }

      return true
    }
    return false
  } catch (e) {
    console.error(e)
    return false
  }
}
