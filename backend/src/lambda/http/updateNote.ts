import 'source-map-support/register'
import { createLogger } from '../../utils/logger'
const logger = createLogger('updateNote')
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { UpdateNoteRequest } from '../../requests/UpdateNoteRequest'
import { getNote, updateNote } from '../../businessLogic/note'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Updating info', event)
    const noteId = event.pathParameters.noteId
    const updateRequest: UpdateNoteRequest = JSON.parse(event.body)
    const item = await getNote(noteId, event)
    const updatedNote = await updateNote(item, updateRequest)

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: updatedNote
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
