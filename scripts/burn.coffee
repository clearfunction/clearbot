# Description:
#   Example scripts for you to examine and try out.
#
# Notes:
#   They are commented out by default, because most of them are pretty silly and
#   wouldn't be useful and amusing enough for day to day huboting.
#   Uncomment the ones you want to try and experiment with.
#
#   These are from the scripting documentation: https://github.com/github/hubot/blob/master/docs/scripting.md
#

module.exports = (robot) ->
  burns = [
    'https://www.dropbox.com/s/ql3z6d7kmoyof99/sick_burn.mp3?dl=1',
    'https://www.dropbox.com/s/70pmpo3u1lm8c0i/thats_gotta_hurt.mp3?dl=1'
  ]

  robot.respond /burn/, (res) ->
    robot.playOnSonos res.random(burns), res
    res.send ":fire: Burn! :fire:"

  robot.hear /!sickburn|:fire:/i, (res) ->
    robot.playOnSonos res.random(burns), res

  robot.hear /yakety/, (res) ->
    yaketySax = 'https://www.dropbox.com/s/1uw0a213cuh0ygi/yakkety.mp3?dl=1'
    robot.playOnSonos yaketySax, res

  robot.hear /fight/, (res) ->
    streetFighter = 'https://www.dropbox.com/s/dtqubg932qfgex1/Street%20Figher%20Forever.m4a?dl=1'
    robot.playOnSonos streetFighter, res

  robot.hear /rick roll|rickroll/, (res) ->
    rickRoll = 'https://www.dropbox.com/s/1cmqoz0gbx3vqpw/rickroll.m4a?dl=1'
    robot.playOnSonos rickRoll, res

  robot.hear /boom/, (res) ->
    url = 'https://www.dropbox.com/s/v4439d6bgj41gvj/Funkmaster%20Flex%20Bomb%20sound%20effect.mp3?dl=1'
    robot.playOnSonos url, res

  robot.hear /rekt/, (res) ->
    url = 'https://www.dropbox.com/s/gvvirc7jirmjnvt/MLG%20SOUND%20EFFECT-%20AIR%20HORNS%21.mp3?dl=1'
    robot.playOnSonos url, res

  robot.hear /brutal/, (res) ->
    url = 'https://www.dropbox.com/s/iktowhehxb7ldgf/Brutal%2C%20Savage%2C%20Rekt.mp3?dl=1'
    robot.playOnSonos url, res

  robot.hear /it\s*depends/i, (res) ->
    itDepends = 'https://www.dropbox.com/s/nlwo94pdtwhtsl1/It%20Depends.mp3?dl=1'
    robot.playOnSonos itDepends, res

  robot.hear /daniel/i, (res) ->
    damn_daniel = 'https://www.dropbox.com/s/pzhqv1d5xgd8fxv/damn_daniel.m4a?dl=1'
    robot.playOnSonos damn_daniel, res
    res.send "Daniel is the man!"

  robot.hear /chewie/i, (res) ->
    url = 'http://soundbible.com/mp3/Chewbacca%20Wookie%20Noise-SoundBible.com-1201859158.mp3'
    robot.playOnSonos url, res

  robot.hear /:dollar:/i, (res) ->
    url = 'https://www.dropbox.com/s/2zkm9umu1pl6dse/Cash%20Register%20Sound%20Effect.mp3?dl=1'
    robot.playOnSonos url, res

  robot.hear /:bell:|:bellhop_bell:/i, (res) ->
    url = 'https://www.dropbox.com/s/qi75u7e8tq3pzcr/Desk%20Bell%20sound%20effect.mp3?dl=1'
    robot.playOnSonos url, res

  robot.hear /\bham\b/i, (res) ->
    robot.playOnSonos 'https://hambutton.s3.amazonaws.com/ham.mp3', res
    res.send ":piggy:"
    res.send "hambutton.com"
