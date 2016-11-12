#Global Interactive Org Chart API

## Prerequisites

* node.js
* mongodb

## Setup
Mongo connects on port 27017 of `localhost`


##Rest API

| | |
| --- | ---|
| **Title**  | Get Employee (can get one or many) |
| **URL** | `/employees/get` |
| **Method** | `GET` |
| **URL params** |  (optional) <br />  `?_id=456` <br /> `office=DC` <br /> `country=US` <br />  `country=US&office=DC` |
| **Success Response** | **status** 200 <br/> ```[{"_id":"456","first-name":"first","last-name":"last","continent":"NA","country":"US","office":"DC","location":"Illinois","role":"dev","sme1":"tridion","sme2":"mm","supervisor":"shawn","phone":"214 234 6496","email":"frank@tahzoo.com","skype":"paceaux","twitter":"@paceaux","linkedin":"http://linkedin.com/frank"}]``` |
| **error response** | **status** 200 <br /> ``` []``` |

| | |
| --- | ---|
| **Title**  | Add Employee <br /> Accepts either a JSON object, or an array of JSON objects |
| **URL** | `/employees/add` |
| **Method** | `POST` |
| **Data** |  Requires JSON object  |
| **Success Response** | **status** 200 <br /> ``` {"status":"success","result":{"ok":1,"n":1}} ``` |
| **error response** | **status** 200 <br /> ``` {status: 'duplicate', results: [data]}``` |


| | |
| --- | ---|
| **Title**  | Update Employee (can only update one at a time) |
| **URL** | `/employees/update` |
| **Method** | `PUT` |
| **Data** |  (required) <br />  requires JSON object that includes unique id (`{_id:[unique id]}`)  |
| **Success Response** | **status** 200 <br/> ```{data} ``` |
| **error response** | **status** 200 <br /> ``` {status: [missing | error ] }``` |

| | |
| --- | ---|
| **Title**  | Remove Employee |
| **URL** | `/employees/remove` |
| **Method** | `DELETE` |
| **Data** |  (none) <br /> requires json object with `{_id :[unique id]} ` |
| **Success Response** | **status** 200 <br/> ``` {status: success, result: [results]} ``` |
| **error response** | **status** 200 <br /> ``` {status: [missing, error]} ``` |





