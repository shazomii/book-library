/**
 * Represents a book with basic information and read status
 */
class Book {
    constructor(id, title, author, pages, read) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.pages = Number(pages);
        this.read = Boolean(read);
    }

    toggleRead() {
        this.read = !this.read;
    }
}

/**
 * Manages the book collection and DOM interactions
 */
class Library {
    constructor(containerSelector) {
        this.books = [];
        this.container = document.querySelector(containerSelector);
        if (!this.container) {
            throw new Error(`Container ${containerSelector} not found`);
        }
    }
    
    /**
     * Creates and adds a new book to the library
     */
    addBook(title, author, pages, read) {
        const book = new Book(crypto.randomUUID(), title, author, pages, read);
        this.books.push(book);
        this.renderBook(book);
        return book;
    }
    
    /**
     * Removes a book from the library and updates the DOM
     */
    removeBook(book) {
        this.books = this.books.filter(b => b.id !== book.id);
        this.removeBookFromDOM(book.id);
    }
    
    /**
     * Removes book element from DOM
     */
    removeBookFromDOM(bookId) {
        const bookElem = this.container.querySelector(`[data-id="${bookId}"]`);
        if (bookElem) bookElem.remove();
    }
    
    /**
     * Toggles read status and updates the display
     */
    toggleBookRead(book) {
        book.toggleRead();
        this.updateBook(book);
    }
    
    /**
     * Updates the book display in the DOM
     */
    updateBook(book) {
        const bookElem = this.container.querySelector(`[data-id="${book.id}"]`);
        if (bookElem) {
            const newElem = this.createBookElement(book);
            this.container.replaceChild(newElem, bookElem);
        }
    }
    
    /**
     * Creates DOM elements for book display
     */
    createBookElement(book) {
        const bookItem = this.createBookContainer(book);
        const bookDetails = this.createBookDetails(book);
        const bookActions = this.createBookActions(book);
        
        if (book.read) {
            bookItem.appendChild(this.createReadBadge());
        }
        
        bookItem.append(bookDetails, bookActions);
        return bookItem;
    }
    
    /**
     * Creates the main book container element
     */
    createBookContainer(book) {
        const bookItem = document.createElement("div");
        bookItem.className = "book";
        bookItem.setAttribute("data-id", book.id);
        return bookItem;
    }
    
    /**
     * Creates the book details section
     */
    createBookDetails(book) {
        const bookDetails = document.createElement("div");
        bookDetails.className = "book-details";
        
        const elements = [
            { class: "book-title", text: book.title },
            { class: "book-author", text: book.author },
            { class: "book-pages", text: `${book.pages} pages` }
        ].map(({ class: className, text }) => {
            const element = document.createElement("p");
            element.className = className;
            element.textContent = text;
            return element;
        });
        
        bookDetails.append(...elements);
        return bookDetails;
    }
    
    /**
     * Creates the read badge element
     */
    createReadBadge() {
        const badge = document.createElement("div");
        badge.className = "book-badge";
        badge.textContent = "READ";
        return badge;
    }
    
    /**
     * Creates book action buttons
     */
    createBookActions(book) {
        const bookActions = document.createElement("div");
        bookActions.className = "book-actions";
        
        const btnRead = document.createElement("button");
        btnRead.className = "button-read";
        btnRead.textContent = book.read ? "Mark unread" : "Mark as read";
        btnRead.addEventListener('click', () => this.toggleBookRead(book));
        
        const btnDel = document.createElement("button");
        btnDel.className = "button-delete";
        btnDel.textContent = "Remove";
        btnDel.addEventListener('click', () => this.removeBook(book));
        
        bookActions.append(btnRead, btnDel);
        return bookActions;
    }
    
    /**
     * Renders a single book
     */
    renderBook(book) {
        const bookElem = this.createBookElement(book);
        this.container.appendChild(bookElem);
    }
    
    /**
     * Renders all books in the library
     */
    renderAll() {
        this.container.innerHTML = "";
        this.books.forEach(book => this.renderBook(book));
    }
}

// Initialize library and UI elements
const library = new Library(".books-container");
const newBookButton = document.querySelector(".button-new-book");
const cancelButton = document.querySelector(".button-cancel");
const addBookModal = document.querySelector(".add-book-modal");
const form = document.querySelector(".book-form");

// Event Listeners
newBookButton.addEventListener('click', () => addBookModal.showModal());

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(
        Array.from(form.querySelectorAll("input")).map(input => [
            input.name,
            input.type === "checkbox" ? input.checked : input.value
        ])
    );
    
    library.addBook(
        formData.title,
        formData.author,
        Number(formData.pages),
        formData.read
    );
    
    form.reset();
    addBookModal.close();
});

cancelButton.addEventListener('click', () => addBookModal.close());

// Add initial books
[
    ["Bury your Bones on the Midnight Soil", "V. E Schwab", 400, false],
    ["Sounds Like Love", "Ashley Preston", 650, true],
    ["King of Ashes", "S. A. Cosby", 354, true],
    ["The River is Waiting", "Wally Lamb", 989, false],
    ["The Poppy Fields", "Nikki Erlick", 675, true],
    ["We don't talk about Carol", "Kristen L. Berry", 437, false],
    ["Welcome to murder week", "Karen Dukess", 983, true],
    ["What kind of paradise", "Janelle Brown", 748, true]
].forEach(([title, author, pages, read]) => 
    library.addBook(title, author, pages, read)
);