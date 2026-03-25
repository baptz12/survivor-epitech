import type { RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { json, error } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
      const identifier = params.identifier;

      if (!identifier) {
        throw error(400, 'An indentifier is required.');
      }

      const idAsNumber = parseInt(identifier, 10);
      let project;

      if (!isNaN(idAsNumber)) {
        project = await prisma.startupDetail.findUnique({
          where: { id: idAsNumber }
        });
      } else {
        // Search is now on slug_url
        project = await prisma.startupDetail.findUnique({
          where: { 
            slug_url: identifier
          }
        });
      }

      if (!project) {
        throw error(404, 'Project not found');
      }

      return json(project);
};

export const PUT: RequestHandler = async ({ request, params }) => {

	    const startupId = Number(params.identifier);
	    const startupData = await request.json();

	    if (!startupData || !startupData.name) {
	    	throw error(400, { message: 'Startup name is required.' });
	    }

	    if (isNaN(startupId)) {
	    	throw error(400, { message: 'Invalid startup ID.' });
	    }
    
	    try {
	    	const [updatedDetail, updatedList] = await prisma.$transaction([
	    		prisma.startupDetail.update({
	    			where: { id: startupId },
	    			data: {
	    				name: startupData.name,
	    				description: startupData.description,
	    				slug_url: startupData.slug_url,
	    				sector: startupData.sector,
	    				maturity: startupData.maturity,
	    				website_url: startupData.website_url,
	    				social_media_url: startupData.social_media_url,
	    				phone: startupData.phone,
	    				address: startupData.address,
	    				legal_status: startupData.legal_status,
	    				project_status: startupData.project_status,
	    				needs: startupData.needs
	    			}
	    		}),
	    		prisma.startupList.update({
	    			where: { id: startupId },
	    			data: {
	    				name: startupData.name,
	    				description: startupData.description,
	    				sector: startupData.sector,
	    				maturity: startupData.maturity,
	    				phone: startupData.phone,
	    				address: startupData.address,
	    				legal_status: startupData.legal_status
	    			}
	    		})
	    	]);

	    	return json({ success: true, startup: updatedDetail }, { status: 200 });

	    } catch (err) {
	    	throw error(500, { message: 'Failed to update startup profile.' });
	    }
};