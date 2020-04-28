import React from 'react';
import * as FlexWebChat from "@twilio/flex-webchat-ui";

import Url from 'url'
import Axios from 'axios';

export default class CloseButton extends React.Component {
  /**
   * onClick handler, ends the chat and invokes the minimize action
   */
  async handleClick() {
    await this.endChat();
    FlexWebChat.Actions.invokeAction("MinimizeChat");
  }

  // Run the Serverless Function to end the chat channel and task
  async endChat() {
    let state = this.props.manager.store.getState();
    if (state.flex && state.flex.session && state.flex.session.channelSid) {
      let channelSid = state.flex.session.channelSid;

      // Build out the config blocks for Axios
      let axiosBody = {
        channelSid: channelSid,
      };
      let axiosOptions = {
        headers: {
          'Content-Type': 'application/json',
        }
      };
      let url = Url.resolve(this.props.runtimeDomain, 'endChat');

      // Make it happen!
      return Axios.post(url, axiosBody, axiosOptions);
    }
  }

  /**
   * Builtin React method called to render this component
   */
  render() {
    let style = {
      cursor: "pointer"
    }
    return <span style={style} onClick={this.handleClick.bind(this)}>
      <FlexWebChat.Icon icon="Close" />
    </span>
  }
}
