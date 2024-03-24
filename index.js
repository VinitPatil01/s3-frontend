const apiUrl = "https://dpip1zqqtc.execute-api.us-east-1.amazonaws.com";

// Fetch data and populate books
fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    const books = data.books;
    const bookContainer = document.getElementById('bookContainer');

    books.forEach(book => {
      const bookDetailTemplate = `
        <div class="productDetail">
          <img class="bookCoverImg" src="${book.CoverImageURL}" alt="Book cover">
          <div class="bookDetails">
            <h2 class="bookTitle">${book.Title}</h2>
            <p class="bookAuthor">${book.Author}</p>
            <p class="bookDescription">${book.Description}</p>
          </div>
          <div class="bookPrice">${book.Price}</div>
          <div class="buttons">
            <button class="updateBtn" data-isbn="${book.ISBN}">Update</button>
            <button class="deleteBtn" data-isbn="${book.ISBN}">Delete</button>
          </div>
        </div>
      `;
      bookContainer.innerHTML += bookDetailTemplate;
      console.log(book)
    });

    // Attach event listener to delete buttons
    const deleteButtons = document.querySelectorAll('.deleteBtn');
    deleteButtons.forEach(button => {
      button.addEventListener('click', () => {
        const isbn = button.getAttribute('data-isbn');
        deleteBook(isbn);
      });
    });

    // Attach event listener to update buttons
    const updateButtons = document.querySelectorAll('.updateBtn');
    updateButtons.forEach(button => {
      button.addEventListener('click', () => {
        const isbn = button.getAttribute('data-isbn');
        fillFormWithBookDetails(isbn);
        logDataToJson(isbn);
      });
    });
  })
  .catch(error => {
    console.error('Error fetching book data:', error);
  });

// Function to delete book
function deleteBook(isbn) {
  fetch(apiUrl, {
    method: 'DELETE',
    body: JSON.stringify({ ISBN: isbn })
  })
  .then(response => {
    if (response.ok) {
      // If the deletion was successful, remove the corresponding book from the UI
      const bookElement = document.querySelector(`.deleteBtn[data-isbn="${isbn}"]`).closest('.productDetail');
      bookElement.remove();
    } else {
      throw new Error('Failed to delete the book');
    }
  })
  .catch(error => {
    console.error('Error deleting book:', error);
  });
}
const updateformDataObject = {};
// Function to log data in JSON format to console
function logDataToJson(isbn) {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const book = data.books.find(book => book.ISBN === isbn);
      if (book) {
        console.log(JSON.stringify(book, null, 2)); // Log data in JSON format to the console
        updateformDataObject["ISBN"] = isbn;// Add ISBN to formDataObject
      } else {
        console.error("Book not found");
      }
    })
    .catch(error => {
      console.error("Error fetching data:", error);
    });
}

// Function to fill form with book details
function fillFormWithBookDetails(isbn) {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const book = data.books.find(book => book.ISBN === isbn);
      if (book) {
        // Populate form fields with book details
        document.getElementById('Title').value = book.Title || "";
        document.getElementById('Author').value = book.Author || "";
        document.getElementById('PublishedDate').value = book.PublishedDate || "";
        document.getElementById('Publisher').value = book.Publisher || "";
        document.getElementById('Genre').value = book.Genre || "";
        document.getElementById('Description').value = book.Description || "";
        document.getElementById('Price').value = book.Price || "";
        document.getElementById('Rating').value = book.Rating || "";
        document.getElementById('CoverImageUrl').value = book.CoverImageURL || "";
      } else {
        console.error("Book not found");
      }
    })
    .catch(error => {
      console.error('Error fetching book details:', error);
    });
}
// Event listener for update book button
document.getElementById("updateBookBtn").addEventListener("click", function(event) {
  event.preventDefault(); // Prevent the default form submission

  const formData = new FormData(document.getElementById("addBookForm"));
  
  

  formData.forEach((value, key) => {
      updateformDataObject[key] = value;

  });
  console.log(JSON.stringify(updateformDataObject));
  // Send PATCH request to update book details
  fetch(apiUrl, {
      method: "PATCH",
      body: JSON.stringify(updateformDataObject),
      headers: {
          "Content-Type": "application/json"
      },
      
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
  })
  .then(data => {
      console.log(data); // You can handle the response here

      // Redirect to the same page
      window.location.href = window.location.href;
  })
  .catch(error => {
      console.error("Error:", error);
      // Log the error response
      if (error.response) {
          console.error("Error Response:", error.response);
      }
      // Optionally, you can show an error message to the user
  });
});


// Event listener for form submission
document.getElementById("addBookForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent the default form submission

  const formData = new FormData(event.target);
  const formDataObject = {};

  formData.forEach((value, key) => {
    formDataObject[key] = value;
  });

  fetch(apiUrl, {
    method: "POST",
    body: JSON.stringify(formDataObject),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log(data); // You can handle the response here

    // Optionally, you can redirect the user to the same page
    window.location.href = window.location.href;

    // Optionally, you can also display the new data
    // Call a function to display the new data here
    // displayNewData(data);
  })
  .catch(error => {
    console.error("Error:", error);
    // Log the error response
    if (error.response) {
      console.error("Error Response:", error.response);
    }
    // Optionally, you can show an error message to the user
  });
});
