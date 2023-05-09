'use strict';

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'SETTING') {
    const message = `Hi ${sender.tab ? 'Con' : 'Pop'
      }, my name is Bac. I am from Background. It's great to hear from you.`;

    // Log message coming from the `request` parameter
    console.log(request.payload.message);
    websites = request.payload.message;
    // Send a response message
    sendResponse({
      message,
    });
  }
});


function setupContextMenu() {
  chrome.contextMenus.create({
    id: 'find-ebook',
    title: `find e-Book resources`,
    contexts: ['selection']
  });
}

chrome.runtime.onInstalled.addListener(() => {
  setupContextMenu();
});

//websites: HyRead ebook/台灣雲端書庫/udn讀書館(臺南分區資源中心)/台灣雲端書庫/國立公共資訊圖書館電子書服務平台
const defaultWebsites = [
  {"nameTW": "hyread X 台南圖書館", "name": "ebook.hyread with tainan library", "url": "https://tnml.ebook.hyread.com.tw/searchList.jsp?search_field=FullText&search_input={{keyword}}", enabled: true},
  {"nameTW": "台灣雲端書庫 X 台南圖書館", "name": "taiwan ebookservice @ tainan", "url": "http://lib.ebookservice.tw/tn/#search/{{keyword}}", enabled: true},
  {"nameTW": "udn X 台南圖書館", "name": "udn library@ tainan", "url": "https://reading.udn.com/udnlib/tnml/booksearch?sort=all&opt=all&kw={{keyword}}", enabled: true},
  {"nameTW": "國立公共資訊圖書館", "name": "national library of public information e-book online service", "url": "https://ebook.nlpi.edu.tw/search?search_field=TI&search_input={{keyword}}", enabled: true}
]
let websites;
chrome.contextMenus.onClicked.addListener((data) => {

  if (typeof websites === 'undefined') {
    websites = defaultWebsites;
  }
  websites.forEach(website => {
    if (website.enabled) {
      website.url = website.url.replace('{{keyword}}', data.selectionText);
      chrome.tabs.create({
        url: `${website.url}`
      })
    }
  })

});
