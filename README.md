# Campaign

> Compose responsive email templates easily, fill them with models, and send them out.

This is the stuff responsible for sending beautiful emails in [Pony Foo][3]. I've now isolated the code and made it into a reusable package, called `campaign`. It comes with a dead simple API, and a beautiful responsive layout, [originally written by MailChimp][7], adapted by me, and easily configurable.

It uses [Mustache][6] to fill out the email templates, and [Mandrill][1] to actually send the emails, although providing your own service to actually send the emails is easy.

# Reference

Quick links for reference.

- [Getting Started][start]
- [Client Options][client]
- [Send Options][send]
- [Templates][templates]
- [Debugging][debug]
- [License][license]

# Getting Started

Install using `npm`.

```shell
npm i --save campaign
```

Set it up.

Construct a `client`.

```js
var client = require('campaign')();
```

<sub>_(the default client needs an API keep for [Mandrill][1], read on)_</sub>

Send emails!

```js
client.send(body, options, done);
```

<sub>_(detailed information below)_</sub>

# Client Options

Here are the default options, they are explained below.

```json
{
    "mandrill": {
        "apiKey": undefined,
        "debug": false
    },
    "from": undefined,
    "client": (mandrill),
    "trap": false,
    "headerImage": undefined,
    "layout": (default)
}
```

### `trap`

If `true`, then emails won't be sent to any of the recipients, but they'll be sent to the provided `trap` address instead. For example, you could set `trap` to `nico@bevacqua.io`, and all emails would be sent to me instead of the intended recipients. Great for spamming me, and also great for testing.

When you `trap` recipients, the email will get a nifty JSON at the end detailing the actual recipients that would've gotten it.

### `mandrill`

By default, the [Mandrill][1] service is used to send the emails. Mandrill is really awesome and you should be using it. It has a generous free plan.

At the time they host [the source code][2] in Bit Bucket, which is kind of cryptic, but you can read through it nonetheless.

You need to provide an API key in `apiKey`, and that's all there is to it. You might prefer to _ignore this configuration option_, and merely set `process.env.MANDRILL_APIKEY`. That works, too.

### `from`

An optional `from` address can be provided, the `client` is responsible for trying to make it look like that's the send address.

### `client`

You can actually use other email clients, providing your own. To do so, you need to provide a `client` object. The `client` object should have a `send` function, which takes a `model`, and a `done` callback.

Given that I originally worked with Mandrill, the `client` API is based on [their API client][2]. I'll add details upon request.

### `headerImage`

You may provide the full path to an image. This image will be encoded in `base64` and embedded into the email as a heading. Embedding helps people view your emails offline.

This image should have a `3:1`_ish_ ratio. For instance, I use `600x180` in [my blog][3]'s emails.

### `layout`

The layout used in your emails. Templates for email sending are meant to have the bare minimum needed to fill out an email. Since you want a consistent UX, the same `layout` should be used for every email your product sends.

A default layout `template` is provided. You can provide a different one, just set `layout` to the absolute path of a [Mustache][6] template file. For information about the model passed to the layout, see the **Templates** section.

# Email Sending Options

Once you've created a client, you can start sending emails. Here are the default options, and what you need to fill out.

```json
{
    "subject": undefined,
    "preview": this.subject,
    "to": (recipients),
    "images": (images),
    "social": {
        "twitter": undefined,
        "landing": undefined,
        "name": undefined
    },
    "mandrill": {
        "tags": (tags),
        "merge": (merge)
    },
    "styles": (styles)
}
```

### `subject`

The email subject.

### `preview`

This is the line that most email clients show as the _preview_ of the email message. It defaults to the subject line. Changing it is extremely encouraged.

### `to`

These are the recipients of the email you're sending. Simply provide a single recipient's email address, or an array of email addresses.

### `images`

If you want to provide the template with images other than the optional header when creating the `campaign` client, you can provide a list of file paths and names (to reference them in your templates), as shown below.

```js
[
    { name: 'housing', file: path.join(__dirname, 'housing.png')}
]
```

### `social`

Social metadata used when sending an email can help build your brand. You can provide a `twitter` handle, a `name` for your brand, and a `landing` page.

The `name` is used as the name of the send address, as well as in the "Visit <name>" link.

### `mandrill`

Configuration specifically used by the Mandrill client.

Mandrill allows you to add dynamic content to your templates, and this feature is supported by the default Mandrill client in `campaign`, out the box. Read more about [merge variables][4].

##### `mandrill.merge`

Given that Mandrill's `merge` API is **fairly obscure**, we process it in our client, so that you can configure it assigning something like what's below to `mandrill.merge`.

