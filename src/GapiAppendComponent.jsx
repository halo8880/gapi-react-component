import React from 'react';
import * as helper from './gapi-helper';
import '../style/app.css';

export default class GapiAppendComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			signedIn: false,
			error: null,
			successMessage: null,
			dropDownSheets: [],
			selectedSheetId: ""
		}
	}

	componentDidMount() {
		if (!window.gapi) {
			const script = document.createElement("script");
			script.src = "https://apis.google.com/js/client.js";
			document.body.appendChild(script);
			script.addEventListener("load", () => {
				this.catchClientLoad();
			});
		} else {
			this.catchClientLoad();
		}
	}

	catchClientLoad = () => {
		try {
			helper.handleClientLoad(this.props.apiKey, this.props.clientId, this.handleSignedIn);
		} catch (e) {
			this.setState({
				error: "Error occurred while initialization of Google API",
				successMessage: null
			})
		}
	}

	handleSignedIn = (signedIn) => {
		if (signedIn) {
			helper.getAllSpreadSheets().then(response => this.setState({
				dropDownSheets: response.result.files,
				signedIn
			}));
		} else {
			this.setState({ signedIn });
		}
	}

	handleClickCopyBtn = () => {
		helper.appendToSheet(this.state.selectedSheetId, this.props.dataToCopy)
		  .then(res => this.setState({
			  error: null,
			  successMessage: "Successfully updated the spreadsheet"
		  }))
		  .catch(error => this.setState({
			  error: error.result.error.message,
			  successMessage: null
		  }));
	}

	static getDerivedStateFromProps(props, state) {
		const propsFulfilled = props.apiKey && props.clientId && props.dataToCopy;
		if (!propsFulfilled) {
			return {
				error: "Please provide both API key, Client ID and dataToCopy",
				successMessage: null
			};
		}
		if (!Array.isArray(props.dataToCopy)) {
			return {
				error: "Data to copy must be an array of arrays",
				successMessage: null
			};
		}
		return null;
	}

	render() {
		return (
		  <div className="gapi__component">
			  <div className="gapi__component__wrapper">
				  {!this.state.signedIn ?
					<button className="gapi__component__btn gapi__component__btnSignIn"
							onClick={helper.handleSignInClick}>
						Please Sign in to Google first
					</button>
					:
					<>
						<label className="gapi__component__label">Google Spreadsheet ID:</label>
						<select
						  className="gapi__component__select"
						  onChange={event => this.setState({
							  selectedSheetId: event.target.value,
							  error: null,
							  successMessage: null
						  })}
						>
							<option></option>
							{this.state.dropDownSheets.map(sheet => {
								return <option key={sheet.id} value={sheet.id}>{sheet.name}</option>
							})}
						</select>
						<button
						  className="gapi__component__btn gapi__component__btnCopy"
						  onClick={this.handleClickCopyBtn}
						>
							COPY
						</button>
					</>
				  }
			  </div>
			  {this.state.error &&
			  <div className="gapi__component__error">
				  {this.state.error}
			  </div>
			  }
			  {this.state.successMessage &&
			  <div className="gapi__component__successMessage">
				  {this.state.successMessage}
			  </div>
			  }
		  </div>
		)
	}
}