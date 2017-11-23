# Vuejs Uploader

Multipart uploader Vue component.

This uploader will optionally upload files in multipart chunks.
This get's around max upload sizes allowing you to upload large files.

If prop `multiple` is true a file list is rendered on selecting files otherwise file upload will begin on selection.

Drag is supported and when files are dragged over the uploader the class `vuejs-uploader--dragged` is added to the root element.

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
    <button slot="browse">Select File</button>
</uploader>

<uploader end-point="http://localhost:5000" :multipart="true">
    <img slot="browse" src="someimg.jpg" />
</uploader>
```

## Available props

|Prop                 |Type    |Required|Default|Description|
|---------------------|--------|--------|-------|----------|
|endPoint             |String  |yup     |       |Server end point to post requests|
|uploadManual         |Boolean |        | false |It will cancel automatic upload when file selected or dropped|
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

## Demo

To demo the uploader you need a server, there is a simple php example
in `server/php` that uses php's built in server.

Other examples will follow.

```bash
chmod 777 server/uploads
cd server/php
php -S localhost:5000
```
