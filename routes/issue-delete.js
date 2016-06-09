
var connection =
    require('./dbConnection.js').dbConnect();

module.exports =
    function deleteIssue(req , res){
        var id = req.params.id;

        connection.query("DELETE FROM Issues WHERE Id=?",
            [id],
            function(err) {
                if (err)
                    console.log("Error inserting : %s ",err );
                res.redirect('/issue-log');
            });
    };