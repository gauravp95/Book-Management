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

module.exports = {createReview};
