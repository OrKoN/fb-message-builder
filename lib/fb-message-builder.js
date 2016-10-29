'use strict';

const isUrl = require('./is-url');
const breakText = require('./breaktext');

function isNumber(number) {
  return !isNaN(parseFloat(number)) && isFinite(number);
}

class FacebookTemplate {
  constructor() {
    this.template = {};
  }

  addQuickReply(text, payload) {
    if (!text || !payload)
      throw new Error('Both text and payload are required for a quick reply');

    if (payload.length > 1000)
      throw new Error('Payload can not be more than 1000 characters long');

    if (!this.template.quick_replies)
      this.template.quick_replies = [];

    if (this.template.quick_replies.length === 10)
      throw new Error('There can not be more than 10 quick replies');

    if (text.length > 20)
      text = breakText(text, 20)[0];

    this.template.quick_replies.push({
      content_type: 'text',
      title: text,
      payload: payload
    });

    return this;
  }

  get() {
    return this.template;
  }
}

class Text extends FacebookTemplate {
  constructor(text) {
    super();

    if (!text)
      throw new Error('Text is required for text template');

    this.template = {
      text: text
    };
  }
}

class Attachment extends FacebookTemplate {
  constructor(url, type) {
    super();

    if (!url || !isUrl(url))
      throw new Error('Attachment template requires a valid URL as a first paramether');

    this.template = {
      attachment: {
        type: type || 'file',
        payload: {
          url: url
        }
      }
    };
  }
}

class Image extends FacebookTemplate {
  constructor(url) {
    super();

    if (!url || !isUrl(url))
      throw new Error('Image template requires a valid URL as a first paramether');

    this.template = {
      attachment: {
        type: 'image',
        payload: {
          url: url
        }
      }
    };
  }
}

class Audio extends FacebookTemplate {
  constructor(url) {
    super();

    if (!url || !isUrl(url))
      throw new Error('Audio template requires a valid URL as a first paramether');

    this.template = {
      attachment: {
        type: 'audio',
        payload: {
          url: url
        }
      }
    };
  }
}

class Video extends FacebookTemplate {
  constructor(url) {
    super();

    if (!url || !isUrl(url))
      throw new Error('Video template requires a valid URL as a first paramether');

    this.template = {
      attachment: {
        type: 'video',
        payload: {
          url: url
        }
      }
    };
  }
}

class File extends FacebookTemplate {
  constructor(url) {
    super();

    if (!url || !isUrl(url))
      throw new Error('File attachment template requires a valid URL as a first paramether');

    this.template = {
      attachment: {
        type: 'file',
        payload: {
          url: url
        }
      }
    };
  }
}

class Generic extends FacebookTemplate {
  constructor() {
    super();

    this.bubbles = [];

    this.template = {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: []
        }
      }
    };
  }

  getLastBubble() {
    if (!this.bubbles || !this.bubbles.length)
      throw new Error('Add at least one bubble first!');

    return this.bubbles[this.bubbles.length - 1];
  }

  addBubble(title, subtitle) {
    if (this.bubbles.length === 10)
      throw new Error('10 bubbles are maximum for Generic template');

    if (!title)
      throw new Error('Bubble title cannot be empty');

    if (title.length > 80)
      throw new Error('Bubble title cannot be longer than 80 characters');

    if (subtitle && subtitle.length > 80)
      throw new Error('Bubble subtitle cannot be longer than 80 characters');

    let bubble = {
      title: title
    };

    if (subtitle)
      bubble['subtitle'] = subtitle;

    this.bubbles.push(bubble);

    return this;
  }

  addUrl(url) {
    if (!url)
      throw new Error('URL is required for addUrl method');

    if (!isUrl(url))
      throw new Error('URL needs to be valid for addUrl method');

    this.getLastBubble()['item_url'] = url;

    return this;
  }

  addImage(url) {
    if (!url)
      throw new Error('Image URL is required for addImage method');

    if (!isUrl(url))
      throw new Error('Image URL needs to be valid for addImage method');

    this.getLastBubble()['image_url'] = url;

    return this;
  }

  addButton(title, value) {
    const bubble = this.getLastBubble();

    bubble.buttons = bubble.buttons || [];

    if (bubble.buttons.length === 3)
      throw new Error('3 buttons are already added and that\'s the maximum');

    if (!title)
      throw new Error('Button title cannot be empty');

    if (!value)
      throw new Error('Button value is required');

    const button = {
      title: title
    };

    if (isUrl(value)) {
      button.type = 'web_url';
      button.url = value;
    } else {
      button.type = 'postback';
      button.payload = value;
    }

    bubble.buttons.push(button);

    return this;
  }

  get() {
    if (!this.bubbles || !this.bubbles.length)
      throw new Error('Add at least one bubble first!');

    this.template.attachment.payload.elements = this.bubbles;

    return this.template;
  }
}

class Button extends FacebookTemplate {
  constructor(text) {
    super();

    if (!text)
      throw new Error('Button template text cannot be empty');

    if (text.length > 80)
      throw new Error('Button template text cannot be longer than 80 characters');

    this.template = {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: text,
          buttons: []
        }
      }
    };
  }

  addButton(title, value) {
    if (this.template.attachment.payload.buttons.length === 3)
      throw new Error('3 buttons are already added and that\'s the maximum');

    if (!title)
      throw new Error('Button title cannot be empty');

    if (!value)
      throw new Error('Button value is required');

    const button = {
      title: title
    };

    if (isUrl(value)) {
      button.type = 'web_url';
      button.url = value;
    } else {
      button.type = 'postback';
      button.payload = value;
    }

    this.template.attachment.payload.buttons.push(button);

    return this;
  }

  get() {
    if (this.template.attachment.payload.buttons.length === 0)
      throw new Error('Add at least one button first!');

    return this.template;
  }
}

