import React from 'react';
import * as FlexWebChat from "@twilio/flex-webchat-ui";
import MinimizeButton from "./components/MinimizeButton"
import CloseButton from "./components/CloseButton"
import { AppConfig } from '@twilio/flex-webchat-ui';

class App extends React.Component {

  state = {};

  constructor(props) {
    super(props);
    const { configuration } = props;

    FlexWebChat.Manager.create(configuration)
      .then((manager) => {
        // Add the EndChat component into FlexWebChat
        FlexWebChat.MainHeader.Content.add(<MinimizeButton key="mimize-chat"  />, { sortOrder: -1, align: "end" });
        FlexWebChat.MainHeader.Content.add(<CloseButton key="close-chat" runtimeDomain={AppConfig.current().runtimeDomain} manager={manager}/>, { sortOrder: -1, align: "end" });
        FlexWebChat.MainHeader.Content.remove("close-button");
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
