import { UserResponse } from '@/types/query';
import { getAccessToken } from '@auth0/nextjs-auth0';

export default async function GetUserTest() {
  const token = await getAccessToken();
  const response = await fetch('http://localhost:8000/api/users/me', {
    headers: {
      Authorization: `Bearer ${token.accessToken}`
    },
    cache: 'no-cache'
  });
  const data = (await response.json()) as UserResponse;
  console.log(data);

  return (
    <div>
      <h1>Add User Test</h1>
      <p>Response: {data.open_id}</p>
    </div>
  );
}
