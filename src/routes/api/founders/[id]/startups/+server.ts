// import type { RequestHandler } from '@sveltejs/kit';
// import prisma from '$lib/prisma';
// import type { JsArgs } from '@prisma/client/runtime/library';

// export const GET: RequestHandler = async ({ params }) => {
//     const id = params.id;
//     if (id) {
//         if (isNaN(Number(id))) {
//             return new Response(JSON.stringify({ error: 'Invalid founder ID' }), { status: 400 });
//         }
//         const founder = await prisma.founder.findMany({
//             where: { external_id: Number(id) },
//         });
//         let startupsDataList: Array<JSON>;
//         if (founder) {
//             for (var startups of founder) {
//                 const startupsData = await prisma.startupList.findUnique({
//                     where: { id: startups.id}
//                 })
//             }
//             return new Response(JSON.stringify(startupsDataList), {
//                 headers: { 'Content-Type': 'application/json' }
//             });
//         }
//     }
//     return new Response(JSON.stringify({ error: 'Founder not found' }), { status: 404 });
// };
