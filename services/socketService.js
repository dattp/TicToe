const _ = require('lodash')
const EVENT_MESS = require('../config/CONSTAND')
const GameController = require('../controllers/gameController')
const gameController = new GameController()
// const TableController = require('../controllers/tableController')
// const tableController = new TableController()
module.exports = (io) => {
    io.sockets.on('connection', (socket) => {

        console.log('=======>socket connection: ', socket.id);
        /**
         * lấy ra thông tin khi có player connect socket
         */
        let username = socket.handshake.query.username
        let page = socket.handshake.query.page || 0
        let roomId = socket.handshake.query.room_id || 0
        socket.username = username
        socket.page = page
        socket.roomId = parseInt(roomId, 10)
        // console.log('=====>username: ', username);
        // console.log('=====>socket.page: ', roomId);

        /**
         * khi player join bàn ở màn list table
         * check số lượng player trong bàn đó
         * nếu bàn đã có 2 người thì ko cho player join.
         * nếu bàn chưa đủ thì player join, đồng thời emit cho toàn bộ player khác biết.
         */
        socket.on(EVENT_MESS.PRE_JOIN, data => {
            gameController.preJoinTable(socket, data);
        })
        /**
         * player join table
         * lấy id của bàn
         */
        socket.on(EVENT_MESS.JOIN_TABLE, data => {
            gameController.joinTable(socket, data)
        })

        socket.on(EVENT_MESS.LEFT_ROOM, roomID => {
            gameController.leftRoom(socket, roomID)
        })

        //check disconnect
        socket.on(EVENT_MESS.DISCONNECT, (reason) => {
            console.log('=========>socket disconnect with reason: ', reason)
            gameController.disconnect(socket, reason)
        })

        /**
         * khi player đánh nước đi
         */
        socket.on(EVENT_MESS.CLICK_CELL, data => {
            console.log('======>click_cell: ', data);
            gameController.clickCell(socket, data)
        })
    })
}