
import React from 'react';
import {
  renderToFS,
  PackageJSON,
} from '../react-fs-renderer';

const { readdirSync, readFileSync } = require('fs');
const { join } = require('path');
const { tmpdir } = require('os');

test('React FS renderer', async () => {
  const CompositeFile = () => <file name="composite.txt" children="composite data" />;
  const Dude = ({arg}) => (
    <folder name="foo">
      <file name="bar">Baar {arg} baz</file>
      <PackageJSON
        json={{
          version: '0.0.0',
          name: 'Dude'
        }}
      />
      <file name="baz" children="zooo" />
      <folder name="subfolder">
        <CompositeFile />
      </folder>
    </folder>
  );

  const Dude2 = () => (
    <folder name="Dude2">
      <Dude arg={'arrrr'} />
      <file name="baz" children="zooo" />
    </folder>
  );

  const destPath = join(tmpdir(), `react-fs-render-test-${Math.floor(Math.random()*100000)}`);

  await renderToFS(<Dude2 />, destPath);

  expect(readdirSync(destPath)).toEqual(['baz', 'foo']);
  expect(readdirSync(join(destPath, 'foo'))).toEqual(['bar', 'baz', 'package.json', 'subfolder']);
  expect(readdirSync(join(destPath, 'foo', 'subfolder'))).toEqual(['composite.txt']);
  expect(readFileSync(join(destPath, 'baz'), {encoding: 'utf8'})).toEqual('zooo');
  expect(readFileSync(join(destPath, 'foo', 'baz'), {encoding: 'utf8'})).toEqual('zooo');
  expect(readFileSync(join(destPath, 'foo', 'bar'), {encoding: 'utf8'})).toEqual('Baar arrrr baz');
  expect(readFileSync(join(destPath, 'foo', 'package.json'), {encoding: 'utf8'})).toEqual("{\"version\":\"0.0.0\",\"name\":\"Dude\"}");
  expect(readFileSync(join(destPath, 'foo', 'subfolder', 'composite.txt'), {encoding: 'utf8'})).toEqual('composite data');
  
});
