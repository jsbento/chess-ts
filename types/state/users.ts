export type UserState = {
  user: {
    id: string
    username: string
    email: string
  } | null
  token: string | null
}

export const UserActions = {
  SET_USER: 'SET_USER',
  CLEAR_USER: 'CLEAR_USER',
}