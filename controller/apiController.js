
var getMember = (req,res) => {
    for(let i = 0; i< database.members.length;i++){
        if(req.params.firstname === database.members[i].firstName){
            res.send(database.members[i]);
            break;
        }
    }
}



module.exports.getMember = getMember;