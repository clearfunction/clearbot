# ClearBot

(aka BurnBot)

## Requirements

* Yarn
* Node

## Development

To lint, run `make lint`.

To run locally, run `yarn run dev`

## Testing

The easiest way to test is to set this up in a standalone Slack instance and
then use ngrok.

## Deployment

See the `Makefile`... make sure you're the expected subscription by running `az account set --subscription YOUR_SUBSCRIPTION_ID`.

## Resources

* [Slack Bolt API](https://slack.dev/bolt/)
* [Block Kit Builder](https://api.slack.com/tools/block-kit-builder)
