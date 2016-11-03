# homestar-metadata
IOTDB Home☆Star metadata editor module

<img src="https://raw.githubusercontent.com/dpjanes/iotdb-homestar/master/docs/HomeStar.png" align="right" />

# About

Installing this Module will allow you to edit metadata of your Things when using Home☆Star. 
In particular, you will be able to edit:

* the **Name** of the Thing
* the **Facets** of the Thing, i.e. what does the Thing do
* the **Zones** of the Thing, i.e. where is the Thing located

When the module is installed and configured, a "star" symbol will
appear right of the name of the Thing in the main list.
[[See photo of main list](https://raw.githubusercontent.com/dpjanes/homestar-metadata/master/docs/main.jpg)].
Clicking on this star will bring you to the editor page.
[[See photo of editor](https://raw.githubusercontent.com/dpjanes/homestar-metadata/master/docs/editor.jpg)].

# Installation and Configuration

## Backgrounder

* [Read this first](https://github.com/dpjanes/node-iotdb/blob/master/docs/install.md)
* [Read about installing Home☆Star](https://github.com/dpjanes/node-iotdb/blob/master/docs/homestar.md)

## Installation

	$ npm install -g homestar ## may require sudo
    $ npm install homestar-metadata
    $ npm install homestar-persist

The second module is needed to keep the edits you make around between sessons!

## Configuration

In `boot/index.js` add the following lines:

    iotdb.use("homestar-metadata")
    iotdb.use("homestar-persist")

