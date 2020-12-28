import * as uuid from 'uuid'

import { NoteItem } from '../models/NoteItem'
import { NoteItemAccess } from '../dataLayer/noteDataAccess'
import { CreateNoteRequest } from '../requests/CreateNoteRequest'
import { UpdateNoteRequest } from '../requests/UpdateNoteRequest'
import { getUserId } from '../auth/utils'
import { APIGatewayProxyEvent } from 'aws-lambda'

const noteItemAccess = new NoteItemAccess()
const bucketName = process.env.IMAGES_S3_BUCKET

export async function getAllNotes(userId: string): Promise<NoteItem[]> {
  return noteItemAccess.getAllNotes(userId)
}

export async function getNote(noteId: string, event: APIGatewayProxyEvent): Promise<NoteItem> {
  const userId = getUserId(event);
  return noteItemAccess.getNote(userId, noteId)
}

export async function createNote(
  createNoteRequest: CreateNoteRequest,
  event: APIGatewayProxyEvent
): Promise<NoteItem> {
  const itemId = uuid.v4()
  const userId = getUserId(event);
  return await noteItemAccess.putNote({
    userId: userId,
    noteId: itemId,
    createdAt: new Date().toISOString(),
    ...createNoteRequest
  })
}

export async function updateNote(
  item: NoteItem,
  updateNoteRequest: UpdateNoteRequest
): Promise<NoteItem> {
  const updatedItem: NoteItem = { ...item, ...updateNoteRequest }
  return await noteItemAccess.putNote(updatedItem)
}

export async function updateImageNote(
  item: NoteItem,
  imageId: string
): Promise<NoteItem> {
  const imageUrl: string = `https://${bucketName}.s3.amazonaws.com/${imageId}`
  const updatedItem = { ...item, attachmentUrl: imageUrl }
  return await noteItemAccess.putNote(updatedItem)
}

export async function deleteNote(noteId: string, event: APIGatewayProxyEvent): Promise<boolean> {
  const userId = getUserId(event);
  return await noteItemAccess.deleteNote(userId, noteId)
}
