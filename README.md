# Example: Customer End Webchat


This example adds _End Chat_ capability into the customer-facing [Twilio Flex](http://twilio.com/flex) [Webchat UI](https://www.twilio.com/docs/flex/installing-and-using-flex-webchat). It includes code for [Twilio Functions](https://www.twilio.com/docs/runtime/functions) (found in the `serverless` directory) as well as frontend UI code built atop Twilio's [Flex Webchat UI Sample](https://github.com/twilio/flex-webchat-ui-sample) (found in the `flex-webchat-ui` directory).

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

We'll be entering these values into two files, neither of which exist yet:
- serverless/.env
- flex-webchat-ui/public/assets/webchat-appConfig.js


#### serverless/.env
To kick things off, rename the example serverless environment file to remove `.example`, then open it in your editor of choice:

```bash
mv serverless/.env.example serverless/.env

vim serverless/.env
```

You'll notice that this file has temporary string variables for your Account Sid, Auth Token, Twilio Workspace SID, and Flex Chat Service SID. Replace these strings with your actual value.

```
# Before
ACCOUNT_SID=accountSid
AUTH_TOKEN=authToken
TWILIO_WORKSPACE_SID=workspaceSid

# After
ACCOUNT_SID=AC...
AUTH_TOKEN=blah...
TWILIO_WORKSPACE_SID=WS...
FLEX_CHAT_SERVICE_SID=IS...
```

#### Deploying Functions

Before we can configure the next file, we'll need to deploy our Twilio Functions and grab the Runtime Domain. To do so, we'll be using the [Twilio CLI](https://www.twilio.com/docs/twilio-cli/quickstart) and the [Serverless Plugin](https://github.com/twilio-labs/plugin-serverless) that you installed as a prerequisiste.

First off, make sure that you have authenticated according to the [Twilio CLI documentation](https://www.twilio.com/docs/twilio-cli/quickstart#login-to-your-twilio-account).

Then cd into the Functions directory and deploy them:

```bash
cd serverless
twilio serverless:deploy
```

Once everything gets deployed, your response should look something like this:

```bash
Deployment Details
Domain: foobar-xxx-dev.twilio.io
Service:
   plugin-supervisor-capacity-functions (ZS...)
Environment:
   dev (ZE...)
Build SID:
   ZB...
View Live Logs:
   Open the Twilio Console
Functions:
   https://foobar-xxx-dev.twilio.io/getWorkerChannels
   https://foobar-xxx-dev.twilio.io/setWorkerChannelCapacity
Assets:
```

The value we're looking for comes after `Domain:` – that's your Runtime Domain.

#### flex-webchat-ui/public/assets/webchat-appConfig.js

Now we'll populate the UI configuration variables. Start by renaming the example app configuration file to remove `.example`, then open it in your editor of choice

```bash
mv flex-webchat-ui/public/webchat-appConfig.example.js flex-webchat-ui/public/assets/webchat-appConfig.js

vim flex-webchat-ui/public/assets/webchat-appConfig.js
```

Just like before, this new file contains temporary strings that you simply have to replace with the actual values:

```javascript
var appConfig = {
    // change to your AccountSid
    accountSid: "AC...",
    // change to your Flex Flow SID
    flexFlowSid: "FO...",
    // change to your runtimeDomain
    runtimeDomain: "http...",
    colorTheme: {
        overrides: brandedColors
    }
}
```

And now the example is fully configured! You can now run it locally to test and customize it.

## Local Development/Deployment

In order to develop locally, you can use the Webpack Dev Server by running:

```bash
cd flex-webchat-ui
npm install
npm start
```

This will automatically start up the Webpack Dev Server and open the browser for you. Your app will run on `http://localhost:8081`. If you want to change that you can do this by setting the `PORT` environment variable:

```bash
PORT=3000 npm start
```

When you make changes to your code, the browser window will be automatically refreshed.