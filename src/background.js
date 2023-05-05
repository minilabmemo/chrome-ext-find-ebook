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
    id: 'find-ebook',
    title: `find eBook at all websites`,
    contexts: ['selection']
  });
}

chrome.runtime.onInstalled.addListener(() => {
  setupContextMenu();
});

//HyRead ebook/台灣雲端書庫/udn讀書館(臺南分區資源中心)/台灣雲端書庫/國立公共資訊圖書館電子書服務平台
const websites = [
  "https://tnml.ebook.hyread.com.tw/searchList.jsp?search_field=FullText&search_input=",
  "http://lib.ebookservice.tw/tn/#search/",
  "https://reading.udn.com/udnlib/tnml/booksearch?sort=all&opt=all&kw=",
  "https://ebook.nlpi.edu.tw/search?search_field=TI&search_input="
]

chrome.contextMenus.onClicked.addListener((data) => {

  websites.forEach(website => {
    chrome.tabs.create({
      url: `${website}${data.selectionText}`
    })
  })
  chrome.runtime.sendMessage({
    name: 'find-ebook',
    data: {value: data.selectionText}
  });


});
