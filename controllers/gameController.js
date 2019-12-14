const _ = require('lodash')
const EVENT_MESS = require('../config/CONSTAND')
const TableController = require('../controllers/tableController')
const tableController = new TableController()

class GameController {
    constructor() {
        //TODO:
    }

    /**
     * 
     * @param {*} matrix các nước đi của cả 2 user
     * @param {*} curRow toạ độ hàng
     * @param {*} curCol toạ độ cột
     * @param {*} value giá trị x hoặc o của user
     */

    /**
     * check theo hàng ngang
     * từ toạ độ của nước đi, check theo chiều ngang bên phải
     * nếu tìm thấy giá trị trong mảng = giá trị của player thì tăng lên 1
     * tương tự sẽ là dịch trái
     * return true nếu tổng = 5
     */
    checkHorizontal(matrix, curRow, curCol, value) {
        let countResult = 0
        //dich phai
        for (let i = curCol; i < matrix.length; i++) {
            if (matrix[curRow][i] === value) {
                countResult++;
            } else {
                break
            }
        }
        // dich trai
        for (let j = curCol - 1; j >= 0; j--) {
            if (matrix[curRow][j] === value) {
                // console.log('======>matrix[curRow][j]: ', matrix[curRow][j]);                
                countResult++;
            } else {
                break
            }
        }
        return countResult >= 5
    }

    /**
     * check theo chiều dọc, tương tự như check theo chiều ngang
     */
    checkVertically(matrix, curRow, curCol, value) {
        let countResult = 0
        for (let i = curRow; i < matrix.length; i++) {
            if (matrix[i][curCol] === value) {
                countResult++;
            } else {
                break
            }
        }
        for (let j = curRow - 1; j >= 0; j--) {
            if (matrix[j][curCol] === value) {
                countResult++
            } else {
                break
            }
        }

        return countResult >= 5
    }

    /**
     * check đường chéo chính.
     * từ toạ độ của nước đi, kiểm tra đường chéo phía trên và phía dưới.
     */
    checkMainDiagonal(matrix, curRow, curCol, value) {
        let countResult = 0
        let colTemp = 0
        // console.log(matrix)
        /**
         * check đường chéo đi lên
         */
        for (let i = curCol; i < matrix.length; i++) {
            if (colTemp > curRow) break
            if (matrix[curRow - colTemp][i] === value) {
                countResult++
                colTemp++
            } else {
                break
            }
        }
        // console.log('=======>countResult1: ', countResult);
        /**
         * check đường chéo đi xuống.
         * colTemp = 1 để ko tính nước đi của player do đã tính trong đường chéo đi lên.
         */
        colTemp = 1
        for (let j = curCol - 1; j >= 0; j--) {
            if (matrix[curRow + colTemp][j] === value) {
                countResult++
                colTemp++
            } else {
                break
            }
        }
        return countResult >= 5
    }

    /**
     * check đường chéo phụ
     * tương tự như check đường chéo chính
     */
    checkSubDiagonal(matrix, curRow, curCol, value) {
        let countResult = 0;
        let colTemp = 0

        for (let i = curRow; i < matrix.length; i++) {
            if (matrix[i][curCol + colTemp] === value) {
                countResult++
                colTemp++
            } else {
                break
            }
        }

        colTemp = 1
        for (let j = curRow - 1; j >= 0; j--) {
            if (colTemp > curCol) break
            if (matrix[j][curCol - colTemp] === value) {
                countResult++
                colTemp++
            } else {
                break
            }
        }
        return countResult >= 5
    }


    /**
     * xử lý socket
     */

    preJoinTable(socket, data) {
        try {
            let table = tableController.getTableById(data);
            let players = table.players
            let checkJoin = players.length < 2
            let listTable = tableController.getListTable()
            let listPlayer = _.flattenDeep(_.map(listTable, 'players'))
            let checkExistedInRoom = _.includes(listPlayer, socket.username)
            socket.emit(EVENT_MESS.SUBMIT_JOIN, checkJoin, checkExistedInRoom)
            if (checkJoin) {
                let message = `${players.length + 1} / 2`
                socket.broadcast.emit(EVENT_MESS.COUNT_PLAYER, { message: message, tableId: data })
            }
        } catch (error) {
            console.log(error);

        }

    }

    /**
     * khi player join bbàn chơi
     * lấy ra Id của bàn
     * 
     */
    joinTable(socket, data) {
        try {
            let roomID = data.room_id
            // check so luong nguoi choi trong rooms
            socket.join(`room:${roomID}`)
            tableController.addPlayer(roomID, socket.username)
            let table = tableController.getTableById(roomID)
            let players = table.players
            let message
            table.status++
            console.log('======>status1: ', table.status);

            if (players.length === 2) {
                message = `${players[0]} vs ${players[1]}`
                socket.to(`room:${roomID}`).emit(EVENT_MESS.OPPONENT, message)

                /**
                 * khởi tạo mảng đánh dấu các nước đi
                 * 15 hàng và cột, các giá trị ban đầu khởi tạo = -1
                 */
                Array.matrix = (n, init) => {
                    let mat = [];
                    for (let i = 0; i < n; i++) {
                        let a = [];
                        for (let j = 0; j < n; j++) {
                            a[j] = init;
                        }
                        mat[i] = a;
                    }
                    return mat;
                }
                table.matrix = Array.matrix(15, -1)
            } else {
                message = `${players[0]} vs ...`
            }

            socket.emit(EVENT_MESS.OPPONENT, message)


        } catch (error) {
            console.log(error);

        }
    }

