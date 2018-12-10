import React, { Component } from "react";
import "../App.css";
import Conference from "./Conference";
import styled from 'styled-components'

const StyledConference = styled(Conference)`
  margin: 12px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e5e5;

  .title {
    font-weight: bold;
    font-size: 15px;
  }

  .description {
    opacity: 0.8;
    font-size: 12px;
  }
`

class App extends Component {
  render() {
    return (
      <div className={ this.props.className }>
        <StyledConference />
      </div>
    );
  }
}

export default App;
