Photos = {
    getAll: function(o, cb) {
        Photos.using('db').model('rivages', 'select filename,tkid,concat("/thumbs/",UUID(),"/",tkid,"/",filename) url from import_photos where tkid="' + o.tkid + '"', cb);
    }
}

module.exports = Photos;