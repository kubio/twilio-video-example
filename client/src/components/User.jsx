import React, { Component } from "react";
import {Card, CardHeader, CardContent, Icon, IconButton} from "@material-ui/core";

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enable_video: true,
      enable_audio: true
    };
  }

  attachTrack = track => {
    if (this.refs[this.props.user.sid]) {
      this.refs[this.props.user.sid].appendChild(track.attach());
    }
  };
  videoToggle = () => {
    this.props.user.videoTracks.forEach(publication => {
      if (this.state.enable_video) {
        publication.track.disable();
      } else {
        publication.track.enable();
      }
      this.setState({ enable_video: this.state.enable_video ? false : true });
    });
  };
  micToggle = () => {
    this.props.user.audioTracks.forEach(publication => {
      if (this.state.enable_audio) {
        publication.track.disable();
      } else {
        publication.track.enable();
      }
      this.setState({ enable_audio: this.state.enable_audio ? false : true });
    });
  };

  componentDidMount() {
    this.props.user.tracks.forEach(publication => {
      if (publication.isTrackEnabled) {
        this.attachTrack(publication.track);
      }
    });
  }

  render() {
    return (
      <Card className={this.props.className}>
        <CardHeader title={this.props.user.identity}></CardHeader>
        <CardContent className="participant_area__footer">
          <div
            className="participant user"
            ref={this.props.user.sid}
            id={this.props.user.sid}
          />
          <IconButton>
            <Icon onClick={this.videoToggle}>
              {this.state.enable_video ? "videocam" : "videocam_off"}
            </Icon>
          </IconButton>
          <IconButton>
            <Icon onClick={this.micToggle}>
              {this.state.enable_audio ? "mic" : "mic_off"}
            </Icon>
          </IconButton>
        </CardContent>
      </Card>
    );
  }
}

export default User;
