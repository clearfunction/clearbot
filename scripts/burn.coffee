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
    'sick-burn.mp3',
    'thats-gotta-hurt.mp3'
  ]

  robot.respond /burn/, (res) ->
    robot.playOnSonos res.random(burns), res
    res.send ":fire: Burn! :fire:"

  robot.respond /!sickburn|:fire:/i, (res) ->
    robot.playOnSonos res.random(burns), res

  robot.respond /yakety/, (res) ->
    yaketySax = 'yakkety.mp3'
    robot.playOnSonos yaketySax, res

  robot.respond /fight/, (res) ->
    streetFighter = 'sf2-guile-theme.mp3'
    robot.playOnSonos streetFighter, res

  robot.respond /rick roll|rickroll/, (res) ->
    rickRoll = 'rick-roll.m4a'
    robot.playOnSonos rickRoll, res

  robot.respond /boom/, (res) ->
    url = 'bomb.mp3'
    robot.playOnSonos url, res

  robot.respond /rekt/, (res) ->
    url = 'air-horns.mp3'
    robot.playOnSonos url, res

  robot.respond /brutal/, (res) ->
    url = 'brutal-savage-rekt.mp3'
    robot.playOnSonos url, res

  robot.respond /:?it\s?depends:?/i, (res) ->
    itDepends = 'it-depends.mp3'
    robot.playOnSonos itDepends, res

  robot.respond /chewie/i, (res) ->
    url = 'chewbacca.mp3'
    robot.playOnSonos url, res

  # this URL is indented oddly so we can use it for two different events - see the webhook below
  cashUrl = 'cash-register.mp3'
  robot.respond /:dollar:/i, (res) ->
    robot.playOnSonos cashUrl, res

  # this will listen at clearbot.herokuapp.com/hubot/chaching - set up a slack webhook
  robot.router.post "/hubot/chaching", (req, res) ->
    robot.playOnSonos cashUrl, res
    res.end "💵 Chaching! 💵"

  robot.respond /:bell:|:bellhop_bell:/i, (res) ->
    url = 'desk-bell.mp3'
    robot.playOnSonos url, res

  robot.respond /\bham\b/i, (res) ->
    robot.playOnSonos 'ham.mp3', res
    res.send ":piggy:"
    res.send "hambutton.com"

  robot.respond /\bsad\b|trombone/i, (res) ->
    robot.playOnSonos 'sad-trombone.mp3', res

  robot.respond /cookie/i, (res) ->
    robot.playOnSonos 'is-it-cookie.mp3', res

  robot.respond /shoryuken/i, (res) ->
    robot.playOnSonos 'sf2-ken-theme.mp3', res
