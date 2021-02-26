#!/usr/bin/env node

const moduleAlias = require('module-alias')
moduleAlias.addAlias('graceful-fs', require.resolve('graceful-fs'))

const { commands } = require('gitbook')
const yargs = require('yargs')

for (const cmd of commands) {
  const argKeys = cmd.name
    .match(/\[[^\]]+\]/g)
    .map(key => key.replace(/^\[(.+)\]$/, '$1'))
  yargs.command(
    cmd.name,
    cmd.description,
    yargs => {
      for (const opt of cmd.options) {
        yargs.option(opt.name, {
          describe: opt.description,
          choices: opt.values,
          default: opt.defaults
        })
      }
    },
    argv => {
      const { _, $0, ...kwargs } = argv
      const args = argKeys
        .map(key => kwargs[key])
        .filter(value => value != null)
      cmd.exec(args, kwargs)
    }
  )
}
yargs.strict(true).help().argv
