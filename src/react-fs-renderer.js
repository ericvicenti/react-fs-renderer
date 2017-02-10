
const {join} = require('path');
const denodeify = require('denodeify');
const fs = require('fs-extra');

import React from 'react';

const ensureDir = denodeify(fs.ensureDir);
const outputFile = denodeify(fs.outputFile);

function resolveCompositeElement(el) {
  if (typeof el.type === 'function') {
    return resolveCompositeElement(el.type(el.props));
  }
  return el;
}

async function renderToFS(el, path) {
  el = resolveCompositeElement(el);
  const {name} = el.props;
  if (el.type === 'folder') {
    console.log(`Ensuring ${path}`);
    await ensureDir(path);
    await Promise.all(React.Children.map(el.props.children, async child => {
      const childEl = resolveCompositeElement(child);
      const childPath = join(path, childEl.props.name);
      await renderToFS(childEl, childPath)
    }));
  } else if (el.type === 'file') {
    let data = el.props.children.join ? el.props.children.join('') : el.props.children;
    await outputFile(path, data);
    console.log(`Printing ${path}`, data);
  } else {
    console.log(`Cannot render element with type ${e.type}!`);
  }
}

const JSONFile = ({json, name}) => (
  <file
    name={name}
    children={JSON.stringify(json)}
  />
);

const PackageJSON = ({json}) => (
  <JSONFile
    name="package.json"
    json={json}
  />
);

module.exports = {
  renderToFS,
  JSONFile,
  PackageJSON,
};
