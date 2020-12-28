import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
const logger = createLogger('getNotes')

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getUserId } from '../../auth/utils'
import { getAllNotes } from '../../businessLogic/note'
import { NoteItem } from '../../models/NoteItem'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Get list of notes', event)
    const userId: string = getUserId(event)
    if (!userId) {
      return {
        statusCode: 403,
        body: JSON.stringify({
          message: 'You must be logged in to get your notes'
        })
      }
    }
    const notes: NoteItem[] = await getAllNotes(userId)
    return {
      statusCode: 200,
      body: JSON.stringify({ items: notes })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
