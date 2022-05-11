const bookModel = require("../models/bookModel.js");
const reviewModel = require("../models/reviewModel")
const jwt = require("jsonwebtoken");
const  mongoose = require("mongoose");
const moment = require('moment')

//---------------------------------------Validadtor------------------------------------------
const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value != "string" || value.trim().length == 0) return false;
    return true;
};
  
const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
};
  
const isValidObjectId = function (objectId) {
   return mongoose.Types.ObjectId.isValid(objectId);
};
  
//-------------------------------------------POST API {Create books}--------------------------------------------//

const createBook = async function (req, res) {
    try {
      let requestBody = req.body;
      let { title, excerpt, userId, ISBN, category, subcategory,reviews, isDeleted, deletedAt, releasedAt } = requestBody;
  
      if (!isValidRequestBody(requestBody)) {
        res.status(400).send({ status: false, msg: "Please provide details of the User" });
      }
      if (!isValid(title)) {
        res.status(400).send({status: false, msg: 'Enter appropriate title of the Book'});
      }
      if (!isValid(excerpt)) {
        res.status(400).send({ status: false, msg: "Enter appropriate Body of the book " });
      }
      if (!isValid(ISBN)) {
        res.status(400).send({ status: false, msg: "Enter appropriate ISBN." });
      }
      if (!isValid(category)) {
        res.status(400).send({ status: false, msg: "Enter appropriate category" });
      }
      if (!isValid(subcategory)) {
        res.status(400).send({ status: false, msg: "Enter appropriate password" });
      }
      if (ISBN.length != 10) {
        res.status(400).send({ status: false, msg: "Enter 10 digit ISBN no. of Book" });
      }
      if (isDeleted === true) {
        deletedAt = Date.now()
      }
      releasedAt = moment().format("YYYY-MM-DD")
      const bookData = {  title, excerpt, userId, ISBN, category, subcategory,reviews, isDeleted, deletedAt, releasedAt };
      const newBook = await bookModel.create(bookData);
      return res.status(201).send({ status: true, message: 'Success', data: newBook });
    } catch (error) {
      return res.status(500).send({ status: false, msg: error.message });
    }
};

//---------------------------------------------GET API {get books by query parameters}------------------------------------------------------//

const getBooks = async function (req, res){
    try {  
      let checkObject ={ isDeleted:false }
  
      if (isValid(req.query.userId)){checkObject.userId =req.query.userId}
  
      if(req.query.userId){
      if(!isValidObjectId(req.query.userId)){     
        res.status(400).send({status: false, message: `${req.query.userId}It is not a valid user id`})
        return}}
  
      if (isValid(req.query.category)){checkObject.category =req.query.category}
  
      if (isValid(req.query.subcategory)){checkObject.subcategory =req.query.subcategory}     
     
      let search = await bookModel.find(checkObject).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 ,subcategory:1}).sort({title:1});
  
  
      if (search.length == 0){
         return res.status(404).send({ status: false, message:"No such book exist" }) }
       
      res.status(200).send({ status: true, message:"Book list", data:search})   
    
    } catch (error) {  
      res.status(500).send({ status: false, error: error.message });
    }
}

//------------------------------------------GET API {get books by bookId}----------------------------------------//

const getBooksBYId = async function (req, res) {
    try {  
      let bookId = req.params.bookId;
  
      if(!isValidObjectId(bookId)){       
        res.status(400).send({status: false, message: `${bookId} is not a valid book id`})
        return}
  
      const bookDetail = await bookModel.findOne({ _id: bookId, isDeleted: false });
      if(!bookDetail){
        return res.status(404).send({status:false, message:"book not found"})}
  
      const reviewsData = await reviewModel.find({ bookId: bookId, isDeleted: false }).select({ _id: 1, bookId: 1, reviewedBy: 1, rating:1, review: 1, releasedAt: 1 });;      
    
      res.status(200).send({ status: true, data: {...bookDetail.toObject(),reviewsData}});
  
    } catch (error){  
      res.status(500).send({ status: false, error: error.message });      
    }
  }

//------------------------------------------------PUT API {update books details}------------------------------------------------------------------//

const updateBook = async function (req, res) {
  try {
    let requestBody = req.body;
    
    if (!isValidRequestBody(requestBody)) {
      res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide  details to update' })
      return}
    let bookId = req.params.bookId;

    if(!isValidObjectId(bookId)) {      
      res.status(400).send({status: false, message: `${bookId} is not a valid book id`})
      return}

    let bookIdCheck = await bookModel.findOne({ _id: bookId, isDeleted: false })

    if(!bookIdCheck){    
      return res.status(404).send({status:false,message:'book not found'}) }

   if(!(req.user == bookIdCheck.userId)){  //Athorization
   return res.status(400).send({status:false,message:'unauthorized access'})}

    if (!bookIdCheck) {
      return res.status(404).send({ status: false, msg: 'not valid book, input correct book id' }) }

    let uniqueCheck = await bookModel.find({$or: [{ title: requestBody.title }, { ISBN: requestBody.ISBN }]} )
    
    if (uniqueCheck.length > 0) {  
      return res.status(400).send({ status: false, msg: 'Either title or isbn number is unique' })}

    let updateObject ={}

    if (isValid(requestBody.title)) {
      updateObject.title = requestBody.title}

    if (isValid(requestBody.excerpt)) {
      updateObject.excerpt = requestBody.excerpt}
      
    if (isValid(requestBody.releasedAt)) {
      updateObject.releasedAt = requestBody.releasedAt}

    if (isValid(requestBody.ISBN)) {
      updateObject.ISBN = requestBody.ISBN}
    
    let update = await bookModel.findOneAndUpdate({ _id: bookId },updateObject , { new: true })

    res.status(200).send({ status: true, message: 'sucessfully updated', data: update })

  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
}

//--------------------------------------DELETE API {delte books by bookId}-------------------------------//

const deleteBook = async function (req, res) {
    try {
        let bookId = req.params.bookId
        let findData = await bookModel.findById(bookId)
  
        if (!findData)
            return res.status(404).send({ status: false, message: "no such book exists" })
        if (findData.isDeleted == true)
            return res.status(400).send({ status: false, msg: "Book is already deleted" })
        let deletedata = await bookModel.findOneAndUpdate({ _id: bookId }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true});
        if(deletedata) {
          res.status(200).send({ status: true, msg: "Successfully Deleted" })
        }
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
};

module.exports = { createBook,getBooks, getBooksBYId, updateBook, deleteBook };