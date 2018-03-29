#!/usr/bin/env sh

echo HUBOT_SLACK_TOKEN = $HUBOT_SLACK_TOKEN

env HUBOT_SLACK_TOKEN=$HUBOT_SLACK_TOKEN ./bin/hubot -a slack
