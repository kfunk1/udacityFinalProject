import 'source-map-support/register'

import { createLogger } from '../../utils/logger'
const logger = createLogger('generateUploadUrl')
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getNote, updateImageNote } from '../../businessLogic/note'
import * as uuid from 'uuid'
import { getUploadUrl } from '../../businessLogic/image'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Getting signed url for s3', event)
    const noteId = event.pathParameters.noteId
    let item = await getNote(noteId, event)
    console.log('item', item)
    if (!item) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: 'Note does not exist.'
        })
      }
    }

    const imageId = uuid.v4()
    const url = await getUploadUrl(imageId)

    const newItem = await updateImageNote(item, imageId)

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: newItem,
        uploadUrl: url
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
