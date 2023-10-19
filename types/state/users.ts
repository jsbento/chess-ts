export type UserState = {
  user: {
    id: string
    username: string
    email: string
  } | null
  token: string | null
}