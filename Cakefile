{print} = require 'util'
{spawn} = require 'child_process'
fs = require 'fs'

build = (callback) ->
  coffee = spawn 'coffee', ['-c', '-o', 'lib', 'src']
  coffee.stderr.on 'data', (data) ->
    process.stderr.write data.toString()
  coffee.stdout.on 'data', (data) ->
    print data.toString()
  coffee.on 'exit', (code) ->
    callback?() if code is 0

task 'build', 'Build lib/ from src/', ->
  build()

task 'watch', 'Watch and compile the source', ->
  coffee = spawn 'coffee', ['-w', '-c', '-o', 'lib', 'src']
  coffee.stderr.on 'data', (data) ->
    proccess.stderr.write data.toString()
  coffee.stdout.on 'data', (data) ->
    print data.toString()
  coffee.on 'exit', (code) ->
    callback?() if code is 0