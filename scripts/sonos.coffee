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
  io = require('socket.io')(robot.server)

  robot.sonos_sockets = []

  io.on 'connection', (socket) ->
    console.log 'a user connected to socket'

    robot.sonos_sockets.unshift socket

    socket.on 'disconnect', ->
      console.log "Goodbye to #{socket}"
      robot.sonos_sockets = robot.sonos_sockets.filter (aSocket) -> aSocket isnt socket

  io.on 'disconnect', (oldSocket) ->
    console.log "Forgetting #{oldSocket}"
    robot.sonos_sockets = robot.sonos_sockets.filter (socket) -> socket isnt oldSocket

  robot.on 'sockets:connection', (socket) ->
    console.log 'New connection to socket'
    socket.on 'other event', (data) -> console.log data

  robot.on 'sockets:disconnect', (oldSocket) ->
    console.log "Forgetting #{oldSocket}"
    robot.sonos_sockets = robot.sonos_sockets.filter (socket) -> socket isnt oldSocket

  robot.playOnSonos = (url) ->
    console.log "Checking Sockets: #{robot.sonos_sockets}"

    for socket in robot.sonos_sockets
      console.log 'sonosing a message...'
      socket.emit 'play_url', url: url

  robot.respond /sonos (.+)/, (res) ->
    robot.playOnSonos res.match[1]
