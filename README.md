# file-detector-js
> Detect file type using JavaScript FileReader API

### Description

Mime-Type of a file is not a reliable source of information about the file. It checks the extension of the file which may be changed easily and reflect the wrong type programmatically.  
In this project, we read the first 4 bytes of the file using the FileReader API of browser JavaScript, and then match it using the known file type headers.  
We only match a few types except JPEG, PNG and GIF, but the list can be expanded to more. For comprehensive analysis of file types using FileReader, use this library by @sindresorhus : [file-type](https://github.com/sindresorhus/file-type). It checks 4100 bytes of file instead for much more detailed analysis to detect more file types.

### Setup

The project is written using TypeScript, so for making it easy to run, use [Parcel](https://parceljs.org/). To run the project using Parcel, 

```bash
parcel index.html
```

### Source

This project is taken, inspired and modified from this Medium Article: [Detect file mime type using magic numbers and JavaScript](https://medium.com/the-everyday-developer/detect-file-mime-type-using-magic-numbers-and-javascript-16bc513d4e1e)

### Author
[@iamareebjamal](github.com/iamareebjamal)