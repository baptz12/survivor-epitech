import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch, url }) => {

  const name = params.name;

  const apiEndpoint = `${url.origin}/api/startups/${name}`;

  const response = await fetch(apiEndpoint);

  if (!response.ok) {
    const errorData = await response.json();
    throw error(response.status, errorData.error || 'Impossible to load from API');
  }

  const project = await response.json();

  return {
    project: project,
  };
};