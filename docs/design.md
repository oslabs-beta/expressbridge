# Design document

## Objective
Provide an easy-to-use abstraction for consuming Amazon Event Bridge events, exposed as a configurable express middleware.

## Requirements
Specific requirements needed. How to judge if complete
An implementation of an express middleware that accepts an event pattern to handle.



## What is out of scope


## Background to the problem domain -- what is it, why is it important

## Overview -- readable by a generic engineer -- with diagrams. 

## Infrastructure needed

## Success criteria
- Functional + non functional requirements

```ts
const expressBridge = require(‘expressbridge’);
app.use(expressBridge.configure());

Const evtPattern = {
   “Source”: “aws.ec2”,
   “Detail-type”: “EC2 Instance State-change Notification”
   “Detail”: {“state”: “terminated”, “product_source”: /vendor$/i}
};

expressBridge.use({evtPattern}, handler);

incomingEvent.has().key(‘source’).withValue(‘aws.ec2’)


##### possible bit string discussion #####

Const keyMappingNumberTable = {
  Source: 0,
  Detail: 1,
  Detail-Type: 2,
  ...
}

Function createBitStr(eventObj, keyMappingNumberTable) {
  Const bitArray = new Array(Object.keys(keyMappingNumberTable).length).fill(0);
  For (let key in eventObj) {
    bitArray[keyMappingNumberTable[key]] = 1
  }
  Return bitArray.join(‘’);
}

Function findMathcingEventPattern(eventBitStr, patternBitStrObj) {
  For (let key in patternBitStrObj) {
     // number xor with itself equals 0
     If (key ^ eventBitStr === 0) {return patternBitStrObj[key]}
  }
}

Const reverseHashMap = {};
Function createEventHashKey(eventObj) { 
  Const keys = Object.keys(eventObj);
  keys.sort();
  Let str = ‘’;
  For (let key of keys) {
        str+= key + ‘$’ + eventObj[key]
  }
  reverseHashMap[str] = eventObj;
}

##### possible bit string discussion #####

Const matcher = (event) => {
   If (event.detail.state === ‘terminated’) return true;
};

expressBridge.use(matcher, handler);


{
  "version": "0",
  "id": "6a7e8feb-b491-4cf7-a9f1-bf3703467718",
  "detail-type": "EC2 Instance State-change Notification",
  "source": "aws.ec2",
  "account": "111122223333",
  "time": "2017-12-22T18:43:48Z",
  "region": "us-west-1",
  "resources": [
    "arn:aws:ec2:us-west-1:123456789012:instance/i-1234567890abcdef0"
  ],
  "detail": {
    "instance-id": " i-1234567890abcdef0",
    "state": "terminated"
  }
}

Const evtPattern1 = {
   “Source”: “aws.ec2”,
   “Detail-type”: “EC2 Instance State-change Notification”
   “Detail”: {“state”: “terminated”}
};

Const evtPattern2 = {
   “Source”: “aws.ec2”,
   “Detail-type”: “EC2 Instance State-change Notification”
   “Detail”: {“state”: “started”}
};

expressBridge.use({evtPattern1}, handler);
expressBridge.use({evtPattern2}, handler);

Object.keys(eventPatternList).forEach(() => {

})

// for each handler
    Look at each key in the pattern
      If all key/val matches → run handler function
   Else… move to next handler registered

```