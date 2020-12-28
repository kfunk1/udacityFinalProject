import * as React from 'react'
import { History } from 'history'
import { Form, Button, Input } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { patchNote } from '../api/notes-api'

interface EditNoteProps {
  match: {
    params: {
      noteId: string,
    }
  }
  location: {
    state: { name: string; description: string }
  }
  auth: Auth
  history: History
}

interface EditInfoNoteState {
  name: string
  description: string
}

export default class EditInfoNote extends React.PureComponent<
  EditNoteProps,
  EditInfoNoteState
> {
  state: EditInfoNoteState = {
    name: this.props.location.state.name,
    description: this.props.location.state.description
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value
    if (!name) return

    this.setState({
      name
    })
  }

  handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const description = event.target.value
    if (!description) return

    this.setState({
      description
    })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.name) {
        alert('name should be selected')
        return
      }
      const notePatchRequest = { ...this.state }
      await patchNote(
        this.props.auth.getIdToken(),
        this.props.match.params.noteId,
        notePatchRequest
      )
      alert('Changes were made!')
      this.props.history.push("/");
    } catch (e) {
      alert('Could not make those changes: ' + e.message)
    }
  }

  render() {
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Name</label>
            <Input
              fluid
              placeholder="Title goes here..."

              value={this.state.name}
              onChange={this.handleNameChange}
              />
          </Form.Field>
          <Form.Field>
            <label>Description
            <textarea
              placeholder="Description goes here..."
              value={this.state.description}
              onChange={this.handleDescriptionChange}
            /></label>
          </Form.Field>

          <Button type="submit">Save</Button>
        </Form>
      </div>
    )
  }
}
