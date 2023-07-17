import moment from "moment"
export default {
    ifequal(a, b, options) {
        if (a == b) {
            return options.fn(this)
        }
        return options.inverse(this)
    },


    getFullNameFirstCharacter(firstName, lastName) {
        return firstName.charAt(0) + lastName.charAt(0)
    },

    formatDate(date) {
        return moment(date).format("DD MMM, YYYY")
    },
    truncateText(text, start, end) {
        return text.slice(start, end)
    },
    nextPage(currentPage, totalPages) {
        if (currentPage != totalPages) {
            return parseInt(currentPage) + 1
        }
        return 1
    },
    prevPage(currentPage, totalPages) {
        if (currentPage != 0) {

            return parseInt(currentPage) - 1
        }
        currentPage = totalPages
        return currentPage

    },





}