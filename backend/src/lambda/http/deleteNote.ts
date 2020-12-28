import 'source-map-support/register'

import { createLogger } from '../../utils/logger'
const logger = createLogger('deleteNote')
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { deleteNote } from '../../businessLogic/note'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Deleting a NoteItem', event)
    console.log("Deleting a NoteItem", event)

    const noteId = event.pathParameters.noteId
    await deleteNote(noteId, event)

    return {
      statusCode: 200,
      body: JSON.stringify({
        noteId
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
