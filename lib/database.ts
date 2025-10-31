import { getSession } from "./auth";

// Profile operations
export async function getProfile() {
  try {
    const session = await getSession();
    const response = await fetch(`/api/account`,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`,
      },
    });

    if (!response.ok) {
      console.error('Error fetching profile:', response.statusText);
      return null;
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Database error fetching profile:', error);
    return null;
  }
}