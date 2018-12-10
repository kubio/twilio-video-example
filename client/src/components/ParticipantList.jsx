import React, { Component } from "react";
import User from "./User";
import Participant from "./Participant";
import { Grid } from "@material-ui/core";

class ParticipantList extends Component {
  renderParticipants() {
    let participants = [];

    if (this.props.participants.size > 0) {
        this.props.participants.forEach((participant, index) => {
            participants.push(<Grid item key={ participant.sid }><Participant participant={participant}/></Grid>);
        });
    }
    
    return participants;
  }

  renderUser() {
    if (!this.props.room) return;
    return <Grid item key={this.props.room.localParticipant.sid}><User user={ this.props.room.localParticipant }/></Grid>
  }

  render() {
    return <Grid container>
      {this.renderUser()}
      {this.renderParticipants()}
    </Grid>;
  }
}

export default ParticipantList;
