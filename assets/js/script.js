const books = [];
const RENDER_EVENT = "render-book"

function genereteBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

function generateId() {
    return +new Date();
}

const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_SELF";

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert("Browser anda tidak mendukung local storage");
        return false;
    }
    return true;
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent( new Event(SAVED_EVENT));
    }
}

function addTodo() {
    const textTitle = document.getElementById("title").value;
    const year = document.getElementById("inputBookYear").value;
    const author = document.getElementById("author").value;

    const generateID = generateId();
    const bookObject = genereteBookObject(generateID, textTitle, author, year, false);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function addTaskToCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }

    return -1;
}

function removeTask(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

    alert("Anda menghapus \"Buku\" pada rak")
}

function undoTaskFromCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function searchBook() {
    const searchBook = document.getElementById("searchBookTitle");
    const filter = searchBook.value.toUpperCase();
    const bookItem = document.querySelectorAll(".book-item");
    for (let i = 0; i < bookItem.length; i++) {
        txtValue = bookItem[i].textContent || bookItem[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            bookItem[i].style.display = "";
        } else {
            bookItem[i].style.display = "none";
        }
    }
}

function makeBook(bookObject) {
    const textTitle = document.createElement("h3");
    textTitle.innerText = bookObject.title;

    const author = document.createElement("p");
    author.innerText = bookObject.author;

    const year = document.createElement("p");
    year.innerText = bookObject.year;

    const container = document.createElement("article");
    container.classList.add("book-item");
    container.append(textTitle, author, year);

    if (bookObject.isCompleted) {
        const incompletedButton = document.createElement("button");
        incompletedButton.classList.add("green");
        incompletedButton.innerText = "Belum selesai dibaca";

        incompletedButton.addEventListener("click", function() {
            undoTaskFromCompleted(bookObject.id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("red");
        deleteButton.innerText = "Hapus buku";

        deleteButton.addEventListener("click", function() {
            removeTask(bookObject.id);
        });

        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("action");
        buttonContainer.append(incompletedButton, deleteButton);

        container.append(buttonContainer);
    } else {
        const completedButton = document.createElement("button");
        completedButton.classList.add("green");
        completedButton.innerText = "Selesai dibaca";

        completedButton.addEventListener("click", function() {
            addTaskToCompleted(bookObject.id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("red");
        deleteButton.innerText = "Hapus buku";

        deleteButton.addEventListener("click", function() {
            removeTask(bookObject.id);
        });

        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("action");
        buttonContainer.append(completedButton, deleteButton);
        
        container.append(buttonContainer);
    }

    return container;
}

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    const inputSearchBook = document.getElementById("searchBook");

    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addTodo();
    });

    inputSearchBook.addEventListener("keyup", function (event) {
        event.preventDefault();
        searchBook();
    });
    
    inputSearchBook.addEventListener("submit", function (event) {
        event.preventDefault();
        searchBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
  });

document.addEventListener(RENDER_EVENT, function() {
    const uncompletedBOOKList = document.getElementById("incompleteBookshelfList");
    uncompletedBOOKList.innerHTML = " ";

    const completedBOOKList = document.getElementById("completeBookshelfList");
    completedBOOKList.innerHTML = " ";

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);  

        if (!bookItem.isCompleted) {
            uncompletedBOOKList.append(bookElement);
        } else {
            completedBOOKList.append(bookElement);
        }
    }
});

document.addEventListener(saveData, function() {
    console.log(localStorage.getItem(STORAGE_KEY));
});