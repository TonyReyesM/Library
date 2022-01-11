//BOOKS
const dune = new Book('Dune', 'Frank Herbert', 794, true);
const demian = new Book('Demian', 'Herman Hesse', 145, true);
const rant = new Book('Rant', 'Chuck Palahniuk', 319, true);
const duneMessiah = new Book('Dune: Messiah', 'Frank Herbert', 354, false);
const neuromancer = new Book('Neuromancer', 'William Gibson', 324, false)

//LIBRARY ARRAY
const myBooks = [dune, duneMessiah, rant, demian, neuromancer]

//BOOK OBJECT CONSTRUCTOR-----------------------------------------------------------------------------
function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.info = function(){
        if(read === true) return `${title} by ${author}, ${pages} pages, already read.`;     
        else return `${title} by ${author}, ${pages} pages, not read yet.`
    }
    this.updateStatus = function(checkboxVal){
        if(checkboxVal === true) this.read = true
        else if(checkboxVal === false) this.read = false    
    }
}

//ADD TO LIBRARY FUNCTION-----------------------------------------------------------------------------
function addToLibrary(book){
    myBooks.push(book)
}

//DISPLAY BOOK CARDS FUNCTION-------------------------------------------------------------------------
const cardGrid = document.querySelector('.card-grid')

function displayBooks(books){
    const regex = /[^a-zA-Z0-9]/g;
    let readCount = 0;
    for(let i=0; i<books.length; i++){
        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card');
        bookCard.id = `${books[i].title}`.replace(regex,'--')
        const title = document.createElement('div')
        title.classList.add('card-property')
        title.style.padding = '3px';
        title.innerHTML = `<b>Title</b>: <em>"${books[i].title}"</em>`
        
        const author = document.createElement('div')
        author.classList.add('card-property')
        author.style.padding = '3px';
        author.innerHTML = `<b>Author</b>: <em>${books[i].author}</em>`
        
        const pages = document.createElement('div')
        pages.classList.add('card-property')
        pages.style.padding = '3px';
        pages.innerHTML = `<b>Pages</b>: <em>${books[i].pages}</em>`
        
        const read = document.createElement('div')
        read.classList.add('card-property')
        read.style.padding = '3px';
        read.innerHTML = `<b>Read: </b>`
        
        const checkbox = document.createElement('input')
        checkbox.classList.add('checkbox-input')
        checkbox.type = 'checkbox';
        checkbox.value = `${books[i].title}`.replace(regex,'--')
        if(books[i].read === true) readCount++
        checkbox.checked = books[i].read
        
        const rmButton = document.createElement('button')
        rmButton.classList.add('remove')
        rmButton.innerHTML = 'Remove'
        rmButton.value = `${books[i].title}`.replace(regex,'--')
        
        const lastRow = document.createElement('div')
        lastRow.classList.add('card-row')
        
        bookCard.append(title)
        bookCard.append(author)
        bookCard.append(pages)
        read.append(checkbox)
        lastRow.append(read)
        lastRow.append(rmButton)
        bookCard.append(lastRow)
        cardGrid.append(bookCard)
    }
    updateTotalBooks();
    updateReadBooks(readCount);
}

//UPDATE READ BOOKS AND TOTAL BOOKS--------------------------------------------------------------------
function updateTotalBooks(){
    const numBooks = document.querySelector('.totalnum')
    numBooks.innerHTML = `Number of books: ${myBooks.length}`
}

function updateReadBooks(readCount){
    const readBooks = document.querySelector('.readnum')
    readBooks.innerHTML = `Books read: ${readCount}`
}


//-----------------------
displayBooks(myBooks)


//ADD BOOK & MODAL--------------------------------------------------------------------------------------------
const modalBackground = document.querySelector('.modal-bg')
const addButton = document.querySelector('.add');
const submitButton = document.querySelector('.submit')
const closeButton = document.querySelector('.close')

addButton.addEventListener('mouseover', () => addButton.classList.add('pressed'))
addButton.addEventListener('mouseout', () => addButton.classList.remove('pressed'))
addButton.addEventListener('click', openModal);
submitButton.addEventListener('click', () => {
    submitBook();
    const checkboxes = document.querySelectorAll('.checkbox-input')
    readMarkEventAdder(checkboxes);
    const rmButtons = document.querySelectorAll('button.remove')
    removeEventAdder(rmButtons);
})
closeButton.addEventListener('click', closeModal)

function openModal(){
    modalBackground.classList.add('bg-active')
}

function closeModal(){
    modalBackground.classList.remove('bg-active')
    addButton.classList.remove('pressed')
}

function submitBook(){
    const title = document.querySelector('.title-input').value
    const author = document.querySelector('.author-input').value
    const pages = document.querySelector('.pages-input').value
    const read = document.querySelector('.read-input').checked
    const myBook = new Book(title, author, pages, read);
    if(title === '' || author === '' || pages === '' || isNaN(pages)){
        alert('Information missing or not valid. Please try again.')
    } else{
        modalBackground.classList.remove('bg-active')
        addButton.classList.remove('pressed')
        addToLibrary(myBook);
        cardGrid.innerHTML = '';
        displayBooks(myBooks);
    }
}

//REMOVE BUTTONS--------------------------------------------------------------------------------------

function removeEventAdder(rmButtons){
    rmButtons.forEach(btn => btn.addEventListener('click', () => removeBook(btn.value)))
    rmButtons.forEach(btn => btn.addEventListener('mouseover', () => btn.classList.add('pressed')))
    rmButtons.forEach(btn => btn.addEventListener('mouseout', () => btn.classList.remove('pressed')))    
}

let rmButtons = document.querySelectorAll('button.remove')
removeEventAdder(rmButtons);

function removeBook(id){
    const regex = /[^a-zA-Z0-9]/g;
    const erasedBookCard = document.querySelector(`#${id}`)
    const erasedBookObj = myBooks.find(myBook => myBook.title.replace(regex,'--') === id)
    myBooks.splice(myBooks.indexOf(erasedBookObj),1)
    erasedBookCard.remove()
    updateTotalBooks();
    const readCount = myBooks.filter(myBook => myBook.read === true).length
    updateReadBooks(readCount)
}

const eraseAllBtn = document.querySelector('.erase-all')
eraseAllBtn.addEventListener('mouseover', () => eraseAllBtn.classList.add('pressed'))
eraseAllBtn.addEventListener('mouseout', () => eraseAllBtn.classList.remove('pressed'))
eraseAllBtn.addEventListener('click', eraseAll)

function eraseAll(){
    if(confirm('Do you want to erase everything?')){
        console.log('Erase all')
        myBooks.length = 0;
        cardGrid.innerHTML = '';
        updateTotalBooks()
        updateReadBooks(0)
        displayBooks(myBooks);
    } else return
    
}

//MARK-AS-READ FUNCTIONALITY-------------------------------------------------------------------------------
let checkboxes = document.querySelectorAll('.checkbox-input')
readMarkEventAdder(checkboxes);

function readMarkEventAdder(checkboxes){
    checkboxes.forEach(box => box.addEventListener('click', () => updateStatusinObject(box)))
}

function updateStatusinObject(box){
    const regex = /[^a-zA-Z0-9]/g;
    const book = myBooks.find(myBook => myBook.title.replace(regex,'--') === box.value)
    book.updateStatus(box.checked)
    const readCount = myBooks.filter(myBook => myBook.read === true).length
    updateReadBooks(readCount)
}