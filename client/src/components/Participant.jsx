import React, { Component } from "react";
import {Card, CardHeader, CardContent} from "@material-ui/core";

class Participant extends Component {
  componentWillMount() {
    this.props.participant.tracks.forEach(track => {
      this.attachTrack(track);
    });
    this.props.participant.on("trackSubscribed", track => {
      this.attachTrack(track);
    });
  }
  attachTrack = (track) => {
      if (this.refs[this.props.participant.sid]) {
        this.refs[this.props.participant.sid].appendChild(track.attach());
      }
  }
  render() {
    return (
      <Card className={this.props.className}>
        <CardHeader title={this.props.participant.identity}></CardHeader>
        <CardContent className="participant_area__footer">
          <div
            className="participant"
            ref={this.props.participant.sid}
            id={this.props.participant.sid}
          />
        </CardContent>
      </Card>
    );
  }
}

export default Participant;
