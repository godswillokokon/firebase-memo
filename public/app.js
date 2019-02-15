const cafeList = document.querySelector("#cafe-list");
const form = document.querySelector("#add-cafe-form");
//create element and render cafe
function renderCafe(doc) {
  let li = document.createElement("li");
  let name = document.createElement("span");
  let city = document.createElement("span");
  let cross = document.createElement("div");
  let edit = document.createElement("span");

  li.setAttribute("data-id", doc.id);
  name.textContent = doc.data().name;
  city.textContent = doc.data().city;
  cross.textContent = "X";
  

  li.appendChild(name);
  li.appendChild(city);
  li.appendChild(cross);
 

  cafeList.appendChild(li);

  // deleting data
  cross.addEventListener("click", e => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute("data-id");
    //find a doc on the dom
    db.collection("cafes")
      .doc(id)
      .delete();
  });
}


// // getting data
// db.collection("cafes")
//   .get()
//   .then(snapshot => {
//     snapshot.docs.forEach(doc => {
//       renderCafe(doc);
//     });
//   });

// // ordering data
// db.collection("cafes")
// .where("city", "<", "d")
//   .orderBy("city")
//   .get()
//   .then(snapshot => {
//     snapshot.docs.forEach(doc => {
//       renderCafe(doc);
//     });
//   });

// // making queries
// db.collection("cafes")
//   // .where("city", "==", "Calabar")
//   .where("city", "<", "d")
//   .get()
//   .then(snapshot => {
//     snapshot.docs.forEach(doc => {
//       renderCafe(doc);
//     });
//   });

// saving data
form.addEventListener("submit", e => {
  e.preventDefault();
  db.collection("cafes").add({
    name: form.name.value,
    city: form.city.value
  });
  form.name.value = "";
  form.city.value = "";
});

//  real time listener
db.collection("cafes")
  .orderBy("city")
  .onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
      // console.log(change.doc.data());
      if (change.type == "added") {
        renderCafe(change.doc);
      } else if (change.type == "removed") {
        let li = cafeList.querySelector("[data-id=" + change.doc.id + "]");
        cafeList.removeChild(li);
      }
    });
  });
