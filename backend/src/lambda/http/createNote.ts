import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
const logger = createLogger('createNote')

import { CreateNoteRequest } from '../../requests/CreateNoteRequest'
import { createNote } from '../../businessLogic/note'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Creating a NoteItem', event)

    const parsedNote: CreateNoteRequest = JSON.parse(event.body)
    console.log('event.headers', event.headers)
    const createdNote = await createNote(parsedNote, event)

    return {
      statusCode: 201,
      body: JSON.stringify({ item: createdNote })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