```json
{
    locals: [{
        email: "someone@accounting.is",
        model: {
            something: "is a merge local for the guy with that email"
        }
    }],
    globals: [{
        these: "are merge globals for everyone"
    }]
}
```

[Mandrill][1] lets you tag your emails so that you can find different campaigns later on. Read more about [tagging][5]. By default, emails will be tagged with the template name.

### `styles`

[Read about styles][styling] below.

# Templates

There are two types of templates: the `layout`, and the email's `body` template. A default `layout` is provided, so let's talk about the email templates first, and then the layout.

### Email `body` Templates

The `body` template determines what goes in the message body. The [options][send] we used to configure our email are _also used as the model_ for the `body` template, as sometimes it might be useful to include some of that metadata in the model itself.

The API expects an absolute path to the `body` template.

```js
client.send(body, options, done);
```

Other than the [options listed above][send], you can provide _any values you want_, and then reference those in the template.

### The `layout` Template

The `layout` has one fundamental requirement in order to be mildly functional, it should have a `{{{body}}}` in it, so that the actual email's content can be rendered. Luckily the default `layout` is good enough that **you shouldn't need to touch it**.

Purposely, the layout template isn't passed the full model, but only a subset, containing:

```json
{
    "_header": !!model._header,
    "subject": model.subject,
    "preview": model.preview,
    "generated": when
    "body": html,
    "trapped": model.trapped,
    "social": model.social,
    "styles": model.styles
}
```

In this case, the `_header` would whether a header image was provided. Then, `generated` contains the moment the email was rendered, using the `'YYYY/MM/DD HH:mm, UTC Z'` format string. Lastly, `trapped` contains the metadata extracted from the model when `trap` is set in the [client options][client].

### Styling the `layout`

These are the default `styles`, and you can override them in the `options` passed to [`client.send`][send].

```json
{
    "styles": {
        "bodyBackgroundColor": "#eaeadf",
        "bodyTextColor": "#505050",
        "codeFontFamily": "Consolas, Menlo, Monaco, 'Lucida Console', 'Liberation Mono', 'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', 'Courier New', monospace, serif",
        "fontFamily": "Helvetica",
        "footerBackgroundColor": "#f4f4f4",
        "headerColor": "#412917",
        "horizontalBorderColor": "#dedede",
        "layoutBackgroundColor": "#f3f4eb",
        "layoutTextColor": "#808080",
        "linkColor": "#e92c6c",
        "quoteBorderColor": "#cbc5c0"
    }
}
```

### Unsubscribe Facilities

The default `layout` supports an optional `unsubscribe_html` merge variable, which can be filled out like below.

```json
{
    "merge": {
        "locals": [{
            "email": "someone@somewhere.com",
            "model": {
                unsubscribe_html: "<a href='http://sth.ng/unsubscribe/hash_someone'>unsubscribe</a>"
            }
        }, {
            "email": "someone@else.com",
            "model": {
                unsubscribe_html: "<a href='http://sth.ng/unsubscribe/hash_someone_else'>unsubscribe</a>"
            }
        }]
    }
}
```

That'd be a perfect use for merge variables, which were described above in the [send options][send]. Remember, those are just supported by Mandrill, though. They [deal with those][4] after you make a request to their API.

Here is a screenshot of an email sent using this library by the [Pony Foo blog][3], in production.

![sample.png][8]

# Debugging

To help you debug, an alternative client is provided. Set it up like this:

```js
var campaign = require('campaign');
var client = campaign({
    client: campaign.clients.console
});
```

Now, rather than actually sending emails, you will get a lot of JSON output in your terminal. Useful!

# License

MIT

  [start]: #getting-started
  [client]: #client-options
  [send]: #send-options
  [templates]: #templates
  [license]: #license
  [styling]: #styling-the-layout
  [debug]: #debugging
  [1]: http://mandrill.com/
  [2]: https://bitbucket.org/mailchimp/mandrill-api-node/src/d6dcc306135c6100d9bc2e2da2e82c8dec3ff6fb/mandrill.js?at=master
  [3]: http://blog.ponyfoo.com
  [4]: http://help.mandrill.com/entries/21678522-How-do-I-use-merge-tags-to-add-dynamic-content-
  [5]: http://help.mandrill.com/entries/28563573-How-do-I-use-tags-in-Mandrill-
  [6]: https://github.com/janl/mustache.js
  [7]: https://github.com/mailchimp/Email-Blueprints
  [8]: http://i.imgur.com/Coy4m0Y.png
