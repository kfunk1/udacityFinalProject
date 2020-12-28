import { History } from 'history'
import * as React from 'react'
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createNote, deleteNote, getNotes, patchNote } from '../api/notes-api'
import Auth from '../auth/Auth'
import { Note } from '../types/Note'

interface NotesProps {
  auth: Auth
  history: History
}

interface NotesState {
  notes: Note[]
  newNoteName: string
  newDescription: string
  loadingNotes: boolean
}

export class Notes extends React.PureComponent<NotesProps, NotesState> {
  state: NotesState = {
    notes: [],
    newNoteName: '',
    newDescription: '',
    loadingNotes: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newNoteName: event.target.value })
  }

  handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newDescription: event.target.value })
  }

  onEditButtonClick = (note: Note) => {
    console.log('note', note)
    this.props.history.push(`/notes/${note.noteId}/edit`, note)
  }

  onNoteCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newNote = await createNote(this.props.auth.getIdToken(), {
        name: this.state.newNoteName,
        description: this.state.newDescription
      })
      this.setState({
        notes: [...this.state.notes, newNote],
        newNoteName: '',
        newDescription: ''
      })
    } catch {
      alert('Note creation failed')
    }
  }

  onNoteDelete = async (noteId: string) => {
    try {
      await deleteNote(this.props.auth.getIdToken(), noteId)
      this.setState({
        notes: this.state.notes.filter((note) => note.noteId != noteId)
      })
    } catch {
      alert('Note deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const notes = await getNotes(this.props.auth.getIdToken())
      this.setState({
        notes,
        loadingNotes: false
      })
    } catch (e) {
      alert(`Failed to fetch notes: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Notes</Header>

        {this.renderCreateNewNoteInputs()}

        {this.renderNotes()}
      </div>
    )
  }

  renderCreateNewNoteInputs() {
    return (
      <Grid.Row>
        <Grid.Column width={14}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'right',
              icon: 'add',
              content: 'New note',
              onClick: this.onNoteCreate
            }}
            fluid
            placeholder="Title goes here..."
            value={this.state.newNoteName}
            onChange={this.handleNameChange}
            />
          <br />
          <Input
            fluid
            placeholder="Description goes here..."
            value={this.state.newDescription}
            onChange={this.handleDescriptionChange}
          />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderNotes() {
    if (this.state.loadingNotes) {
      return this.renderLoading()
    }

    return this.renderNotesList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Notes
        </Loader>
      </Grid.Row>
    )
  }

  renderNotesList() {
    return (
      <Grid padded>
        {(this.state.notes || []).map((note, pos) => {
          return (
            <Grid.Row key={note.noteId}>
              <Grid.Column width={2} verticalAlign="middle">
                {note.name}
              </Grid.Column>
              <Grid.Column width={10} floated="right">
                {/* https://stackoverflow.com/questions/35351706/how-to-render-a-multi-line-text-string-in-react */}
                {note.description.split('\n').map((i, key) => {
                  return <div key={key}>{i}</div>
                })}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {note.attachmentUrl && (
                  <Image src={note.attachmentUrl} size="small" wrapped />
                )}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(note)}
                >
                  <Icon name="pencil" />
                </Button>
                <br />
                <Button
                  icon
                  color="red"
                  onClick={() => this.onNoteDelete(note.noteId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }
}
