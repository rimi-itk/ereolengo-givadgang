/* global chrome */

// Saves options to chrome.storage
function saveOptions () {
  var apiUrl = document.getElementById('api-url').value
  var apiToken = document.getElementById('api-token').value
  chrome.storage.sync.set({
    apiUrl: apiUrl,
    apiToken: apiToken
  }, function () {
    // Update status to let user know options were saved.
    var status = document.getElementById('status')
    status.style.visibility = 'visible'
    status.textContent = 'Options saved.'
  })
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restoreOptions () {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    apiUrl: 'https://ereolengo.dk/unilogin/api/institutions',
    apiToken: ''
  }, function (items) {
    document.getElementById('api-url').value = items.apiUrl
    document.getElementById('api-token').value = items.apiToken
  })
}

document.addEventListener('DOMContentLoaded', restoreOptions)
document.getElementById('save').addEventListener('click', saveOptions)
