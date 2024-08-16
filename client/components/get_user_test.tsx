import { MealResponse } from '@/types/query';
import { getAccessToken } from '@auth0/nextjs-auth0';

export default async function GetUserTest() {
  const token = await getAccessToken();
  const response = await fetch('http://localhost:8000/api/meals', {
    method: 'POST',
    body: JSON.stringify({
      name: 'fdsfsdfdaaadqsdqsadsqdqszsdsqdes',
      ingredients: ['aaaaaaadqddqsdsqaezdsqddqferfdsfa', 'aaaadsdsdqsdqsetreqdsqsdaaaaaaa']
    }),

    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.accessToken}`
    },
    cache: 'no-cache'
  });
  const data = (await response.json()) as MealResponse;
  console.log(data);

  return (
    <div>
      <h1>Add User Test</h1>
      <p>Response: </p>
    </div>
  );
}
