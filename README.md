# Facebook Message builder

[![npm](https://img.shields.io/npm/v/fb-message-builder.svg?maxAge=2592000?style=plastic)](https://www.npmjs.com/package/fb-message-builder)
[![npm](https://img.shields.io/npm/dt/fb-message-builder.svg?maxAge=2592000?style=plastic)](https://www.npmjs.com/package/fb-message-builder)
[![npm](https://img.shields.io/npm/l/fb-message-builder.svg?maxAge=2592000?style=plastic)](https://github.com/OrKoN/fb-message-builder/blob/master/LICENSE)
[![Build Status](https://travis-ci.org/OrKoN/fb-message-builder.svg?branch=master)](https://travis-ci.org/OrKoN/fb-message-builder)

Fork of [claudia-bot-builder](https://github.com/claudiajs/claudia-bot-builder) which offers the builder for Facebook messages only. No new features compared to claudia-bot-builder. All credits to the [Claudia Bot Builder team](https://github.com/claudiajs/claudia-bot-builder)

In this guide:

1. [Intro](#intro)
2. [Text messages](#text-messages)
3. [Generic template](#generic-template)
4. [Button template](#button-template)
5. [Receipt template](#receipt-template)
6. [Image attachment](#image-attachment)
7. [Audio attachment](#audio-attachment)
8. [Video attachment](#video-attachment)
9. [File attachment](#file-attachment)
10. [Other attachments](#other-attachments)
11. [Handling errors](#handling-errors)

## Intro

_Facebook Template Message builder_ allows you to generate more complex messages for Facebook Messenger without writing JSON files manually.

To use it, just require `fbTemplate` function from _Claudia Bot Builder_:

```js
const fbTemplate = require('fb-message-builder');
```

`fbTemplate` exports an object that contains multiple classes that allows you to generate different types of Facebook Messenger structured messages:

- Text messages (this is not template, but we need to have them because of quick answers)
- Generic template messages
- Button template messages
- Receipt template messages
- Image attachment messages
- Audio attachment messages
- Video attachment messages
- File attachment messages

More info about each type of structured messages can be found in [Facebook Messenger's Complete guide](https://developers.facebook.com/docs/messenger-platform/implementation#send_message).

## Text messages

Text messages returns a simple text. In case you don't need to add quick responses reply with a simple text and _Cluaudia Bot Builder_ will do the rest.

However, if you want to add quick replies check the class below.

### API

`Text` (class) - Class that allows you to build text messages with quick replies  

_Note:_ Claudia bot builders versions < 2.1 have just a lower case class `text`, same method works for versions >= 2.1, but it's deprecated and it will be removed in next major version.


_Arguments_:

- `text`, string (required) - a simple text to send as a reply.

### Methods

| Method        | Required | Arguments                                | Returns                           | Description                              |
| ------------- | -------- | ---------------------------------------- | --------------------------------- | ---------------------------------------- |
| addQuickReply | No       | title (string, required, up to 20 characters), payload (string, required), up to 1000 characters | `this` for chaining               | Facebook allows us to send up to 10 quick replies that will appear above the keyboard |
| get           | Yes      | No args.                                 | Formatted JSON to pass as a reply | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Facebook Messenger |

### Example

```js
const botBuilder = require('claudia-bot-builder');
const fbTemplate = botBuilder.fbTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'facebook') {
    const message = new fbTemplate.Text('What\'s your favorite House in Game Of Thrones');

    return message
      .addQuickReply('Stark', 'STARK')
      .addQuickReply('Lannister', 'LANNISTER')
      .addQuickReply('Targaryen', 'TARGARYEN')
      .addQuickReply('None of the above', 'OTHER')
      .get();
  }
});
```

_How it looks:_

![Text with quick replies](https://claudiajs.com/assets/facebook/text_with_quick_replies.png)

## Generic template

The Generic Template can take an image, title, subtitle, description and buttons. This template can support multiple bubbles per message and display them as a horizontal list.

### API

`Generic` (class) - Class that allows you to build Generic template messages  

_Note:_ Claudia bot builders versions < 2.1 have just a lower case class `generic`, same method works for versions >= 2.1, but it's deprecated and it will be removed in next major version.


_Arguments_:

- none

### Methods

| Method        | Required | Arguments                                | Returns             | Description                              |
| ------------- | -------- | ---------------------------------------- | ------------------- | ---------------------------------------- |
| addBubble     | Yes      | title (string, required), subtitle (string) | `this` for chaining | Each Generic template can have 1 to 10 elements/bubbles, before you add anything to it. It requires element's title, but it can also accept element's subtitle |
| addUrl        | No       | A valid URL                              | `this` for chaining | Adds an url to a current element, requires a valid URL, also requires `addBubble` to be added first |
| addImage      | No       | A valid absolute URL                     | `this` for chaining | Adds an image to a current element, requires a valid URL, also requires `addBubble` to be added first |
| addButton     | Yes      | title (string, required), value (required, string or a valid URL) | `this` for chaining | Adds a button to a current element, each button requires a title and a value, where value can be any string if you want `postback` type or a valid URL if you want it's type to be `web_url`, at least one button is required, and maximum 3 of them is allowed. It also requires `addBubble` to be added first |
| addQuickReply | No       | title (string, required, up to 20 characters), payload (string, required), up to 1000 characters | `this` for chaining | Facebook allows us to send up to 10 quick replies that will appear above the keyboard |
| get           | Yes      | No args.                                 | Formatted JSON      | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Facebook Messenger |

*_Required arguments_, Messenger requires all elements to have those values, the message builder will throw an error if you don't provide it.

### Example

```js
const botBuilder = require('claudia-bot-builder');
const fbTemplate = botBuilder.fbTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'facebook') {
    const generic = new fbTemplate.Generic();

    return generic
      .addBubble('Claudia.js', 'Deploy Node.js microservices to AWS easily')
        .addUrl('https://claudiajs.com')
        .addImage('https://claudiajs.com/assets/claudiajs.png')
        .addButton('Say hello', 'HELLO')
        .addButton('Go to Github', 'https://github.com/claudiajs/claudia')
      .addBubble('Claudia Bot Builder')
        .addImage('https://claudiajs.com/assets/claudia-bot-builder-video.jpg')
        .addButton('Go to Github', 'https://github.com/claudiajs/claudia-bot-builder')
      .get();
  }
});
```

_How it looks:_

![Text with quick replies](https://claudiajs.com/assets/facebook/generic.png)

## Button template

The Button Template is useful when you want to present simple text with options, it has the same buttons as Generic template, but it doesn't allow element image and URL, it also doesn't allow multiple elements.

### API

`Button` (class) - Class that allows you to build Button template messages  

_Note:_ Claudia bot builders versions < 2.1 have just a lower case class `button`, same method works for versions >= 2.1, but it's deprecated and it will be removed in next major version.


_Arguments_:

- `text`, string (required) - a text to display above the button(s).

### Methods

| Method        | Required | Arguments                                | Returns             | Description                              |
| ------------- | -------- | ---------------------------------------- | ------------------- | ---------------------------------------- |
| addButton     | Yes      | title (string, required), value (required, string or a valid URL) | `this` for chaining | Adds a button to a current element, each button requires a title and a value, where value can be any string if you want `postback` type or a valid URL if you want it's type to be `web_url`, at least one button is required, and maximum 3 of them is allowed |
| addQuickReply | No       | title (string, required, up to 20 characters), payload (string, required), up to 1000 characters | `this` for chaining | Facebook allows us to send up to 10 quick replies that will appear above the keyboard |
| get           | Yes      | No args.                                 | Formatted JSON      | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Facebook Messenger |

*_Required arguments_, Messenger requires all elements to have those values, the message builder will throw an error if you don't provide it.

### Example

```
const botBuilder = require('claudia-bot-builder');
const fbTemplate = botBuilder.fbTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'facebook') {
    return new fbTemplate.Button('How are you?')
      .addButton('Awesome', 'AWESOME')
      .addButton('Great', 'GREAT')
      .addButton('🎵🎵🎵', 'https://youtu.be/m5TwT69i1lU')
      .get();
  }
});
```

_How it looks:_

![Text with quick replies](https://claudiajs.com/assets/facebook/button.png)

## Receipt template

The Receipt Template can be used to send receipts for orders.

### API

`Receipt` (class) - Class that allows you to build Receipt template messages  

_Note:_ Claudia bot builders versions < 2.1 have just a lower case class `receipt`, same method works for versions >= 2.1, but it's deprecated and it will be removed in next major version.


_Arguments_:

- `name`, string (required) - recipient's Name
- `orderNumber`, string (required) - order number, must be unique
- `currency`, string (required) - currency for order, FB requires valid ISO 4217 currency code, for the list of valid codes check [ISO 4217 page on Wikipedia](https://en.wikipedia.org/wiki/ISO_4217#Active_codes).
- `paymentMethod`, string (required) - payment method details, this can be a custom string. ex: 'Visa 1234'

- `text`, string (required) - a text to display above the button(s).

### Methods

| Method             | Required          | Arguments                                | Returns             | Description                              |
| ------------------ | ----------------- | ---------------------------------------- | ------------------- | ---------------------------------------- |
| addTimestamp       | No                | timestamp (valid JS date object, required) | `this` for chaining | timestamp of the order                   |
| addOrderUrl        | No                | url (valid URL, required)                | `this` for chaining | order URL                                |
| addItem            | Yes, at least one | title (string, required)                 | `this` for chaining | add an item to a receipt, at least one item is required. Beside title, each item can have subtitle, quantity, price, currencty and image, methods bellow explains how to add them |
| addSubtitle        | No                | subtitle (string, required)              | `this` for chaining | current item's subtitle, requires `addItem` first |
| addQuantity        | No                | quantity (number, required)              | `this` for chaining | current item's quantity, requires `addItem` first |
| addPrice           | No                | price (number, required)                 | `this` for chaining | current item's price, requires `addItem` first |
| addCurrency        | No                | currency (string, required)              | `this` for chaining | current item's currency, requires `addItem` first |
| addImage           | No                | image (string, required)                 | `this` for chaining | current item's image, requires `addItem` first and accepts valid absolute urls only |
| addShippingAddress | No                | street1 (string, required), street2 (string, can be `null`), city (string, required), zip (string, required), state (string, required), country (string, required) | `this` for chaining | shipping address if applicable           |
| addAdjustment      | No                | name (string), amount (number)           | `this` for chaining | payment adjustments, multiple adjustments are allowed |
| addSubtotal        | No                | subtotal (number, required)              | `this` for chaining | subtotal                                 |
| addShippingCost    | No                | shippingCost (number, required)          | `this` for chaining | shipping cost                            |
| addTax             | No                | tax (number, required)                   | `this` for chaining | total tax                                |
| addTotal           | Yes               | total (number, required)                 | `this` for chaining | total cost                               |
| addQuickReply      | No                | title (string, required, up to 20 characters), payload (string, required), up to 1000 characters | `this` for chaining | Facebook allows us to send up to 10 quick replies that will appear above the keyboard |
| get                | Yes               | No args.                                 | Formatted JSON      | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Facebook Messenger |

### Example

```js
const botBuilder = require('claudia-bot-builder');
const fbTemplate = botBuilder.fbTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'facebook') {
    return new fbTemplate.Receipt('Stephane Crozatier', '12345678902', 'USD', 'Visa 2345')
      .addTimestamp(new Date(1428444852))
      .addOrderUrl('http://petersapparel.parseapp.com/order?order_id=123456')
      .addItem('Classic White T-Shirt')
        .addSubtitle('100% Soft and Luxurious Cotton')
        .addQuantity(2)
        .addPrice(50)
        .addCurrency('USD')
        .addImage('http://petersapparel.parseapp.com/img/whiteshirt.png')
      .addItem('Classic Gray T-Shirt')
        .addSubtitle('100% Soft and Luxurious Cotton')
        .addQuantity(1)
        .addPrice(25)
        .addCurrency('USD')
        .addImage('http://petersapparel.parseapp.com/img/grayshirt.png')
      .addShippingAddress('1 Hacker Way', '', 'Menlo Park', '94025',  'CA', 'US')
      .addSubtotal(75.00)
      .addShippingCost(4.95)
      .addTax(6.19)
      .addTotal(56.14)
      .addAdjustment('New Customer Discount', 20)
      .addAdjustment('$10 Off Coupon', 10)
      .get();
  }
});
```

_How it looks:_

![Text with quick replies](https://claudiajs.com/assets/facebook/receipt.png)

## Image attachment

Image attachment allows you to send, obviously, an image :)

### API

`Image` (class) - Class that allows you to send an image attachment message  

_Note:_ Claudia bot builders versions < 2.1 have just a lower case class `image`, same method works for versions >= 2.1, but it's deprecated and it will be removed in next major version.


_Arguments_:

- `url`, string (required) - a valid absolute URL for an image.

### Methods

| Method        | Required | Arguments                                | Returns                           | Description                              |
| ------------- | -------- | ---------------------------------------- | --------------------------------- | ---------------------------------------- |
| addQuickReply | No       | title (string, required, up to 20 characters), payload (string, required), up to 1000 characters | `this` for chaining               | Facebook allows us to send up to 10 quick replies that will appear above the keyboard |
| get           | Yes      | No args.                                 | Formatted JSON to pass as a reply | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Facebook Messenger |

### Example

```js
const botBuilder = require('claudia-bot-builder');
const fbTemplate = botBuilder.fbTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'facebook') {
    return new fbTemplate
      .Image('https://claudiajs.com/assets/claudiajs.png')
      .get();
  }
});
```

_How it looks:_

![Text with quick replies](https://claudiajs.com/assets/facebook/image.png)

## Audio attachment

Audio attachment allows you to send audio files.

### API

`Audio` (class) - Class that allows you to send an audio attachment message  

_Note:_ Claudia bot builders versions < 2.1 have just a lower case class `audio`, same method works for versions >= 2.1, but it's deprecated and it will be removed in next major version.


_Arguments_:

- `url`, string (required) - a valid absolute URL for an audio file.

### Methods

| Method        | Required | Arguments                                | Returns                           | Description                              |
| ------------- | -------- | ---------------------------------------- | --------------------------------- | ---------------------------------------- |
| addQuickReply | No       | title (string, required, up to 20 characters), payload (string, required), up to 1000 characters | `this` for chaining               | Facebook allows us to send up to 10 quick replies that will appear above the keyboard |
| get           | Yes      | No args.                                 | Formatted JSON to pass as a reply | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Facebook Messenger |

### Example

```js
const botBuilder = require('claudia-bot-builder');
const fbTemplate = botBuilder.fbTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'facebook') {
    return new fbTemplate
      .Audio('http://www.noiseaddicts.com/samples_1w72b820/4927.mp3')
      .get();
  }
});
```

_How it looks:_

![Text with quick replies](https://claudiajs.com/assets/facebook/audio.png)

## Video attachment

Video attachment allows you to send video files.

### API

`Video` (class) - Class that allows you to send an video attachment message  

_Note:_ Claudia bot builders versions < 2.1 have just a lower case class `video`, same method works for versions >= 2.1, but it's deprecated and it will be removed in next major version.


_Arguments_:

- `url`, string (required) - a valid absolute URL for a video.

### Methods

| Method        | Required | Arguments                                | Returns                           | Description                              |
| ------------- | -------- | ---------------------------------------- | --------------------------------- | ---------------------------------------- |
| addQuickReply | No       | title (string, required, up to 20 characters), payload (string, required), up to 1000 characters | `this` for chaining               | Facebook allows us to send up to 10 quick replies that will appear above the keyboard |
| get           | Yes      | No args.                                 | Formatted JSON to pass as a reply | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Facebook Messenger |

### Example

```js
const botBuilder = require('claudia-bot-builder');
const fbTemplate = botBuilder.fbTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'facebook') {
    return new fbTemplate
      .Video('http://techslides.com/demos/sample-videos/small.mp4')
      .get();
  }
});
```

_How it looks:_

![Text with quick replies](https://claudiajs.com/assets/facebook/video.png)

## File attachment

File attachment allows you to send files.

### API

`File` (class) - Class that allows you to send a file attachment message  

_Note:_ Claudia bot builders versions < 2.1 have just a lower case class `file`, same method works for versions >= 2.1, but it's deprecated and it will be removed in next major version.


_Arguments_:

- `url`, string (required) - a valid absolute URL for a file you want to send.

### Methods

| Method        | Required | Arguments                                | Returns                           | Description                              |
| ------------- | -------- | ---------------------------------------- | --------------------------------- | ---------------------------------------- |
| addQuickReply | No       | title (string, required, up to 20 characters), payload (string, required), up to 1000 characters | `this` for chaining               | Facebook allows us to send up to 10 quick replies that will appear above the keyboard |
| get           | Yes      | No args.                                 | Formatted JSON to pass as a reply | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Facebook Messenger |

### Example

```js
const botBuilder = require('claudia-bot-builder');
const fbTemplate = botBuilder.fbTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'facebook') {
    return new fbTemplate
      .File('https://claudiajs.com/assets/claudiajs.png')
      .get();
  }
});
```

_How it looks:_

![Text with quick replies](https://claudiajs.com/assets/facebook/image.png)

## Other attachments

Beside those, Facebook Messenger now supports a few other templates that are not so useful for the common bots, ie. Airline templates.

You can use all those templates by simply providing an object (just a message part, without recepient) instead of a template builder class.

An example:

```javascript
const botBuilder = require('claudia-bot-builder');

module.exports = botBuilder(message => {
  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: [{
          title: 'Breaking News: Record Thunderstorms',
          subtitle: 'The local area is due for record thunderstorms over the weekend.',
          image_url: 'https://media.xiph.org/BBB/BBB-360-png/big_buck_bunny_01542.png',
          buttons: [{
            type: 'element_share'
          }]
        }]
      }
    }
  };
});
```

_How it looks:_

![Text with quick replies](https://claudiajs.com/assets/facebook/other.png)

## Handling errors

_Facebook Template Message builder_ checks if the messages you are generating are following Facebook Messenger guidelines and limits, in case they are not an error will be thrown.

_Example:_

Calling `new fbTemplate.text()`  without text will throw `Text is required for text template` error.

More info about limits and guidelines can be found in [Messenger's Send API Referece](https://developers.facebook.com/docs/messenger-platform/send-api-reference).

All errors that Claudia bot builder's fbTemplate library is throwing can be found [in the source code](../lib/facebook/format-message.js).

Errors will be logged in Cloud Watch log for your bot.

## Authors

* [Gojko Adžić](https://github.com/gojko)
* [Aleksandar Simović](https://github.com/simalexan)
* [Slobodan Stojanović](https://github.com/stojanovic)

## License

MIT -- see [LICENSE](LICENSE)
