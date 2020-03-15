import React from 'react';
import Url from 'url'
import Axios from 'axios';

export class EndChat extends React.Component {
  /**
   * Builtin React method called when this component is unmounted.
   * We're using it to automatically end chat when the user closes the chat box.
   * Note: this could just easily be rendered as a separate button using
   * `onClick` to end chat.
   */
  async componentWillUnmount() {
    await this.endChat();
  }

  /**
   * Builtin React method called to render this component
   * Since we're just piggybacking on the `componentWillUnmount` functionality,
   * there's no need to render anything
   */
  render() {
    return null
  }

  /**
   * Ends the current chat.
   */
  async endChat() {
    if (!this.props.channel || !this.props.channel.source) {
      // This component hasn't fully populated yet. Just leave with a console error
      return console.error("Not ending chat: Chat Channel hasn't been created yet");
    }

    if (!this.props.channel.source.attributes || !this.props.channel.source.attributes.taskSid) {
      // The chat channel exists, but there's no taskSid! This is the expected
      // case for newly-opened chats that the user has not yet responded to, but
      // it could also mean that Studio is misconfigured.
      return console.error("Not ending chat: Chat Channel Attributes haven't been populated with taskSid");
    }

    // Build out the config blocks for Axios
    let axiosBody = {
      channelSid: this.props.channel.source.sid,
    };
    let axiosOptions = {
      headers: {
        'Content-Type': 'application/json',
      }
    };
    let url = Url.resolve(this.props.runtimeDomain, 'endChat');
    console.log("ENDING CHAT");

    // Make it happen!
    return Axios.post(url, axiosBody, axiosOptions);
  }
}
