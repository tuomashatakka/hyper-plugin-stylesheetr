# hyper-stylesheetr

#### 💁🏻 Include a custom css file in hyper with such ease 💁🏻

💁🏻 💁🏻 💁🏻

To apply custom css styles in hyper, add a ``stylesheetPath`` entry to the ``.hyper.js`` configuration file's exports, for example:

```javascript
module.exports = {
  stylesheetPath: '/Users/mattimeika/kikki/styleshet3000.css'
}
```

💁🏻 💁🏻 💁🏻

Remember to create the file you are referring to.

To disable the live reloading of the css file on updates (but why would one want to do that?), add a ``stylesheetAutoreload`` entry with __any value that resolves to false__ into the hyper.js' configuration.

💁🏻 💁🏻 💁🏻

## Configuration options reference

| Option (type) | Description |
| --- | --- |
| ``stylesheetPath (URI string)`` | Path for the css file to include |
| ``stylesheetAutoreload (boolean)`` | Whether to reload the stylesheet automatically when the file is updated |

💁🏻 💁🏻 💁🏻
