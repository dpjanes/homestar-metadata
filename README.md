# homestar-metadata
IOTDB Home☆Star metadata editor module

<img src="https://raw.githubusercontent.com/dpjanes/iotdb-homestar/master/docs/HomeStar.png" align="right" />

# About

Installing this Module will allow you to edit metadata of your Things when using Home☆Star. 

# Installation and Configuration

## Backgrounder

* [Read this first](https://github.com/dpjanes/node-iotdb/blob/master/docs/install.md)
* [Read about installing Home☆Star](https://github.com/dpjanes/node-iotdb/blob/master/docs/homestar.md)

## Installation

    $ npm install -g homestar    ## may require sudo
    $ homestar install homestar-aws

## Configuration

### Create a HomeStar Account

* go to [https://homestar.io](https://homestar.io)
* click on [Sign In](https://homestar.io/sign/in)

A popup window will lead you through the installation process.
You will need access to a mobile phone, as this
uses Facebook's [Account Kit](https://developers.facebook.com/docs/accountkit).

### Create a Runner

* go to [Runners](https://homestar.io/runners)
* click on [Make new Runner](https://homestar.io/runners/add)

This will bring you to a new page. Then click on the
**Show Access Tokens** button to the right.

It will give you a set of command line instructions to set up 
your access Keys.

# Use

## Stand Alone

Just:

    const iotdb = require('iotdb')
    iotdb.use('homestar-aws')

## With HomeStar Runner

If you are doing `homestar runner` [docs](https://github.com/dpjanes/node-iotdb/blob/master/docs/homestar.md),
this will be loaded automatically.
