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

class Library {
    constructor(containerSelector) {
        this.books = [];
        this.container = document.querySelector(containerSelector);
    }
    
    addBook(title, author, pages, read) {
        const book = new Book(crypto.randomUUID(), title, author, pages, read);
        this.books.push(book);
        this.renderBook(book);
        return book;
    }
    
    removeBook(book) {
        this.books = this.books.filter(b => b.id !== book.id);
        const bookElem = this.container.querySelector(`[data-id="${book.id}"]`);
        if (bookElem) bookElem.remove();
    }
    
    toggleBookRead(book) {
        book.toggleRead();
        this.updateBook(book);
    }
    
    updateBook(book) {
        const bookElem = this.container.querySelector(`[data-id="${book.id}"]`);
        if (bookElem) {
            const newElem = this.createBookElement(book);
            this.container.replaceChild(newElem, bookElem);
        }
    }
    
    renderBook(book) {
        const bookElem = this.createBookElement(book);
        this.container.appendChild(bookElem);
    }
    
    renderAll() {
        this.container.innerHTML = "";
        this.books.forEach(book => this.renderBook(book));
    }
    
    createBookElement(book) {
        const bookItem = document.createElement("div");
        bookItem.className = "book";
        bookItem.setAttribute("data-id", book.id);

        if (book.read) {
            const badge = document.createElement("div");
            badge.className = "book-badge";
            badge.textContent = "READ";
            bookItem.appendChild(badge);
        }
        
        const bookDetails = document.createElement("div");
        bookDetails.className = "book-details";
        
        const bookTitle = document.createElement("p");
        bookTitle.className = "book-title";
        bookTitle.textContent = book.title;
        
        const bookAuthor = document.createElement("p");
        bookAuthor.className = "book-author";
        bookAuthor.textContent = book.author;
        
        const bookPages = document.createElement("p");
        bookPages.className = "book-pages";
        bookPages.textContent = `${book.pages} pages`;
        
        bookDetails.append(bookTitle, bookAuthor, bookPages);
        
        const bookActions = document.createElement("div");
        bookActions.className = "book-actions";
        
        const btnRead = document.createElement("button");
        btnRead.className = "button-read";
        btnRead.textContent = book.read ? "Mark unread" : "Mark as read";
        btnRead.addEventListener('click', () => {
            this.toggleBookRead(book);
        });
        
        const btnDel = document.createElement("button");
        btnDel.className = "button-delete";
        btnDel.textContent = "Remove";
        btnDel.addEventListener('click', () => {
            this.removeBook(book)
        });
        
        bookActions.append(btnRead, btnDel);
        bookItem.append(bookDetails, bookActions);
        
        return bookItem;
    }
}

const library = new Library(".books-container");

library.addBook("Bury your Bones on the Midnight Soil", "V. E Schwab", 400, false);
library.addBook("Sounds Like Love", "Ashley Preston", 650, true);
library.addBook("King of Ashes", "S. A. Cosby", 354, true);
library.addBook("The River is Waiting", "Wally Lamb", 989, false);
library.addBook("The Poppy Fields", "Nikki Erlick", 675, true);
library.addBook("We don't talk about Carol", "Kristen L. Berry", 437, false);
library.addBook("Welcome to murder week", "Karen Dukess", 983, true);
library.addBook("What kind of paradise", "Janelle Brown", 748, true);

const newBookButton = document.querySelector(".button-new-book");
const cancelButton = document.querySelector(".button-cancel");
const addBookModal = document.querySelector(".add-book-modal");
const form = document.querySelector(".book-form");

newBookButton.addEventListener('click', () => {
    addBookModal.showModal();
});

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {};

    form.querySelectorAll("input").forEach(element => {
        if (element.type === "checkbox") {
            formData[element.name] = element.checked;
        } else {
            formData[element.name] = element.value;
        }
    });

    library.addBook(formData.title, formData.author, Number(formData.pages), formData.read);
    form.reset();
    addBookModal.close();
});

cancelButton.addEventListener('click', () => {
    addBookModal.close();
});