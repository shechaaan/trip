let trips = JSON.parse(localStorage.getItem("trips")) || [];
let editIndex = null;

function saveTrips() {
  localStorage.setItem("trips", JSON.stringify(trips));
}

// 📍地図
let map = L.map('map').setView([35, 135], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
.addTo(map);

// 地図クリックで座標入力
map.on('click', function(e) {
  document.getElementById("lat").value = e.latlng.lat.toFixed(4);
  document.getElementById("lng").value = e.latlng.lng.toFixed(4);
});

let markers = [];

// ⭐評価で色変更
function getColor(rating){
  if(rating >= 4) return "green";
  if(rating == 3) return "orange";
  return "red";
}

// 📸画像をBase64保存
function getPhoto(callback){
  let file = document.getElementById("photo").files[0];
  if(!file){
    callback(null);
    return;
  }
  let reader = new FileReader();
  reader.onload = () => callback(reader.result);
  reader.readAsDataURL(file);
}

// 追加 or 編集
function addTrip(){

  getPhoto(photoData => {

    const trip = {
      place: place.value,
      date: date.value,
      memo: memo.value,
      rating: parseInt(rating.value),
      lat: parseFloat(lat.value),
      lng: parseFloat(lng.value),
      photo: photoData
    };

    if(editIndex !== null){
      trips[editIndex] = trip;
      editIndex = null;
    } else {
      trips.push(trip);
    }

    saveTrips();
    displayTrips();
    displayMap();
  });
}

// 一覧表示
function displayTrips(){
  tripList.innerHTML = "";

  trips.forEach((t,i) => {

    let stars = "⭐".repeat(t.rating);

    tripList.innerHTML += `
      <div class="trip-card">
        <b>${t.place}</b><br>
        📅 ${t.date}<br>
        📝 ${t.memo}<br>
        ${stars}<br>
        ${t.photo ? `<img src="${t.photo}">` : ""}

        <br>
        <button onclick="editTrip(${i})">編集</button>
        <button onclick="deleteTrip(${i})">削除</button>
      </div>
    `;
  });
}

// 編集
function editTrip(i){
  let t = trips[i];
  place.value = t.place;
  date.value = t.date;
  memo.value = t.memo;
  rating.value = t.rating;
  lat.value = t.lat;
  lng.value = t.lng;
  editIndex = i;
}

// 削除
function deleteTrip(i){
  trips.splice(i,1);
  saveTrips();
  displayTrips();
  displayMap();
}

// マップ表示
function displayMap(){

  markers.forEach(m => map.removeLayer(m));
  markers = [];

  trips.forEach(t => {

    if(t.lat && t.lng){

      let stars = "⭐".repeat(t.rating);

      let popup = `
        <b>📍 ${t.place}</b><br>
        📅 ${t.date}<br>
        📝 ${t.memo}<br>
        ${stars}<br>
        ${t.photo ? `<img src="${t.photo}" width="120">` : ""}
      `;

      let marker = L.circleMarker(
        [t.lat, t.lng],
        { color: getColor(t.rating), radius: 8 }
      )
      .addTo(map)
      .bindPopup(popup);

      markers.push(marker);
    }
  });
}

displayTrips();
displayMap();
