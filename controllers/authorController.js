const asyncHandler = require("express-async-handler");
const Author = require("../models/Author");
/**
 * @desc Get All Authors
 * @route /api/authors
 * @method Get
 * @access public 
 */
const getAllAuthors =  asyncHandler( async (req, res) => {

    const authors = await Author.find();
    res.json(authors);
        });


/**
 * @desc Get one Author
 * @route /api/authors
 * @method Get
 * @access public 
 */
const getOneAuthor = asyncHandler( async (req, res) => {

    const author = await Author.findById(req.params.id);
    if (!author) 
        {
         return res.status(404).json({message: 'Author not found'});
        }

        res.status(200).json(author);
    });

/**
 * @desc create Author
 * @route /api/authors
 * @method post
 * @access priivate 
 */
const createAuthor = asyncHandler(async (req, res) => {

    const author = new Author({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        nationality: req.body.nationality
    });

     const newAuthor = await author.save();
     res.status(201).json(newAuthor);
    }
    );


/**
 * @desc update Author
 * @route /api/authors
 * @method put
 * @access priivate 
 */
const updateAuthor = asyncHandler( async (req, res) => {

        const author = await Author.findByIdAndUpdate
        (req.params.id,
            { $set:
             {firstName: req.body.firstName, 
                lastName: req.body.lastName, 
                nationality: req.body.nationality}, },
             { new: true});   

            const updatedAuthor = await author.save();
            res.status(200).json(updatedAuthor);
    
    });

/**
 * @desc update Author
 * @route /api/authors
 * @method put
 * @access priivate 
 */
const deleteAuthor = asyncHandler( async (req, res) => {

        const author = await Author.findById(req.params.id);
        if (!author) {
            return res.status(404).json({ message: 'Author not found' });
        }   
        await Author.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Author deleted' });
   
});

module.exports = {
 getAllAuthors,
 getOneAuthor,
 createAuthor,
 updateAuthor,
 deleteAuthor
};