#! /usr/bin/env node

const execa = require('execa')

const path = require('path')
const rimraf = require('rimraf')

const argv = process.argv.slice(2)

function start(bin, ...arg) {
  execa(bin, [...arg, `${__dirname}/core/start.js`], {
    stdin: process.stdin,
    stdout: process.stdout,
    stderr: process.stderr
  })
}

function init() {
  execa(
    'git',
    [
      'clone',
      'https://github.com/amenov/amenov-framework-template.git',
      argv[1] ?? '.'
    ],
    {
      stdin: process.stdin,
      stdout: process.stdout,
      stderr: process.stderr
    }
  ).finally((res) => {
    rimraf(path.resolve('.git'), (err) => {
      if (err) console.log(err)
    })
  })
}

switch (argv[0]) {
  case 'dev':
    start('nodemon')
    break

  case 'start':
    start('pm2', 'start')
    break

  case 'init':
    init()
    break

  default:
    break
}
