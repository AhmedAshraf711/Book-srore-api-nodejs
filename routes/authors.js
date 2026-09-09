
const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
// GET all authors
router.get('/', asyncHandler( async (req, res) => {

    const authors = await Author.find();
    res.json(authors);
        }));

// GET one author
router.get('/:id',asyncHandler( async (req, res) => {

    const author = await Author.findById(req.params.id);
    if (!author) 
        {
         return res.status(404).json({message: 'Author not found'});
        }

        res.status(200).json(author);
    }));

// POST new author
router.post('/', asyncHandler(async (req, res) => {

    const author = new Author({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        nationality: req.body.nationality
    });

     const newAuthor = await author.save();
     res.status(201).json(newAuthor);
    }
    ));
router.put('/:id',asyncHandler( async (req, res) => {

        const author = await Author.findByIdAndUpdate
        (req.params.id,
            { $set:
             {firstName: req.body.firstName, 
                lastName: req.body.lastName, 
                nationality: req.body.nationality}, },
             { new: true});   

            const updatedAuthor = await author.save();
            res.status(200).json(updatedAuthor);
    
    }));
router.delete('/:id',asyncHandler( async (req, res) => {

        const author = await Author.findById(req.params.id);
        if (!author) {
            return res.status(404).json({ message: 'Author not found' });
        }   
        await Author.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Author deleted' });
   
}));
module.exports = router;