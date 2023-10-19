export const post = async ( url: string, data: any ) => {
  return await fetch( url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify( data ),
  })
}

export const get = async ( url: string, params: any = undefined ) => {
  if( params ) {
    url = `${ url }?${ new URLSearchParams( params ) }`
  }

  return await fetch( url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export const put = async ( url: string, data: any ) => {
  return await fetch( url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify( data ),
  })
}

export const del = async ( url: string ) => {
  return await fetch( url, {
    method: 'DELETE',
  })
}