var express = require('express');
var router = express.Router();
const TableController = require('../controllers/tableController')
const tableController = new TableController()
/* GET users listing. */
// let arrTable = [
//     {
//         id: 01,
//         name: 'Table 01',
//         players: ['datpt']
//     },
//     {
//         id: 02,
//         name: 'Table 02',
//         players: ['user01', 'user02']
//     },
//     {
//         id: 03,
//         name: 'Table 03',
//         players: []
//     },
//     {
//         id: 04,
//         name: 'Table 04',
//         players: []
//     },
//     {
//         id: 05,
//         name: 'Table 05',
//         players: []
//     }
// ]
router.get('/getlist', async function(req, res, next) {
    try {
        let resutl = await tableController.getListTable()
        res.render('board_game', {username: req.session.passport.user.username, list_table: resutl})
    } catch (error) {
        res.redirect('/error')
    }
 
});

router.post('/addtable', async function (req, res, next) {
    let name = req.body.name
    let description = req.body.description
    let username = req.session.passport.user.username
    console.log('======>description: ', description);
    
    try {
        let result = await tableController.createTable(username, name, description)
        console.log('=====>result insert: ', result);
        res.send('success')
    } catch (error) {
        console.log(error);
        res.status(500).send(null);
    }

    // arrToto = await svTodo.getList()

});

router.get('/gameplay/:room_id', function(req, res, next) {
    console.log('=====>romm: ', req.params.room_id);
    let roomId = req.params.room_id
    let table = tableController.getTableById(roomId)
    let players = table.players
    res.render('game_play', { username: req.session.passport.user.username, room_id: roomId});
  });

module.exports = router;
