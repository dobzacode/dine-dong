import { ChatSnippetResponse, ExtendedChatResponse } from '@/types/query';
import { getBasePath } from '../utils';

export async function getUserChats(sub: string, request: RequestInit = {}) {
  const url = new URL(`${getBasePath()}/api/chats/${sub}`);
  const response = await fetch(url.toString(), request);

  switch (response.status) {
    case 200:
      return (await response.json()) as ExtendedChatResponse[];
    case 404:
      throw new Error('404 Aucun chat trouvé');
    case 422:
      throw new Error('422 Une erreur est survenue');
    case 500:
      throw new Error('500 Erreur serveur');
    default:
      throw new Error('Erreur inconnue');
  }
}

export async function getLastChatId(sub: string, request: RequestInit = {}) {
  const url = new URL(`${getBasePath()}/api/chats/${sub}/last`);
  const response = await fetch(url.toString(), request);

  switch (response.status) {
    case 200:
      return await response.text();
    case 404:
      throw new Error('404 Aucun chat trouvé');
    case 422:
      throw new Error('422 Une erreur est survenue');
    case 500:
      throw new Error('500 Erreur serveur');
    default:
      throw new Error('Erreur inconnue');
  }
}

export async function getChatSnippet(chatId: string, request: RequestInit = {}) {
  const url = new URL(`${getBasePath()}/api/chats/${chatId}/snippet`);
  const response = await fetch(url.toString(), request);

  switch (response.status) {
    case 200:
      return (await response.json()) as ChatSnippetResponse;
    case 404:
      throw new Error('404 Chat non trouvé');
    case 422:
      throw new Error('422 Une erreur est survenue');
    case 500:
      throw new Error('500 Erreur serveur');
    default:
      throw new Error('Erreur inconnue');
  }
}
