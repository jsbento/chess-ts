export const post = async ( url: string, data: any, headers: { [key: string]: string } = {}): Promise<any> => {
  return await fetch( url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify( data ),
  })
}

export const get = async ( url: string, params: any = undefined, headers: { [key: string]: string } = {}): Promise<any> => {
  if( params ) {
    url = `${ url }?${ new URLSearchParams( params ) }`
  }

  return await fetch( url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  })
}

export const put = async ( url: string, data: any ): Promise<any> => {
  return await fetch( url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify( data ),
  })
}

export const del = async ( url: string ): Promise<any> => {
  return await fetch( url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
