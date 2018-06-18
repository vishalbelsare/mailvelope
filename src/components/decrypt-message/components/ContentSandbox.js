/**
 * Copyright (C) 2018 Mailvelope GmbH
 * Licensed under the GNU Affero General Public License version 3
 */

import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

export default class ContentSandbox extends React.PureComponent {
  constructor(props) {
    super(props);
    this.sandbox = null;
  }

  componentDidMount() {
    const sandbox = $(this.sandbox);
    sandbox.one('load', () => {
      sandbox.one('load', this.props.onTerminate);
      this.setContent(this.props.value);
    });
  }

  componentDidUpdate(prevProps) {
    if (this.sandbox && prevProps.value !== this.props.value) {
      this.setContent(this.props.value);
    }
  }

  setContent(value) {
    $(this.sandbox).contents().find('#content').append($.parseHTML(value));
  }

  render() {
    const sandboxContent = `
      <!DOCTYPE html>
      <html style="height: 100%">
        <head>
          <meta charset="utf-8">
          <meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;">
          <link rel="stylesheet" href="../../dep/bootstrap/css/bootstrap.css">
        </head>
        <body style="overflow: hidden; margin: 0; height: 100%">
         <div id="content" style="height: 100%; padding: 6px 12px; overflow: auto;">
         </div>
        </body>
      </html>
    `;
    return (
      <iframe style={{border: '1px solid lightgray', backgroundColor: 'white', borderRadius: '2px'}}
        srcDoc={sandboxContent} sandbox="allow-same-origin allow-popups"
        frameBorder="0" ref={node => this.sandbox = node} />
    );
  }
}

ContentSandbox.propTypes = {
  value: PropTypes.string,
  onTerminate: PropTypes.func
};