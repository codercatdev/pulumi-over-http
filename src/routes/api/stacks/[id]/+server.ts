import { deleteHandler, getHandler, updateHandler } from './pulumi';

/** @type {import('./$types').RequestHandler} */
export const GET = async (requestEvent) => {
	return getHandler(requestEvent)
}

export const PUT = async (requestEvent) => {
	return updateHandler(requestEvent)
}

export const DELETE = async (requestEvent) => {
	return deleteHandler(requestEvent)
}
