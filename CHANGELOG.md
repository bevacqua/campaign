# 1.6.0 `JSON-LD`

- Campaign now forwards the `linkedData` property to the layout template

# 1.5.0 Bug as a Service

- Fix an issue where the templating service would throw an error

# 1.4.4 Unsubscribe As Authored

- Introduced `_unsubscribe` layout property, making it optional _(but still a merge variable when using the Mandrill provider)_

# 1.4.3 Easy Going

- Introduced ability to set `from` and `trap` fields on the email model as well as on the Campaign configuration object

# 1.4.2 Teaser Appeaser

- Replace instances of `preview` with `teaser`

# 1.3.3 Showdown

- Fixed an issue where embedded images wouldn't be displayed

# 1.3.1 Touching Base

- Alternative way to provide image paths using `base64` values

# 1.2.8 Scoped Terminal

- Terminal provider is now scoped

# 1.2.6 Special Moments

- Allow to modify `moment`'s format string

# 1.2.5

- Pretty Markdown output for `terminal` logger

# 1.2.1 Mail Fraud

- `client.send` and `client.sendString` now return only the result from the provider

# 1.2.0 Spark Plugs

- Support for plugging in templating engines other than `mustache`

**BREAKING**

- Renamed `console` client as `terminal`

# 1.1.1 Real Eel

- Setting `trap` to `true` will now simply not send any emails, period

# 1.1.0 Providing for the family

- Renamed confusing `client` definition as `provider`, which is more accurate

# 1.0.1 Mailbox

- Out the box `nodemailer` client added

# 1.0.0 Dragon Fire

- Initial Public Release
