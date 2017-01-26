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
    'https://www.dropbox.com/s/ql3z6d7kmoyof99/sick_burn.mp3?dl=1'
  ]

  robot.respond /burn/, (res) ->
    robot.playOnSonos res.random(burns)
    res.send ":fire: Burn! :fire:"

  robot.hear /!sickburn/, (res) ->
    robot.playOnSonos res.random(burns)
