
export async function sendContactVcard(chatId, contact, name) {
  var chat = await WAPI.sendExist(chatId);
  var cont = await WAPI.sendExist(contact);
  if (chat.id && cont.id) {
    var newId = window.WAPI.getNewMessageId(chat.id);
    var tempMsg = Object.create(
      Store.Msg.models.filter((msg) => msg.__x_isSentByMe && !msg.quotedMsg)[0]
    );
    var bod = await window.Store.Vcard.vcardFromContactModel(cont.__x_contact);
    name = !name ? cont.__x_formattedTitle : name;
    var extend = {
      ack: 0,
      body: bod.vcard,
      from: cont.__x_contact,
      local: !0,
      self: 'out',
      id: newId,
      vcardFormattedName: name,
      t: parseInt(new Date().getTime() / 1000),
      to: chatId,
      type: 'vcard',
      isNewMsg: !0,
    };
    Object.assign(tempMsg, extend);
    var result =
      (await Promise.all(Store.addAndSendMsgToChat(chat, tempMsg)))[1] || '';
    var m = { from: contact, type: 'vcard' },
      To = await WAPI.getchatId(chat.id);
    if (result === 'success' || result === 'OK') {
      var obj = WAPI.scope(To, false, result, null);
      Object.assign(obj, m);
      return obj;
    } else {
      var obj = WAPI.scope(To, true, result, null);
      Object.assign(obj, m);
      return obj;
    }
  } else {
    return chat;
  }
}
