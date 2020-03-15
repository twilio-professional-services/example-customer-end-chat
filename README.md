# Example: Customer End Webchat


This example adds _End Chat_ capability into the customer-facing [Twilio Flex](http://twilio.com/flex) [Webchat UI](https://www.twilio.com/docs/flex/installing-and-using-flex-webchat). It includes code for [Twilio Functions](https://www.twilio.com/docs/runtime/functions) as well as frontend UI code built atop Twilio's [Flex Webchat UI Sample](https://github.com/twilio/flex-webchat-ui-sample).

![customer-end-chat example](https://github.com/twilio-professional-services/example-customer-end-chat/blob/media/customer-end-chat.gif)

## Setup

### Prerequisites
Before beginning with this Flex plugin, you'll want to make sure that:
- You have a working [Twilio Flex](https://www.twilio.com/flex) account
- You have [Node.js](https://nodejs.org) as well as [`npm`](https://npmjs.com) installed
  - `npm` generally gets installed along with Node.js, but make sure you have it anyway
- You have the latest [Twilio CLI](https://www.twilio.com/docs/twilio-cli/quickstart) installed
- Your Twilio CLI is running the latest [Serverless Plugin](https://github.com/twilio-labs/plugin-serverless) 

### Configuration
Over the course of the configuration process, you'll need several values from your Twilio account. The first five can be found right now in the Twilio Console and Flex Admin pages, but the last one will require you to deploy your Twilio Functions to find (Don't worry, we'll cover that!)

- Account SID
  - Found on the [Twilio Console Homepage](https://www.twilio.com/console)
  - String starting with "AC..."
- Auth Token
  - Found on the [Twilio Console Homepage](https://www.twilio.com/console)
  - Secure string of 32 characters that we'll call "blah..." for the sake of communication
- Twilio Workspace SID
  - Found in your [TaskRouter Dashboard](https://www.twilio.com/console/taskrouter/dashboard)
  - String starting with "WS..."
- Flex Chat Service Sid
  - Found in your [Programmable Chat Dashboard](https://www.twilio.com/console/chat/dashboard)
  - String starting with "IS..."
- Flex Flow Sid
  - Found on the Flex Admin [Developer Setup page](https://flex.twilio.com/admin/developers/)
  - String starting with "FO..."
- Serverless Runtime Domain
  - We'll grab this after we've deployed our Twilio Functions
  - A web domain that looks something like "foobar-xxx-dev.twilio.io"