import React from 'react';
import * as FlexWebChat from "@twilio/flex-webchat-ui";
import { EndChat } from "./components/EndChat"
import { AppConfig } from '@twilio/flex-webchat-ui';

class App extends React.Component {

  state = {};

  constructor(props) {
    super(props);
    const { configuration } = props;

    FlexWebChat.Manager.create(configuration)
      .then((manager) => {
        // Add the EndChat component into FlexWebChat
        FlexWebChat.MessageInput.Content.add(<EndChat key="end-chat" runtimeDomain={AppConfig.current().runtimeDomain} />, {sortOrder: 1});
        this.setState({ manager });
      }).catch(error => this.setState({ error }));
  }

  render() {
    const { manager, error } = this.state;

    if (manager) {
      return (
        <FlexWebChat.ContextProvider manager={manager}>
          <FlexWebChat.RootContainer />
        </FlexWebChat.ContextProvider>
      );
    }

    if (error) {
      console.error("Failed to initialize Flex Web Chat", error);
    }

    return null;
  }
}

export default App;