    leftRoom(socket, roomID) {
        try {
            tableController.removePlayer(roomID, socket.username)
            let table = tableController.getTableById(roomID)
            let players = table.players
            let message = `${players.length} / 2`
            //  check winner
            socket.broadcast.emit(EVENT_MESS.COUNT_PLAYER, { message: message, tableId: roomID })
        } catch (error) {
            console.log(error);
            // TODO: emit left fail
        }

    }

    /**
     * xu ly khi player disconnect trong khi chơi (page = 2 tức là đang trong bàn chơi)
     */
    disconnect(socket, reason) {
        let page = socket.page
        let username = socket.username
        let roomID = socket.roomId
        if (page == 2) {
            tableController.removePlayer(roomID, username)
            let table = tableController.getTableById(roomID)
            let players = _.get(table, 'players', [])
            let message = `${players.length} / 2`
            //  check winner
            let backToList = true
            socket.emit(EVENT_MESS.SUBMIT_JOIN, true, true, backToList)
            socket.broadcast.emit(EVENT_MESS.COUNT_PLAYER, { message: message, tableId: roomID })


            if (reason === 'transport close' && table.status >= 2) {
                // thoat room, xu thang 
                console.log('======>diessss');
                socket.to(`room:${roomID}`).emit(EVENT_MESS.WINNER, EVENT_MESS.MESS_WIN)
                table.status = 0
                socket.emit(EVENT_MESS.YOUDISCONNECT, EVENT_MESS.MESS_DISCONNECT)
            }
        }
    }

    /**
     * khi player click vào ô trên bàn cờ
     * lấy ra toạ độ x, y của nước đi.
     * check xem có đủ điều kiện để đánh ko.
     * trạng thái bàn đã ready. mảng nước đi  = -1 (chưa có ai đánh ô đó)
     * có phải turn của player đó ko?
     */
    clickCell(socket, data) {
        try {
            let curCol = data.y / 40
            let curRow = data.x / 40
            let roomID = socket.roomId
            console.log('=====>socket.roomId: ', socket.roomId);

            let table = tableController.getTableById(socket.roomId)
            console.log('=======>status2: ', table.status);

            let players = table.players
            if (players.length === 2 && table.status >= 2) {
                let possitionPlayer = _.indexOf(players, socket.username)
                let possitionOpponent = possitionPlayer === 0 ? 1 : 0
                // check first turn
                if (table.next_turn === null ||
                    table.next_turn === socket.username) {
                    if (table.matrix[curCol][curRow] === -1) {
                        socket.emit(EVENT_MESS.SERVER_SEND_DATA, {
                            name: socket.usename,
                            x: data.x,
                            y: data.y,
                            nguoichoi: possitionPlayer
                        })
                        socket.to(`room:${roomID}`).emit(EVENT_MESS.SERVER_SEND_DATA, {
                            name: socket.usename,
                            x: data.x,
                            y: data.y,
                            nguoichoi: possitionPlayer
                        })
                        socket.to(`room:${roomID}`).emit(EVENT_MESS.YOUT_TURN, true)
                        socket.emit(EVENT_MESS.YOUT_TURN, false)
                        table.next_turn = players[possitionOpponent]
                        // check win
                        console.log('=======>possitionPlayer: ', possitionPlayer);
                        table.matrix[curCol][curRow] = possitionPlayer
                        if (this.checkHorizontal(table.matrix, curCol, curRow, possitionPlayer)
                            || this.checkVertically(table.matrix, curCol, curRow, possitionPlayer)
                            || this.checkMainDiagonal(table.matrix, curCol, curRow, possitionPlayer)
                            || this.checkSubDiagonal(table.matrix, curCol, curRow, possitionPlayer)) {
                            socket.emit(EVENT_MESS.WINNER, EVENT_MESS.MESS_WIN)
                            socket.to(`room:${roomID}`).emit(EVENT_MESS.WINNER, EVENT_MESS.MESS_LOST)
                            table.status = 0
                        }
                    }
                } else {
                    socket.emit(EVENT_MESS.YOUT_TURN, false)
                }

            } else {
                socket.emit(EVENT_MESS.WAIT_PLAYER, EVENT_MESS.MESS_WAIT)
            }
        } catch (error) {
            console.log(error);
            // TODO
        }
    }

}

module.exports = GameController