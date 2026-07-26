const latestPhotos = document.getElementById("latestPhotos");

const photos = [
    {
        title: "Erdek Meydanı (1958)",
        image: "https://picsum.photos/600/600?random=11"
    },
    {
        title: "Erdek İskelesi (1972)",
        image: "https://picsum.photos/600/600?random=12"
    },
    {
        title: "Çınaraltı (1984)",
        image: "https://picsum.photos/600/600?random=13"
    }
];

photos.forEach(photo => {

    latestPhotos.innerHTML += `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="photo-card">
                <img src="${photo.image}" alt="${photo.title}">
                <h5>${photo.title}</h5>
            </div>
        </div>
    `;

});