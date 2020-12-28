import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
const XAWS = AWSXRay.captureAWS(AWS)

import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { NoteItem } from '../models/NoteItem'

export class NoteItemAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly noteTable = process.env.NOTE_TABLE
  ) {}

  async getAllNotes(userId: string): Promise<NoteItem[]> {
    console.log('Getting all Notes')

    const result = await this.docClient
      .query({
        TableName: this.noteTable,
        KeyConditionExpression: 'userId = :u',
        ExpressionAttributeValues: { ':u': userId }
      })
      .promise()

    const items = result.Items
    return items as NoteItem[]
  }

  async getNote(userId: string, noteId: string): Promise<NoteItem> {
    const result = await this.docClient
      .get({
        TableName: this.noteTable,
        Key: {
          userId,
          noteId
        }
      })
      .promise()

    return result.Item as NoteItem
  }

  async putNote(noteItem: NoteItem): Promise<NoteItem> {
    console.log('noteItem', noteItem)
    await this.docClient
      .put({
        TableName: this.noteTable,
        Item: noteItem
      })
      .promise()

    return noteItem
  }

  async deleteNote(userId: string, noteId: string): Promise<boolean> {
    await this.docClient
      .delete({
        TableName: this.noteTable,
        Key: { userId, noteId }
      })
      .promise()
    return true
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
