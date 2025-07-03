const myLibrary = [];

const container = document.querySelector(".books-container");
const newBookButton = document.querySelector(".button-new-book");
const submitButton = document.querySelector(".button-submit");
const cancelButton = document.querySelector(".button-cancel");
const addBookModal = document.querySelector(".add-book-modal");
const form = document.querySelector(".book-form");

class Book {
    constructor(id, title, author, pages, read) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    }
    toggleRead() {
        this.read = !this.read;
    }
}

function addBookToLibrary(title, author, pages, read) {
    const newBook = new Book(crypto.randomUUID(), title, author, pages, read);
    myLibrary.push(newBook);
    return newBook;
}

function renderBook(book) {

    const bookItem = document.createElement("div");
    const bookDetails = document.createElement("div");
    const bookActions = document.createElement("div");
    const bookTitle = document.createElement("p");
    const bookAuthor = document.createElement("p");
    const bookPages = document.createElement("p");
    const btnRead = document.createElement("button");
    const btnDel = document.createElement("button");

    bookItem.className = "book";
    bookDetails.className = "book-details";
    bookActions.className = "book-actions";
    bookTitle.className = "book-title";
    bookAuthor.className = "book-author";
    bookPages.className = "book-pages";
    btnRead.className = "button-read";
    btnDel.className = "button-delete";

    bookItem.setAttribute("data-id", book.id);
    bookTitle.textContent = book.title;
    bookAuthor.textContent = book.author;
    bookPages.textContent = `${book.pages} pages`;
    btnRead.textContent = book.read ? "Mark as unread" : "Mark as read";
    btnDel.textContent = "Remove";

    btnRead.style.backgroundColor = book.read ? "green" : "orange";

    bookDetails.append(bookTitle, bookAuthor, bookPages);
    bookActions.append(btnRead, btnDel);
    bookItem.append(bookDetails, bookActions);
    container.appendChild(bookItem);

    btnRead.addEventListener('click', () => {
        book.toggleRead();
        btnRead.textContent = book.read ? "Mark as unread" : "Mark as read";
        btnRead.style.backgroundColor = book.read ? "green" : "orange";
    })

    btnDel.addEventListener('click', () => {
        deleteBook(book)
    });
}

function deleteBook(book) {
    const bookToDel = document.querySelector(`[data-id="${book.id}"]`);
    if (bookToDel) bookToDel.remove();

    const index = myLibrary.findIndex(libBook => libBook.id === book.id);
    if (index !== -1) {
        myLibrary.splice(index, 1);
    }
}

function closeResetModal() {
    form.reset();
    addBookModal.close();
}

newBookButton.addEventListener('click', () => {
    addBookModal.showModal();
});

submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    const formData = {};

    form.querySelectorAll("input").forEach(element => {
        if (element.type === "checkbox") {
            formData[element.name] = element.checked;
        } else {
            formData[element.name] = element.value;
        }
    });    

    const addedBook = addBookToLibrary(formData.title, formData.author, formData.pages, formData.read);

    renderBook(addedBook);

    closeResetModal();
});

cancelButton.addEventListener('click', () => {
    closeResetModal();
});