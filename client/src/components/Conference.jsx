import React, { Component } from "react";
import { connect, createLocalTracks } from "twilio-video";
import ParticipantList from "./ParticipantList";
import { TextField, Button } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

class Conference extends Component {
  constructor(props) {
    super(props);
    this.state = {
      room: null,
      identity: "",
      participants: []
    };
    this.roomName = "test-room";
    this.participantsRef = React.createRef();
  }

  render() {
    return (
      <div className={this.props.className}>
        <Dialog
          open={!this.state.room}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Join room `{this.roomName}`
          </DialogTitle>
          <DialogContent>
            <DialogContentText>Please enter your name.</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              name="identity"
              label="Your Name"
              type="text"
              onChange={this.onChange}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.joinRoom} variant="contained" color="primary">Join</Button>
          </DialogActions>
        </Dialog>
        { this.state.room &&
        <div id="remote-media-div">
          <Button onClick={this.disconnect} variant="contained" color="secondary">Disconnection</Button>
          <ParticipantList
            ref={ this.participantsRef }
            room={ this.state.room }
            participants={ this.state.participants }
          />
        </div>
        }
      </div>
    );
  }

  onChange = e => {
    if (e.target.name) {
      this.setState({ [e.target.name]: e.target.value });
    }
  };

  getToken = async () => {
    try {
      let response = await fetch(
        `http://localhost:3001/token/${this.roomName}/${this.state.identity}`
      );
      let json = await response.json();
      return json.token;
    } catch (error) {
      console.error(`Unable to connect to Room: ${error.message}`);
    }
  };

  joinRoom = async e => {
    let token = await this.getToken();
    let localTracks = await createLocalTracks({
      audio: true,
      video: { width: 640 }
    });

    try {
      let room = await connect(
        token,
        {
          name: this.roomName,
          tracks: localTracks
        }
      );

      this.setState({ room: room });
      await this.connectSuccess();
    } catch (error) {
      console.error(`Unable to connect to Room: ${error.message}`);
      console.log(error);
    }
  };

  connectSuccess = () => {
    console.log(`Successfully joined a Room: ${this.state.room}`);

    this.setState({ participants: this.state.room.participants });

    this.state.room.on("participantConnected", participant => {
      console.log(
        `Participant "${participant.identity}" connected`,
        participant
      );
      this.setState({ participants: this.state.room.participants });
    });

    this.state.room.on("participantDisconnected", participant => {
      console.log(`Participant disconnected: ${participant.identity}`);
      participant.tracks.forEach(publication => {
        try {
          const attachedElements = publication.track.detach();
          attachedElements.forEach(element => element.remove());
        } catch (e) {
          //console.log(e);
        }
      });
      this.setState({ participants: this.state.room.participants });
    });

    this.state.room.on("disconnected", room => {
      // Detach the local media elements
      room.localParticipant.tracks.forEach(publication => {
        try {
          const attachedElements = publication.track.detach();
          attachedElements.forEach(element => element.remove());
          window.location.reload();
        } catch (e) {
          //console.log(e);
        }
      });
    });
  };
  disconnect = () => {
    this.state.room.disconnect();
  };
}

export default Conference;
