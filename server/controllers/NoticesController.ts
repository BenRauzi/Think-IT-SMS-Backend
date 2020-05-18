import * as express from 'express';
import * as sql from 'mssql';
import { AuthService } from '../services';
import * as uuid from 'uuid';
import { debug } from 'util';

export class NoticesController {
    public router = express.Router();
    private auth: AuthService;
    constructor() {
        console.log("InitializedRoutes '/notices'")
        this.intializeRoutes();
        this.auth = new AuthService();
    }

    public intializeRoutes() {
        this.router.post('/notices', this.addNotice);
        this.router.get('/notices', this.getNotices);
        this.router.post('/playerjoined', this.playerJoined);
        console.log("InitializedRoutes '/notices'")
    }

    playerJoined =async (req, res) =>{
        const request = new sql.Request();
        console.log("player has joined a team!")
        const RiotID = req.body.RiotID;
        const PlayersNeeded = req.body.PlayersNeeded;
        const Activity = req.body.Activity;
        const Language = req.body.Language;
        const NeedMic = req.body.NeedMic;
        const enddate = req.body.enddate;
        const PNeeded = Number(req.body.PlayersNeeded) -1 ;
        const PlayersNeededs = String(PNeeded);
        request.query(`DELETE FROM lfgrequests WHERE CONVERT (VARCHAR, RiotID)='${RiotID}'`, (err, result) =>{
            if (err) { console.log(err); }
            if(PNeeded !== 0 ){
                console.log("Minusing 1")
                request.query(`insert into lfgrequests(RiotID, PlayersNeeded, Activity, Language, NeedMic, enddate) values('${RiotID}','${PlayersNeededs}','${Activity}','${Language}','${NeedMic}', '${enddate}')`, (err, result) => {
                if (err) { console.log(err); }
                });
            }
            else{
                console.log("team Full");
            }
            if (enddate !== undefined) {
                setTimeout(() => {
                    new sql.Request().query(`DELETE FROM lfgrequests WHERE enddate='${enddate}'`, (err2, result2) => {
                        if(err2) { console.log(err2); }

                    });
                }, (new Date(enddate).getTime() - new Date().getTime()));
            }

            res.json({msg: 'Notice Created'});
        });
    }

    Minus1 = async (req, res) => {
        console.log("recieved Minus1 request");
        const request = new sql.Request();
        const RiotID = req.body.RiotID;
        const PNeeded = Number(req.body.PlayersNeeded) -1 ;
        const Activity = req.body.Activity;
        const Language = req.body.Language;
        const NeedMic = req.body.NeedMic;
        const PlayersNeeded = String(PNeeded);
        if(PNeeded != 0 ){
// tslint:disable-next-line: max-line-length
            request.query(`insert into lfgrequests(RiotID, PlayersNeeded, Activity, Language, NeedMic) values('${RiotID}','${PlayersNeeded}','${Activity}','${Language}','${NeedMic}')`, (err, result) => {
            if (err) { console.log(err); }

            res.json({msg: 'Notice Created'});
            });
        }
        else{
            console.log("team Full");
        }
    }

    addNotice = async (req, res) => {
        console.log("recieved Addnotice request");
        const request = new sql.Request();
        const RiotID = req.body.RiotID;
        const PlayersNeeded = req.body.PlayersNeeded;
        const Activity = req.body.Activity;
        const Language = req.body.Language;
        const NeedMic = req.body.NeedMic;
        // tslint:disable-next-line: max-line-length
        request.query(`insert into lfgrequests(RiotID, PlayersNeeded, Activity, Language, NeedMic) values('${RiotID}','${PlayersNeeded}','${Activity}','${Language}','${NeedMic}')`, (err, result) => {
            if (err) { console.log(err); }

            res.json({msg: 'Notice Created'});
        });
    }
    

    getNotices = async (req, res) => {
        console.log("recieved Getnotice request");
        const request = new sql.Request();
        request.query(`select * from lfgrequests`, (err, result) => {
            if (err) { console.log(err); }
            res.send(result.recordset);
        });
    }

}
