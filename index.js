
const less = require('less')
const os   = require('os')


function toRules (rules={}) {
  return Object
    .keys(rules)
    .map(attr => `${attr}: ${rules[attr]}`)
    .join(';\n')
}


function stylesheet (name, rules) {
  let cls = '.' + name
  let el  = document.querySelector(cls) || document.createElement('style')

  el.setAttribute('class', name)
  if (typeof rules === 'object')
    el.textContent = Object.keys(rules).reduce((css, selector) => css + `${selector} { \n${toRules(rules[selector])} }`, '')
  else if (typeof rules === 'string')
    el.textContent = rules

  // applyFrameStyle(el.cloneNode(true))
  return el
}


function applyFrameStyle (el) {
  setTimeout(() => {
    let iframe = document.querySelector('iframe')
    let doc = iframe.contentDocument
    doc.body.append(el)
  }, 2000)
}


function relativePath (path) {
  const { resolve } = require('path')
  window.os = os
  return resolve(os.homedir(), path)
  // return resolve(__dirname, path)
}


async function read (...paths) {
  const { readFileSync, existsSync } = require('fs')
  let path
  while (paths.length) {
    path = relativePath(paths.shift())
    if (existsSync(path))
      return readFileSync(path, 'utf-8')
  }
  return ""
}


async function parse (contents, globalVars = {}) {
  let options = { globalVars }
  let result = await less.render(contents, options)
  return result.css
}


async function watchStylesheet (path, constants) {
  path = relativePath(path)
  const { watch } = require('fs')
  return watch(path, () => {
    console.log("Reloading stylesheet in", path) // eslint-disable-line no-console
    decorateCustomCSS(path, constants)
  })
}


function getSetting (key, defaultValue='') {
  let conf = window.config.getConfig()
  if (key)
    return conf[key] || defaultValue
  return defaultValue
}


async function decorateCustomCSS (stylesheetPaths, constants) {
  let src = await read(stylesheetPaths)
  let css = await parse(src, constants)
  let el  = stylesheet('user-defined-styles', css)
  document.body.append(el)
}


function decorateHyper (host) {

  const filePath   = getSetting('stylesheetPath', '.hyper.less')
  const liveReload = getSetting('stylesheetAutoreload', true)
  const colors     = getSetting('colors', {})
  // const css        = getSetting('css', "")
  // const termCSS    = getSetting('termCSS', "")
  // console.log(colors, css, termCSS)
  const globalVars = Object.assign({}, colors, {
    backgroundColor: getSetting('backgroundColor', 'transparent'),
    foregroundColor: getSetting('foregroundColor', 'transparent'),
    borderColor:     getSetting('borderColor',     'transparent'),
  })

  if (liveReload)
    watchStylesheet(filePath, globalVars)

  decorateCustomCSS(filePath, globalVars)
  window.host = host
  window.arg  = arguments

  var x=require('electron').remote.getCurrentWindow()
  x.setVibrancy('dark')
  return host
}


function decorateConfig (config) {
  return Object.assign({}, config, {})
}


module.exports = {
  decorateHyper,
  decorateConfig
}
