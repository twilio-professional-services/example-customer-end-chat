exports.handler = async function (context, event, callback) {
  // Start off defining all of our constants
  const client = context.getTwilioClient();
  const chatServiceSid = context.FLEX_CHAT_SERVICE_SID; // note: This must be set in your .env

  const response = new Twilio.Response(); // This is what will be in the eventual HTTP response via the callback method
  const responseBody = {
    success: false,
    payload: {
      errors: []
    }
  } // and this will be the Body of the response

  response.appendHeader('Content-Type', 'application/json');

  // Throwing everything in a try/catch block to handle errors
  try {
    if (event.channelSid && event.taskSid) {
      // First pull the Channel via the Twililo SDK
      let channel = await client
        .chat
        .services(chatServiceSid)
        .channels(event.channelSid)
        .fetch(); // If this channel isn't found, it will throw a 404 error

      // if channel.attributes fails to parse, it'll throw a SyntaxError
      let channelAttributes = JSON.parse(channel.attributes);
      channelAttributes.taskSid = event.taskSid; // add our TaskSid to the channel attributes

      // Now use the Twilio SDK to update the channel with our new attributes
      await client
        .chat
        .services(chatServiceSid)
        .channels(event.channelSid)
        .update({ attributes: JSON.stringify(channelAttributes) });

      // And handle our HTTP response data
      responseBody.success = true;
      responseBody.payload.newAttributes = channelAttributes;
    } else {
      // We're missing parameters! Handle the HTTP error response
      response.setStatusCode(400);
      responseBody.success = false;
      responseBody.payload.errors = [];

      if (!event.channelSid) {
        responseBody.payload.errors.push({
          code: 60200,
          message: "Request must include a channelSid"
        })
      }
      
      if (!event.taskSid) {
        responseBody.payload.errors.push({
          code: 60200,
          message: "Request must include a taskSid"
        })
      }

    } 
  } catch (e) {
    // We've caught an error! Handle the HTTP error response
    console.error(e);

    response.setStatusCode(e.status || 500);
    
    responseBody.success = false;
    responseBody.payload.errors = responseBody.payload.errors || [];
    responseBody.payload.errors.push({ code: e.code || 500, message: e.message});
  }

  response.setBody(responseBody);
  return callback(null, response);
};
