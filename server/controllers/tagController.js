const Tag = require('../models/tagModel');


exports.createTag = (req, res) => {
    const tag = new Tag(req.body);
    tag.save((err, data) => {
        if(err) {
            return res.status(400).json({
                error: 'Something went wrong.'
            })
        }
        return res.json({data});
    })
};