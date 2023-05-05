'use strict';

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GREETINGS') {
    const message = `Hi ${sender.tab ? 'Con' : 'Pop'
      }, my name is Bac. I am from Background. It's great to hear from you.`;

    // Log message coming from the `request` parameter
    console.log(request.payload.message);
    // Send a response message
    sendResponse({
      message,
    });
  }
});


function setupContextMenu() {
  chrome.contextMenus.create({
    id: 'define-word',
    title: `Define`,
    contexts: ['selection']
  });
}

chrome.runtime.onInstalled.addListener(() => {
  setupContextMenu();
});

const websites = [
  "https://tnml.ebook.hyread.com.tw/searchList.jsp?search_field=FullText&search_input=",
  "http://lib.ebookservice.tw/tn/#search/"
]

chrome.contextMenus.onClicked.addListener((data) => {
  console.log(data.selectionText);
  // window.open(' http://tw.yahoo.com ', 'Yahoo', config = 'height=500,width=500');
  chrome.tabs.create({
    // url: 'data:text/html;charset=utf-8,' + '<p>' + output.join('<p/><p>') + '</p>'
    url: `https://tnml.ebook.hyread.com.tw/searchList.jsp?search_field=FullText&search_input=${data.selectionText}`
  })
  chrome.runtime.sendMessage({
    name: 'define-word',
    data: {value: data.selectionText}
  });


});
