const cafeList = document.querySelector("#memo-list");
const form = document.querySelector("#add-memo-form");
//create element and render cafe
function renderCafe(doc) {
  let li = document.createElement("li");
  let name = document.createElement("span");
  let desc = document.createElement("span");
  let cross = document.createElement("div");
  let edit = document.createElement("span");

  li.setAttribute("data-id", doc.id);
  name.textContent = doc.data().name;
  desc.textContent = doc.data().desc;
  cross.textContent = "X";


  li.appendChild(name);
  li.appendChild(desc);
  li.appendChild(cross);


  cafeList.appendChild(li);

  // deleting data
  cross.addEventListener("click", e => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute("data-id");
    //find a doc on the dom
    db.collection("memo")
      .doc(id)
      .delete();
  });
}


// // getting data
// db.collection("memo")
//   .get()
//   .then(snapshot => {
//     snapshot.docs.forEach(doc => {
//       renderCafe(doc);
//     });
//   });

// // ordering data
// db.collection("memo")
// .where("desc", "<", "d")
//   .orderBy("desc")
//   .get()
//   .then(snapshot => {
//     snapshot.docs.forEach(doc => {
//       renderCafe(doc);
//     });
//   });

// // making queries
// db.collection("memo")
//   // .where("desc", "==", "Calabar")
//   .where("desc", "<", "d")
//   .get()
//   .then(snapshot => {
//     snapshot.docs.forEach(doc => {
//       renderCafe(doc);
//     });
//   });

// saving data
form.addEventListener("submit", e => {
  e.preventDefault();
  db.collection("memo").add({
    name: form.name.value,
    desc: form.city.value
  });
  form.name.value = "";
  form.city.value = "";
});

//  real time listener
db.collection("memo")
  .orderBy("desc")
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
