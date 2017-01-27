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
  RELAY_CLIENT_DOWNLOAD_URL = "https://github.com/clearfunction/sonos_proxy_rb"
  # PREAMBLE
  io = require('socket.io')(robot.server)

  robot.sonos_sockets = []

  logClientStats = (msg) ->
    console.log msg
    console.log "\t#{robot.sonos_sockets.length} Sonos relay clients currently connected."

  # MANAGE SOCKET.IO CONNECTED CLIENTS LIST
  io.on 'connection', (socket) ->
    robot.sonos_sockets.unshift socket
    logClientStats "New client connected to Sonos relay!"

    # this is basically a destructor applied to each socket as it comes in
    socket.on 'disconnect', ->
      robot.sonos_sockets = robot.sonos_sockets.filter (aSocket) -> aSocket isnt socket
      logClientStats "Client disconnected from Sonos relay."

  # EXPOSE SONOS TO HUBOT
  robot.playOnSonos = (url, res) ->
    console.log "Checking Sockets: #{robot.sonos_sockets}"

    if robot.sonos_sockets.length < 1
      res.send "Sorry, I don't have any Sonos relay clients connected right now. You can download one here: #{RELAY_CLIENT_DOWNLOAD_URL}"
    else
      for socket in robot.sonos_sockets
        console.log 'sonosing a message...'
        socket.emit 'play_url', url: url

  # LISTEN FOR SONOS COMMANDS
  robot.respond /sonos (.+)/, (res) ->
    robot.playOnSonos res.match[1], res
