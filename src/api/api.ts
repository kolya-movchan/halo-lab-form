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
