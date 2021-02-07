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
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');


  // Throwing everything in a try/catch block to handle errors
  try {
    if (Object.keys(event).length === 0) {
      // This handles the case where NO parameters were sent, allowing for empty Options request (since we don't have access to the Request method/headers)
      throw {
        status: 200,
        code: 60200,
        message: "No body sent."
      }
    }

    if (!event.channelSid) {
      // We're missing our parameter! Throw an exception early.
      throw {
        status: 400,
        code: 60200,
        message: "Request must include a channelSid"
      }
    }

    // Build our updates array for Promise handling
    let updatePromises = [];

    // First pull the Channel via the Twilio SDK
    let channel = await client
      .chat
      .services(chatServiceSid)
      .channels(event.channelSid)
      .fetch(); // If this channel isn't found, it will throw a 404 error

    // if channel.attributes fails to parse, it'll throw a SyntaxError
    let channelAttributes = JSON.parse(channel.attributes);


    // Build the update object for the Chat Channel
    channelAttributes.status = "INACTIVE";
    let channelUpdate = {
      attributes: JSON.stringify(channelAttributes)
    }; // All we need to do for the Chat Channel is set 'status' to 'INACTIVE'

    // and add the update to our promises array
    updatePromises.push(client
      .chat
      .services(chatServiceSid)
      .channels(event.channelSid)
      .update(channelUpdate));

    // There are several cases where we may not have a taskSid populated – it is
    // the /expected/ case at any time before we enqueue in TaskRouter, but
    // could also mean that the populateChatChannelWithTaskSid function is
    // improperly implemented/configured if it happens after enqueuing. Because
    // of this, we must allow for this state without error but we'll print a
    // warning message to help with troubleshooting.
    if (!channelAttributes.taskSid) {
      console.warn("No task sid on chat channel attribtues – this may be fine, but if things aren't working correctly, check your populateChatChannelWithTaskSid function.")

    } else {
      // Now let's pull the Task
      let task = await client
        .taskrouter
        .workspaces(context.TWILIO_WORKSPACE_SID)
        .tasks(channelAttributes.taskSid)
        .fetch(); // If this task isn't found, it'll throw a 404 error

      if (["canceled", "completed", "wrapping",].includes(task.assignmentStatus)) {
        // This task is already complete! Probably some sort of race condition, but throw a 200 status since that's what we were here do to anyway
        throw ({
          status: 200,
          code: 45007,
          message: `Task SID ${channelAttributes.taskSid} is already in ${task.assignmentStatus} state.`
        });
      }

      // Build the update object for the Task
      let taskUpdate = {
        assignmentStatus: task.assignmentStatus
      }
      switch (task.assignmentStatus) {
        case 'pending':
        case 'reserved':
          taskUpdate.assignmentStatus = "canceled";
          taskUpdate.reason = 'Customer ended chat.';
          break;
        case 'assigned':
          taskUpdate.assignmentStatus = "wrapping";
      } // Move the Task into either the "canceled" or "wrapping" state, depending on its previous state

      // and add the update to our promises array
      updatePromises.push(client
        .taskrouter
        .workspaces(context.TWILIO_WORKSPACE_SID)
        .tasks(channelAttributes.taskSid)
        .update(taskUpdate));
    }

    // Now ensure that all promises return successful
    await Promise.all(updatePromises);
    responseBody.success = true;
    responseBody.payload.message = "Chat ended."
  } catch (e) {
    // We've caught an error! Handle the HTTP error response
    console.error(e.message || e);

    response.setStatusCode(e.status || 500);

    responseBody.success = false;
    responseBody.payload.errors = responseBody.payload.errors || [];
    responseBody.payload.errors.push({ code: e.code || 500, message: e.message });
  }

  response.setBody(responseBody);
  return callback(null, response);
};
