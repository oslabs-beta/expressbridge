
<h1 align="center">
ExpressBridge v1.0
</h1>
<p align="center">
  <strong>
    A tiny microservice framework for Nodejs. 🚀
  </strong>
</p>

<p align="center">
ExpressBridge is a free and open source microservice framework for Nodejs-based microservices. It is appropriate for use in any microservice or FaaS environment and across all cloud vendors.
</p>
<p align="center">
  <a href="https://github.com/oslabs-beta/expressbridge/blob/dev/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="Gatsby is released under the MIT license." />
  </a>
  <img alt="GitHub Workflow Status" src="https://img.shields.io/github/workflow/status/oslabs-beta/expressbridge/DEV%20CI">
</p>

## What's in this document
- Overview
- Quickstart Guide
- Learning ExpressBridge
- Sample Project
- Release Notes
- Documentation Site
- How to Contribute

## Overview: ExpressBridge Fundamentals
ExpressBridge provides a fluid, easy to use API that enables developers to stand up new microservices that handle, process, and dispatch messages with ease. The API surface is small and straightforward. Consider the following example:

```ts
const handler = (message) => {
    const expressBridge = new ExpressBridge({
        alwaysRunHooks: true,
    });

    expressBridge.pre((message) => {
        // ... pre-process message
    });

    expressBridge.post((message) => {
        // ... post-process message
    });

    // respond to some generic AWS events
    const awsEventHandler = (message) => { /* ... write to db, log event, dispatch message, etc */ }
    expressBridge.use({ source: 'aws.*' }, awsEventHandler, (err) => { console.log(err) }) 

    expressBridge.process(message);
}
```

The above example represents the entire API surface of the framework in its simplest implementation. However, ExpressBridge is highly configurable so as to be suitable for a wide range of scenarios. Understanding this configurability will enable you to fully leverage the power of this framework.