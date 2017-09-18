
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
  return resolve(__dirname, path)
}

async function read (path) {
  const { readFileSync } = require('fs')
  return readFileSync(relativePath(path), 'utf-8')
}

async function watchStylesheet (path) {
  path = relativePath(path)
  const { watch } = require('fs')

  return watch(path, (...args) => {
    console.log("Reloading stylesheet in", path)
    decorateCustomCSS(path)
  })
}


function getSetting (key, defaultValue='') {
  let conf = window.config.getConfig()
  if (key)
    return conf[key] || defaultValue
  return defaultValue
}


async function decorateCustomCSS (stylesheetPath) {

  let css = await read(stylesheetPath)
  let el  = stylesheet('user-defined-styles', css)
  console.log(el)
  document.body.append(el)

}


module.exports.decorateHyper = function (host) {

  const filePath   = getSetting('stylesheetPath', 'style.css')
  const liveReload = getSetting('stylesheetAutoreload', true)

  if (liveReload)
    watchStylesheet(filePath)
  decorateCustomCSS(filePath)
  return host
}
