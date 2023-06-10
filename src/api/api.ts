const BASE_URL = 'https://run.mocky.io/v3';

export async function fetchGet<T>(endpoint: string): Promise<T> {
  const url = `${BASE_URL}/${endpoint}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error();
    }

    const data: T = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}


// const BASE_URL = 'https://run.mocky.io/v3';

// type RequestMethod = 'GET';

// function request<T>(
//   url: string,
//   method: RequestMethod,
// ): Promise<T> {
//   const options: RequestInit = { method };

 
// }

// export const item = {
//   get: function <T>(url: string) {
//     return request<T>(url, 'GET');
//   },
// };



// function fetchGet(url: string) {
//   return fetch(BASE_URL + url, options)
//   .then(response => response.json());
// }
