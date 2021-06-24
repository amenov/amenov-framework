const express = require('express')

const app = express()

const start = require(__dirname + '/bootstrap/start')

start({ express, app })
