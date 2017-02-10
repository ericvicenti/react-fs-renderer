# React FS Renderer [![CircleCI](https://circleci.com/gh/ericvicenti/react-fs-renderer.svg?style=svg)](https://circleci.com/gh/ericvicenti/react-fs-renderer)

Tired of using an imperitive API to manipulate a tree of output? React gives us a great declarative interface for browser DOMs and native view heirarchies, but it doesn't help output a directory of files with a given format.. until now!

First, install it (and you'll also need React):

```
npm install --save react react-fs-renderer
```

You'll need to compile JSX- see [this gist for the exact setup to do so](https://gist.github.com/ericvicenti/4a10c1349ba4ab0e4f6e6e2f95cfcfd8). Now you can use it:

```js
import React from 'react';
import {
  renderToFS,
} from 'react-fs-renderer';


const JSONFile = ({ name, json }) => (
  <file
    name={`${name}.json`}
    children={JSON.stringify(json)}
  />
);

const MyProjectTemplate = ({ name, displayName }) => (
  <folder>
    <JSONFile name="app" json={{ name, displayName }} />
    <JSONFile name="package" json={{
      name,
      version: '0.0.0',
      main: 'src/${}.js',
      dependencies,
    }} />
    <folder name="src">
      <file name={`${name}.js`} children={mainFileContent} />
    </folder>
  </folder>
);


renderToFS(
  <MyProjectTemplate
    displayName="My Great App"
    name="GreatApp"
  />,
  './testDir'
);
```

This will create the following file tree:

```
./testDir/app.json
./testDir/package.json
./testDir/src/GreatApp.js
```

Now you can use React to declaratively render to files :-)


## About

This is a proof-of-concept implementation for the purpose of gathering feedback. If there is demand for this concept, I will maintain it and help move it to an organization for long-term stewardship.
