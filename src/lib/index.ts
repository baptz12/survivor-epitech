// place files you want to import through the `$lib` alias in this folder.
import { json } from "@sveltejs/kit";
import type { Founder } from "./types";
import type { PrismaModelWithCreateMany } from "./types";

export const roles = ['investor', 'founder'];
export const admin = 'admin';

export const createUnauthorizedMessage = () => json({ error: 'Unauthorized' }, { status: 401 });

export const createForbiddenMessage = () => json({ error: 'Forbidden' }, { status: 403 });

export const applyFilters = (projects: any[], filters: string[], url: URL) => {
  const getCountryFromAddress = (address: string) => {
    if (!address) return '';
    const parts = address.split(',').map(s => s.trim()).filter(Boolean);
    return parts.length ? parts[parts.length - 1] : address.trim();
  };

  return projects.filter((p) => {
    for (const param of filters) {
      const value = url.searchParams.get(param);
      if (!value) continue;

      let field = (p as any)[param];
      if (field == null) return false;

      if (param === 'location' && typeof field === 'string') {
        field = getCountryFromAddress(field);
      }

      if (Array.isArray(field)) {
        if (!field.map(f => String(f).toLowerCase()).some(f => f === value.toLowerCase())) return false;
      } else {
        if (String(field).toLowerCase() !== value.toLowerCase()) return false;
      }
    }
    return true;
  });
}

export const isUnknownKey = (allowedKeys: Set<string>, key: string) => typeof key === 'string' && !allowedKeys.has(key);

export const isFounder = (obj: any): obj is Founder => {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.name === 'string' &&
    (obj.startup_id === undefined || typeof obj.startup_id === 'number')
  );
};

export const checkIdValidity = async (modelName: string, id: string | undefined, model: PrismaModelWithCreateMany) => {
    if (!id || isNaN(Number(id))) {
        return new Response(JSON.stringify({ error: 'Invalid ID' }), { status: 400 });
    }
    const modelId = Number(id);

    const existingModel = await model.findUnique({
        where: { id: modelId }
    });
    if (!existingModel) {
        return json({ error: `${modelName} not found` }, { status: 404 });
    }
}

	export function slugify(text: string) {
		if (!text) return ''; // Gère le cas où le nom est vide ou nul

    return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Remplace les espaces par des -
    .replace(/&/g, '-and-')     // Remplace & par 'and'
    .replace(/[^\w-]+/g, '')    // Enlève tous les caractères non-valides (sauf lettres, chiffres, _)
    .replace(/--+/g, '-')       // Remplace plusieurs - par un seul
    .replace(/^-+/, '')         // Enlève les - au début
    .replace(/-+$/, '');        // Enlève les - à la fin
	}
