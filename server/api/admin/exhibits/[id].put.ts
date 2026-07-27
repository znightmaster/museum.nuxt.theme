export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const id = getRouterParam(event, 'id')!
  const body = await readBody(event)
  return await updateExhibit(id, body)
})
