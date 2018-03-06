# Vuejs Uploader

[![Travis Build](https://img.shields.io/travis/charliekassel/vuejs-uploader.svg)](https://travis-ci.org/charliekassel/vuejs-uploader)
[![Version](https://img.shields.io/npm/v/vuejs-uploader.svg)](https://www.npmjs.com/package/vuejs-uploader)
[![Coveralls github](https://img.shields.io/coveralls/github/charliekassel/vuejs-uploader.svg)](https://coveralls.io/github/charliekassel/vuejs-uploader?branch=master)
[![Downloads](https://img.shields.io/npm/dm/vuejs-uploader.svg)](https://www.npmjs.com/package/vuejs-uploader)

## Multipart uploader Vue component.

This uploader will optionally upload files in multipart chunks.
This get's around max upload sizes allowing you to upload large files.

If prop `multiple` is true a file list is rendered on selecting files otherwise file upload will begin on selection.

Drag is supported and when files are dragged over the uploader the class `vuejs-uploader--dragged` is added to the root element.

### Remaining upload parts

For resumable uploads we need to know what parts have already been uploaded so we don't bother re uploading them.
This component makes use of a response property that returns an array of parts remaining that still need to be uploaded.
If this property is in the response it will remove any parts in the queue that are not in that array.
To make use of this property it expects to be formatted as `meta.remainingParts`.

## Install

```bash
npm install vuejs-uploader
```

## Usage

Basic
```html
<uploader end-point="http://localhost:5000"></uploader>
```

Multiple Files
```html
<uploader end-point="http://localhost:5000" :multiple="true"></uploader>
```

Multipart upload, with custom Browse button using `slot` api
```html
<uploader end-point="http://localhost:5000" :multipart="true">
    <button slot="browse-btn">Select File</button>
</uploader>

<uploader end-point="http://localhost:5000" :multipart="true">
    <img slot="browse-btn" src="someimg.jpg" />
</uploader>
```

## Available props

|Prop                 |Type    |Required|Default|Description|
|---------------------|--------|--------|-------|----------|
|endPoint             |String  |yup     |       |Server end point to post requests|
|multiple             |Boolean |        |       |To allow multiple files to be added to the upload queue|
|multipart            |Boolean |        |       |Send files larger than `multipartChunkSize` in parts|
|multipartChunkSize   |Number  |        |2097152|Size of multipart chunks in bytes|
|maxUploads           |Number  |        |5      |Maximum number of file that can be added to the queue|
|maxThumbWidth        |Number  |        |80     |Maximum width of preview image created|
|maxThumbHeight       |Number  |        |80     |Maximum height of preview image created|
|accept               |String  |        |       |Mime types to accept|
|userDefinedProperties|Array   |        |       |array of objects defined with `property` and optional `required` properties|
|errorHandler         |Function|        |       |Function passed in to handle http errors|
|headers              |Object  |        |       |Headers can be added to the http requests|
|disabled             |Boolean |        |false  |Disable the uploader|

## Slots

|Slot name |Single file uploader|Multi file uploader|Description|
|----------|:------------------:|:-----------------:|-----------|
|browse-btn| X                  | X                 |Provide your own _browse_ button html|
|clear-btn |                    | X                 |Provide your own upload list _clear_ button html|
|upload-btn|                    | X                 |Provide your own upload list _upload_ button html|
|extra     |                    | X                 |Slot to add extra form elements to send along with the upload|

## Demo

To demo the uploader you need a server, there is a simple php example
in `server/php` that uses php's built in server.

Other examples will follow.

```bash
chmod 777 server/uploads
cd server/php
php -S localhost:5000
```
