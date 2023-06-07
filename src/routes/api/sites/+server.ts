import { createHandler, listHandler } from './pulumi';

/** @type {import('./$types').RequestHandler} */
export const GET = async () => {
	return listHandler()
}

export const POST = async (requestEvent) => {
	return createHandler(requestEvent)
}
