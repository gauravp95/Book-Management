const reviewModel = require('../models/reviewModel')
const bookModel = require('../models/bookModel')
const mongoose = require("mongoose")

//------------------------------------------------------Validation---------------------------------------//
const isValid = function (value) {
  if (typeof value === 'undefined' || value === null) return false
  if (typeof value === 'string' && value.trim().length === 0) return false
  if (typeof value === 'number') return false
  return true;}

const isValidRequestBody = function (requestBody) {
  return Object.keys(requestBody).length > 0}

const isValidObjectId = function(objectId) {
  return mongoose.Types.ObjectId.isValid(objectId)}

//-----------------------------------------CreateReview----------------------------------------------------//

const createReview = async function (req, res) {
  try {
    let requestBody = req.body

    let checkBookId = await bookModel.findOne({ _id: req.params.bookId, isDeleted: false })
    if (!checkBookId){
      return res.status(404).send({ status: false, message: 'book does not exist' })}

    if (!isValidRequestBody(requestBody)){
      res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide correct review details' })
      return}

    if (!isValid(req.params.bookId)){
      res.status(400).send({ status: false, message: 'bookId is required' })
      return}

    if(!isValidObjectId(req.params.bookId)){
      res.status(400).send({status: false, message: `${req.params.bookId} is not a valid book id`})
      return}

    if (typeof requestBody.rating === 'undefined' || requestBody.rating === null ||  (typeof requestBody.rating === 'string' && requestBody.rating.trim().length === 0) ) {
      res.status(400).send({ status: false, message: ' rating required' })
      return}

    if ( !(requestBody.rating>=1 && requestBody.rating<=5 )){
      res.status(400).send({ status: false, message: ' Rate 1 to 5 Only' })
      return}

     let bookDetail = await bookModel.findOneAndUpdate({ _id: req.params.bookId }, { reviews: checkBookId.reviews + 1 }, { new: true })

    requestBody.reviewedAt = new Date()
    requestBody.bookId = req.params.bookId
    requestBody.reviewedBy = requestBody.reviewedBy?requestBody.reviewedBy:'Guest';

    let create = await reviewModel.create(requestBody);
    
    const data = {
     _id:create._id , 
     bookId: create.bookId, 
     reviewedBy: create.reviewedBy, 
     reviewedAt: create.reviewedAt, 
     rating: create.rating, 
     review: create.review}
    res.status(201).send({ status: true, message: 'review created sucessfully', data:{...bookDetail.toObject(),review:data} })

  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
}

//---------------------------------------Put Api Update Rewiew----------------------//
const updatereview = async function (req, res) {
  try {
   // let {bookId, reviewId} = req.params;
    let requestBody = req.body;
    
    if (!isValidRequestBody(requestBody)) {
      res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide  details to update' })
      return}
    let bookId = req.params.bookId;

    if(!isValidObjectId(bookId)) {      
      res.status(400).send({status: false, message: `${bookId} is not a valid book id`})
      return}
      let reviewId = req.params.reviewId;

      if(!isValidObjectId(reviewId)) {      
        res.status(400).send({status: false, message: `${reviewId} is not a valid review id`})
        return}
  


    let reviewIdCheck = await reviewModel.findOne({ _id: reviewId, isDeleted: false })

    if(!reviewIdCheck){    
      return res.status(404).send({status:false,message:'book not found'}) }

    // if(!(req.validToken._id == bookIdCheck.userId)){
    //   return res.status(400).send({status:false,message:'unauthorized access'})}

    if (!reviewIdCheck) {
      return res.status(404).send({ status: false, msg: 'not valid book input correct book id' }) }

    let uniqueCheck = await reviewModel.find({$or: [{  reviewedBy: requestBody.reviewedBy},{  rating: requestBody.rating }, { review: requestBody. review},{  reviewId: requestBody.reviewId}]} )
   // let uniqueCheck=await bookModel.find({$or:[review : requestBody.review, ]})
    //if (uniqueCheck.length > 0) {  
      //return res.status(400).send({ status: false, msg: 'Either title or isbn number is not unique' })}

    let updateObject ={}
   // if (isValid(requestBody.review)) {
     // updateObject.review = requestBody.review}
   

    if (isValid(requestBody.reviewedBy)) {
      updateObject.reviewedBy = requestBody.reviewedBy}
   
    if (isValid(requestBody. rating)) {
      updateObject.rating = requestBody. rating}

    if (isValid(requestBody. review)) {
      updateObject.review = requestBody. review}

   
      
   // if (isValid(requestBody.releasedAt)) {
     // updateObject.releasedAt = requestBody.releasedAt}

    if (isValid(requestBody.reviewId)) {
      updateObject.reviewId = requestBody.reviewId}
    
    let update = await reviewModel.findOneAndUpdate({ _id: reviewId },updateObject , { new: true })

    res.status(200).send({ status: true, message: 'sucessfully updated', data: update })

  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
    }
}
//---------------------------------Delete Review Api--------------------------------------------------------------//

const deleteReview = async function (req,res) {
  try {
      let {bookId, reviewId} = req.params;
      
      if (!isValidObjectId(bookId)) {
          res.status(400).send({status: false, message: 'BookId is not a valid ObjectId'})
      }
      if (!isValidObjectId(bookId)) {
          res.status(400).send({status: false, message: 'ReviewId is not a valid ObjectId'})
      }

      let checkReview = await reviewModel.findById({_id:reviewId});
      if(!checkReview) {
          res.status(404).send({status: false, message: 'Review Not Found with this reviewId'})
      };
      let checkBook = await bookModel.findById({_id:bookId});
      if(!checkBook) {
          res.status(404).send({status: false, message: 'Book Not found with this BookId'})
      }
      if(checkBook.isDeleted == false) {
          if(checkReview.isDeleted == false) {
              let deleteReview = await reviewModel.findOneAndUpdate({_id:reviewId, isDeleted: false},{ isDeleted: true, deletedAt: new Date() }, { new: true });

              if(deleteReview) {
                  await bookModel.findOneAndUpdate({_id:bookId}, {$inc:{reviews:-1}})
              }
              res.status(200).send({status: true, message: 'Review Deleted Succesfully', data: deleteReview});
          } else {
              res.status(400).send({status: false, message: 'Review Is Already Deleted'})
          }
      } else {
          res.status(400).send({status: false, message: 'Book Is Already Deleted'})
      }
  } catch (error) {
      res.status(500).send({status: false, message: error.message})
  }

}

module.exports = {createReview ,updatereview , deleteReview};
