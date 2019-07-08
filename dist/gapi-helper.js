"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleClientLoad = handleClientLoad;
exports.handleSignInClick = handleSignInClick;
exports.handleSignOutClick = handleSignOutClick;
exports.appendToSheet = appendToSheet;
exports.getAllSpreadSheets = getAllSpreadSheets;

function handleClientLoad(apiKey, clientId, onSignedIn) {
  return window.gapi.load('client:auth2', () => initClient(apiKey, clientId, onSignedIn));
}

function handleSignInClick() {
  window.gapi.auth2.getAuthInstance().signIn();
}

function handleSignOutClick() {
  window.gapi.auth2.getAuthInstance().signOut();
}

function appendToSheet(spreadsheetId, data) {
  console.log(spreadsheetId);
  const body = {
    values: data
  };
  return window.gapi.client.sheets.spreadsheets.values.append({
    spreadsheetId: spreadsheetId,
    range: "A:A",
    valueInputOption: 'RAW',
    resource: body
  });
}

function getAllSpreadSheets() {
  return window.gapi.client.drive.files.list({
    q: 'mimeType="application/vnd.google-apps.spreadsheet"'
  });
}

async function initClient(apiKey, clientId, onSignedIn) {
  const scopeArr = ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.appdata', 'https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/spreadsheets'];
  const SCOPE = scopeArr.join(' ');
  await window.gapi.client.load('drive', 'v3');
  window.gapi.client.init({
    apiKey: apiKey,
    clientId: clientId,
    scope: SCOPE,
    discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4']
  }).then(function () {
    window.gapi.auth2.getAuthInstance().isSignedIn.listen(onSignedIn);
    onSignedIn(window.gapi.auth2.getAuthInstance().isSignedIn.get());
  });
}