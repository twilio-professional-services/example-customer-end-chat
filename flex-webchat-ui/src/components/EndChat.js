import React from 'react';
import Url from 'url'
import Axios from 'axios';

export class EndChat extends React.Component {
  async componentWillUnmount() {
    await this.endChat();
  }
  
  render() {
    return ""
  }

  async endChat() {
    let axiosBody = {
      channelSid: this.props.manager.store.getState().flex.session.channelSid,
    };
    let axiosOptions = {
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    let url = Url.resolve(this.props.runtimeDomain, 'endChat');

    console.log("ENDING CHAT", url, axiosBody, axiosOptions)
    return Axios.post(url, axiosBody, axiosOptions);
  }
}