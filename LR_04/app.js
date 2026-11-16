'use strict';
function createBook(title, author, year, isRead) {
  return { title, author, year, isRead, bookInfo() {
    const text = `Назва: ${this.title}, Автор: ${this.author}, Рік видання: ${this.year}, Прочитана: ${this.isRead ? 'Так' : 'Ні'}`;
    console.log(text); return text;
  } };
}
const output = document.querySelector('#examples');
function log(label, value) { console.log(label, value); output.textContent += `${label}\n${typeof value === 'string' ? value : JSON.stringify(value, null, 2)}\n\n`; }
const book = createBook("Harry Potter and the Sorcerer's Stone", 'J.K. Rowling', 1997, true);
log('1. Початковий book:', book.bookInfo());
book.isRead = !book.isRead;
log('1. Після зміни isRead:', book.bookInfo());
const library = [book, createBook('The Hobbit', 'J.R.R. Tolkien', 1937, false), createBook('Лісова пісня', 'Леся Українка', 1911, true)];
function displayLibrary() { return library.map(item => item.bookInfo()).join('\n'); }
log('2. Бібліотека з трьох книг:', displayLibrary());
library.push(createBook('Кобзар', 'Тарас Шевченко', 1840, false));
log('2. Після push:', displayLibrary());
library.sort((a, b) => a.year - b.year);
log('3. Сортування за роком:', displayLibrary());
const unreadBooks = library.filter(item => !item.isRead);
log('3. Непрочитані книги (filter):', unreadBooks);
const tolkien = library.find(item => item.author === 'J.R.R. Tolkien');
log('3. Пошук автора (find):', tolkien);
document.querySelector('#library').textContent = displayLibrary();
document.querySelector('#add-book').addEventListener('click', () => {
  const title = prompt('Назва книги:'); if (title === null) return;
  const author = prompt('Автор:'); if (author === null) return;
  const yearInput = prompt('Рік видання:'); if (yearInput === null) return;
  const year = Number(yearInput);
  if (!title.trim() || !author.trim() || !yearInput.trim() || !Number.isInteger(year) || year < 1 || year > new Date().getFullYear()) {
    document.querySelector('#status').textContent = 'Вкажіть назву, автора та коректний рік видання.'; return;
  }
  const isRead = confirm('Книга прочитана?');
  library.push(createBook(title.trim(), author.trim(), year, isRead));
  document.querySelector('#library').textContent = displayLibrary();
  document.querySelector('#status').textContent = `Книгу додано. У бібліотеці: ${library.length}.`;
});
