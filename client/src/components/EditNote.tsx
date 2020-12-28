import * as React from 'react'
import Auth from '../auth/Auth'
import EditInfoNote from './EditInfoNote'
import EditAttachmentNote from './EditAttachmentNote'
import { History } from 'history'

interface EditNoteProps {
  match: {
    params: {
      noteId: string
    }
  }
  location: {
    state: { name: string; description: string }
  }
  auth: Auth
  history: History
}

export class EditNote extends React.PureComponent<EditNoteProps> {
  render() {
    return (
      <div>
        <EditInfoNote {...this.props} auth={this.props.auth} history={this.props.history} />
        <br />
        <EditAttachmentNote {...this.props} auth={this.props.auth} history={this.props.history} />
      </div>
    )
  }
}
