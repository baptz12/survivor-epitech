import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
  const apiEndpoint = `${url.origin}/api/startups?limit=3`;

  const response = await fetch(apiEndpoint);

  if (!response.ok) {
    throw error(response.status, 'Impossible to load projects');
  }

  const result = await response.json();
  const projectsArray = result.data;

  return {
    projects: projectsArray,
  };
};