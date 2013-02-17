
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'File upload' });
};
exports.uploaded = function(req, res){
    res.render('uploaded', { title: 'File upload' });
}