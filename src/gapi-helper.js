export function handleClientLoad(apiKey, clientId, onSignedIn) {
	return window.gapi.load('client:auth2',
	  () => initClient(apiKey, clientId, onSignedIn));
}

export function handleSignInClick() {
	window.gapi.auth2.getAuthInstance().signIn();
}

export function handleSignOutClick() {
	window.gapi.auth2.getAuthInstance().signOut();
}

export function appendToSheet(spreadsheetId, data) {
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

export function getAllSpreadSheets() {
	return window.gapi.client.drive.files.list({
		q: 'mimeType="application/vnd.google-apps.spreadsheet"'
	});
}

async function initClient(apiKey, clientId, onSignedIn) {
	const scopeArr = [
		'https://www.googleapis.com/auth/drive',
		'https://www.googleapis.com/auth/drive.appdata',
		'https://www.googleapis.com/auth/drive.file',
		'https://www.googleapis.com/auth/spreadsheets'
	]
	const SCOPE = scopeArr.join(' ');
	await window.gapi.client.load('drive', 'v3');
	window.gapi.client.init({
		apiKey: apiKey,
		clientId: clientId,
		scope: SCOPE,
		discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
	}).then(function () {
		window.gapi.auth2.getAuthInstance().isSignedIn.listen(onSignedIn);
		onSignedIn(window.gapi.auth2.getAuthInstance().isSignedIn.get());
	});
}