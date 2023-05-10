'use strict';

import './popup.css';

(function () {

  const defaultWebsites = [
    {"nameTW": "hyread X 台南圖書館", "name": "ebook.hyread with tainan library", "url": "https://tnml.ebook.hyread.com.tw/searchList.jsp?search_field=FullText&search_input={{keyword}}", enabled: true},
    {"nameTW": "台灣雲端書庫 X 台南圖書館", "name": "taiwan ebookservice @ tainan", "url": "http://lib.ebookservice.tw/tn/#search/{{keyword}}", enabled: true},
    {"nameTW": "udn X 台南圖書館", "name": "udn library@ tainan", "url": "https://reading.udn.com/udnlib/tnml/booksearch?sort=all&opt=all&kw={{keyword}}", enabled: true},
    {"nameTW": "國立公共資訊圖書館", "name": "national library of public information e-book online service", "url": "https://ebook.nlpi.edu.tw/search?search_field=TI&search_input={{keyword}}", enabled: true}
  ]
  function restoreWebsites() {
    // Restore  value
    websitesStorage.get(websites => {
      if (typeof websites === 'undefined') {
        // Set websites value as websites
        websitesStorage.set(defaultWebsites, () => {
          setupWebsitesStorage(defaultWebsites);
        });
      } else {
        setupWebsitesStorage(websites);
      }

    });

    document.getElementById('resetBtn').addEventListener('click', () => {
      document.getElementById('search-area').innerHTML = '';//remove all elements
      websitesStorage.remove(); //remove
      websitesStorage.set(defaultWebsites, () => {
        setupWebsitesStorage(defaultWebsites);
      });

    });
    document.getElementById('searchBtn').addEventListener('click', () => {
      updateWebsites();

    });

  }

  // We will make use of Storage API to get and store `websites` value
  // More information on Storage API can we found at
  // https://developer.chrome.com/extensions/storage

  // To get storage access, we have to mention it in `permissions` property of manifest.json file
  // More information on Permissions can we found at
  // https://developer.chrome.com/extensions/declare_permissions

  const websitesStorage = {
    get: cb => {
      chrome.storage.sync.get(['websites'], result => {
        cb(result.websites);
      });
    },
    set: (value, cb) => {
      chrome.storage.sync.set(
        {
          websites: value,
        },
        () => {
          cb();
        }
      );
    },
    remove: () => {
      chrome.storage.sync.remove(['websites'], result => {
        //do nothing
      });
    }
  };

  function setupWebsitesStorage(websites = []) {

    websites.forEach((website, index) => {

      var searchArea = document.getElementById('search-area');

      // 建立新的 div 元素 form
      var websidediv = document.createElement('div');
      websidediv.setAttribute('class', `form`);

      // 建立新的 label 元素
      var newLabel = document.createElement('label');
      newLabel.setAttribute('for', `input${index}`);
      newLabel.textContent = website.nameTW;

      // 建立新的 input 元素 text
      var newInput = document.createElement('input');
      newInput.setAttribute('type', 'text');
      newInput.setAttribute('id', `input${index}`);
      newInput.setAttribute('value', website.url);

      // 建立新的 input 元素 checkbox
      var newInputcheckbox = document.createElement('input');
      newInputcheckbox.setAttribute('type', 'checkbox');
      newInputcheckbox.setAttribute('id', `input${index}checked`);
      if (website.enabled) {
        newInputcheckbox.setAttribute('checked', website.enabled);
      }

      // 在父元素中加入新的 label 元素與 input 元素
      websidediv.appendChild(newLabel);
      websidediv.appendChild(newInput);
      websidediv.appendChild(newInputcheckbox);

      searchArea.appendChild(websidediv);

    })



  }

  function openWebsitesbykeyword(keyword) {
    websitesStorage.get(websites => {
      websites.forEach(website => {
        if (website.enabled) {
          website.url = website.url.replace('{{keyword}}', keyword);
          chrome.tabs.create({
            url: `${website.url}`
          })
        }
      })
    });
  }

  function updateWebsites() {

    websitesStorage.get(websites => {
      websites.forEach((website, index) => {
        var input = document.getElementById(`input${index}`).value;
        websites[index].url = input;
        var inputcheckbox = document.getElementById(`input${index}checked`).checked;
        websites[index].enabled = inputcheckbox;
      })


      websitesStorage.set(websites, () => {
        let keyword = document.getElementById(`keyword`).value;;
        openWebsitesbykeyword(keyword)
      });
      // Communicate with background file by sending a message
      chrome.runtime.sendMessage(
        {
          type: 'SETTING',
          payload: {
            message: websites,
          },
        },
        response => {
          console.log(response.message);
        }
      );
    });
  }


  document.addEventListener('DOMContentLoaded', restoreWebsites);





})();
