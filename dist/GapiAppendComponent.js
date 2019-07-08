"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var helper = _interopRequireWildcard(require("./gapi-helper"));

require("../style/app.css");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class GapiAppendComponent extends _react.default.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "catchClientLoad", () => {
      try {
        helper.handleClientLoad(this.props.apiKey, this.props.clientId, this.handleSignedIn);
      } catch (e) {
        this.setState({
          error: "Error occurred while initialization of Google API",
          successMessage: null
        });
      }
    });

    _defineProperty(this, "handleSignedIn", signedIn => {
      if (signedIn) {
        helper.getAllSpreadSheets().then(response => this.setState({
          dropDownSheets: response.result.files,
          signedIn
        }));
      } else {
        this.setState({
          signedIn
        });
      }
    });

    _defineProperty(this, "handleClickCopyBtn", () => {
      helper.appendToSheet(this.state.selectedSheetId, this.props.dataToCopy).then(res => this.setState({
        error: null,
        successMessage: "Successfully updated the spreadsheet"
      })).catch(error => this.setState({
        error: error.result.error.message,
        successMessage: null
      }));
    });

    this.state = {
      signedIn: false,
      error: null,
      successMessage: null,
      dropDownSheets: [],
      selectedSheetId: ""
    };
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
    return _react.default.createElement("div", {
      className: "gapi__component"
    }, _react.default.createElement("div", {
      className: "gapi__component__wrapper"
    }, !this.state.signedIn ? _react.default.createElement("button", {
      className: "gapi__component__btn gapi__component__btnSignIn",
      onClick: helper.handleSignInClick
    }, "Please Sign in to Google first") : _react.default.createElement(_react.default.Fragment, null, _react.default.createElement("label", {
      className: "gapi__component__label"
    }, "Google Spreadsheet ID:"), _react.default.createElement("select", {
      className: "gapi__component__select",
      onChange: event => this.setState({
        selectedSheetId: event.target.value,
        error: null,
        successMessage: null
      })
    }, _react.default.createElement("option", null), this.state.dropDownSheets.map(sheet => {
      return _react.default.createElement("option", {
        key: sheet.id,
        value: sheet.id
      }, sheet.name);
    })), _react.default.createElement("button", {
      className: "gapi__component__btn gapi__component__btnCopy",
      onClick: this.handleClickCopyBtn
    }, "COPY"))), this.state.error && _react.default.createElement("div", {
      className: "gapi__component__error"
    }, this.state.error), this.state.successMessage && _react.default.createElement("div", {
      className: "gapi__component__successMessage"
    }, this.state.successMessage));
  }

}

exports.default = GapiAppendComponent;