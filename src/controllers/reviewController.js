const reviewModel = require('../models/reviewModel')
const bookModel = require('../models/bookModel')


const deleteReview = async function (req,res) {
    try {
        let {bookId, reviewId} = req.params;
        let checkReview = await reviewModel.findById({reviewId});
        if(!checkReview) {
            res.status(404).send({status: false, message: 'Review Not Found with this reviewId'})
        };
        let checkBook = await reviewModel.findById({bookId});
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


module.exports = {deleteReview};
