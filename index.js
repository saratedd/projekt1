const modal = document.querySelector(".dialog-add")
const updateModal = document.querySelector(".dialog-update")
const submitButton = document.querySelector("dialog > .submit-comment")
// const closeButton = document.querySelector("dialog > .close-comment")
// const addCommentButton = document.querySelectorAll(".comment-add-button")
const addCommentButton = document.getElementById("comment-add-button")
const updateCommentButton = document.querySelector(".comment-update-button")


addCommentButton.addEventListener('click', () => {
    modal.showModal()
})

// closeButton.addEventListener('click', () => {
//     modal.close()
// })

submitButton.addEventListener('click', () => {
    modal.close()
})

updateCommentButton.addEventListener('click', () => {
    updateModal.showModal()
})