class Receipt extends FacebookTemplate {
  constructor(name, orderNumber, currency, paymentMethod) {
    super();

    if (!name)
      throw new Error('Recipient\'s name cannot be empty');

    if (!orderNumber)
      throw new Error('Order number cannot be empty');

    if (!currency)
      throw new Error('Currency cannot be empty');

    if (!paymentMethod)
      throw new Error('Payment method cannot be empty');

    this.template = {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'receipt',
          recipient_name: name,
          order_number: orderNumber,
          currency: currency,
          payment_method: paymentMethod,
          elements: [],
          summary: {}
        }
      }
    };
  }

  addTimestamp(timestamp) {
    if (!timestamp)
      throw new Error('Timestamp is required for addTimestamp method');

    if (!(timestamp instanceof Date))
      throw new Error('Timestamp needs to be a valid Date object');

    this.template.attachment.payload.timestamp = timestamp.getTime();

    return this;
  }

  addOrderUrl(url) {
    if (!url)
      throw new Error('Url is required for addOrderUrl method');

    if (!isUrl(url))
      throw new Error('Url needs to be valid for addOrderUrl method');

    this.template.attachment.payload.order_url = url;

    return this;
  }

  getLastItem() {
    if (!this.template.attachment.payload.elements || !this.template.attachment.payload.elements.length)
      throw new Error('Add at least one order item first!');

    return this.template.attachment.payload.elements[this.template.attachment.payload.elements.length - 1];
  }

  addItem(title) {
    if (!title)
      throw new Error('Item title is required');

    this.template.attachment.payload.elements.push({
      title: title
    });

    return this;
  }

  addSubtitle(subtitle) {
    if (!subtitle)
      throw new Error('Subtitle is required for addSubtitle method');

    let item = this.getLastItem();

    item.subtitle = subtitle;

    return this;
  }

  addQuantity(quantity) {
    if (!quantity)
      throw new Error('Quantity is required for addQuantity method');

    if (!isNumber(quantity))
      throw new Error('Quantity needs to be a number');

    let item = this.getLastItem();

    item.quantity = quantity;

    return this;
  }

  addPrice(price) {
    if (!price)
      throw new Error('Price is required for addPrice method');

    if (!isNumber(price))
      throw new Error('Price needs to be a number');

    let item = this.getLastItem();

    item.price = price;

    return this;
  }

  addCurrency(currency) {
    if (!currency)
      throw new Error('Currency is required for addCurrency method');

    let item = this.getLastItem();

    item.currency = currency;

    return this;
  }

  addImage(image) {
    if (!image)
      throw new Error('Abotolute url is required for addImage method');

    if (!isUrl(image))
      throw new Error('Valid absolute url is required for addImage method');

    let item = this.getLastItem();

    item.image_url = image;

    return this;
  }

  addShippingAddress(street1, street2, city, zip, state, country) {
    if (!street1)
      throw new Error('Street is required for addShippingAddress');

    if (!city)
      throw new Error('City is required for addShippingAddress method');

    if (!zip)
      throw new Error('Zip code is required for addShippingAddress method');

    if (!state)
      throw new Error('State is required for addShippingAddress method');

    if (!country)
      throw new Error('Country is required for addShippingAddress method');

    this.template.attachment.payload.address = {
      street_1: street1,
      street_2: street2 || '',
      city: city,
      postal_code: zip,
      state: state,
      country: country
    };

    return this;
  }

  addAdjustment(name, amount) {
    if (!amount || !isNumber(amount))
      throw new Error('Adjustment amount must be a number');

    let adjustment = {};

    if (name)
      adjustment.name = name;

    if (amount)
      adjustment.amount = amount;

    if (name || amount) {
      this.template.attachment.payload.adjustments = this.template.attachment.payload.adjustments || [];
      this.template.attachment.payload.adjustments.push(adjustment);
    }

    return this;
  }

  addSubtotal(subtotal) {
    if (!subtotal)
      throw new Error('Subtotal is required for addSubtotal method');

    if (!isNumber(subtotal))
      throw new Error('Subtotal must be a number');

    this.template.attachment.payload.summary.subtotal = subtotal;

    return this;
  }

  addShippingCost(shippingCost) {
    if (!shippingCost)
      throw new Error('shippingCost is required for addShippingCost method');

    if (!isNumber(shippingCost))
      throw new Error('Shipping cost must be a number');

    this.template.attachment.payload.summary.shipping_cost = shippingCost;

    return this;
  }

  addTax(tax) {
    if (!tax)
      throw new Error('Total tax amount is required for addSubtotal method');

    if (!isNumber(tax))
      throw new Error('Total tax amount must be a number');

    this.template.attachment.payload.summary.total_tax = tax;

    return this;
  }

  addTotal(total) {
    if (!total)
      throw new Error('Total amount is required for addSubtotal method');

    if (!isNumber(total))
      throw new Error('Total amount must be a number');

    this.template.attachment.payload.summary.total_cost = total;

    return this;
  }

  get() {
    if (!this.template.attachment.payload.elements.length)
      throw new Error('At least one element/item is required');

    if (!this.template.attachment.payload.summary.total_cost)
      throw new Error('Total amount is required');

    return this.template;
  }
}

module.exports = {
  Text: Text,
  Attachment: Attachment,
  Image: Image,
  Audio: Audio,
  Video: Video,
  File: File,
  Generic: Generic,
  Button: Button,
  Receipt: Receipt
};
