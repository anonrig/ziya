// Core
import React, { Component } from 'react';

// Helpers
import uuid from 'uuid';
import getFileContent from './utils/getFileContent';

// UI
import Codemirror from 'react-codemirror';
import { File } from './File';
import 'codemirror/lib/codemirror.css'
import './App.css';
import 'codemirror/mode/javascript/javascript';

import 'codemirror/mode/javascript/javascript';

class App extends Component {
  constructor() {
    super();
    this.state = {
      files: [],
      selectedName: '',
      content: '',
      fileTypes: {
        js: 'javascript'
      }
    };
    this.handleFileClick = this.handleFileClick.bind(this);
    this.updateCode = this.updateCode.bind(this);
  }

  componentDidMount() {
    let self = this;
      if (!!window.EventSource) {
        var source = new EventSource('http://localhost:5000/sse/')
        source.addEventListener('message', (e) => {
          self.setState({
            files: []
          });
          self.setState({
            files: JSON.parse(e.data)
          })
        }, false)
        source.addEventListener('error', (e) => {
          if (e.readyState === EventSource.CLOSED) {
            console.log("Ziya was closed")
          }
        }, false)
      }
  }

  async handleFileClick(e) {
    const fileName = e.target.textContent;

    try {
      const fileContent = await getFileContent(fileName);
      this.setState({
        selectedName: fileName,
        content: fileContent
      });
    } catch (error) {
      console.error('error', error);
    }
  }

  updateCode(newCode) {
    this.setState({
      content: newCode
    });
  }

  getExtension(fileName) {
    const splittedName = fileName.split('.');
    return splittedName[splittedName.length - 1];
  }

  getFileType(extension) {
    return this.state.fileTypes[extension];
  }

  buildEditorOptions(mode, lineNumbers = true) {
    return {
      mode: mode,
      lineNumbers: lineNumbers
    }
  }

  render() {
    let editorOptions = this.buildEditorOptions(this.getFileType(this.getExtension(this.state.selectedName)));
    return (
      <div className="App">
        <div id="Container">
          <div className="Header">
            ZİYA
          </div>

          <div id="Sidebar">
            {
              this.state.files.map((item) => (
                <File
                  key={uuid.v1()}
                  name={item.name}
                  className={this.state.selectedName === item.name ? 'selected' : ''}
                  onClick={this.handleFileClick}
                 />
              ))
            }
          </div>

          <div id="Content" className={this.state.content ? '' : 'hidden'}>
            <Codemirror
              className="Editor"
              value={this.state.content}
              onChange={this.updateCode}
              options={editorOptions}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
