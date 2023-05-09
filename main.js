const categoryList = document.querySelector(".categories")
const productList = document.querySelector(".products")
const modalSepet = document.querySelector(".modal-wrapper")
const openBtn = document.getElementById("open-btn")
const closeBtn = document.getElementById("close-btn")
const modalList = document.querySelector(".modal-list")
const modalInfo = document.getElementById("modal-info")
const quantityInput = document.getElementById("quantity")

// tarayıcı tarafına html içeriği yüklendiyse fonk. calıstır
document.addEventListener("DOMContentLoaded", () => { // callback > içerisinde farklı fonk. calıstırır
    fetchCategories()
    fetchProduct()
})



function fetchCategories(){

    // veri çekme isteği atma
    fetch("https://api.escuelajs.co/api/v1/categories")
    // gelen veriyi işleme ve json çevirme
    .then((res) => res.json())
    // işlenen veriyi forEach ile herbir obje için ekrana basma
    .then((data) => data.slice(0,4).forEach((category) => {
        // dataları değişkende tutma
        // const {image, name} = category

        // gelen her bir obje için div oluşturma
        const categoryDiv = document.createElement("div")
        // div e class ekleme
        categoryDiv.classList.add("category")
        // divin içeriğini değiştirme
        categoryDiv.innerHTML = `
            <img src="${category.image}" alt="">
            <span>${category.name}</span>
        `
        // oluşan category divini htmldeki categories içine gönderme
        categoryList.appendChild(categoryDiv)
    }))
    .catch()
}

// Ürünleri Çekme

function fetchProduct(){

    fetch("https://api.escuelajs.co/api/v1/products")
    .then((res) => res.json())
    .then((data) => data.slice(0,25).forEach((productItem) => {
        // console.log(productItem)
        const productDiv = document.createElement("div")

        productDiv.classList.add("product")

        productDiv.innerHTML = `
            <img src="${productItem.images[0]}" alt="">
            <p>${productItem.title}</p>
            <p>${productItem.category.name}</p>
            <div class="product-action">
                <p>${productItem.price} $</p>
                <button onclick="addtoBasket({id: ${productItem.id}, title:'${productItem.title}',price:${productItem.price}, img:'${productItem.images[0]}', amount:1})">Sepete Ekle</button>
            </div>
        `
        productList.appendChild(productDiv)
    }))
    .catch()
}

// Sepet 

let basket = []
let total = 0

// sepete ekleme işlemi

function addtoBasket(product){
    // console.log(productItem)

    // eğer parametre olarak gelen product id ile basketItem eşitse onu değişkene aktar
    // sepette parametre olarak gelen elemenı arar
    const foundItem = basket.find((basketItem)=> basketItem.id === product.id)
    // console.log(foundItem)
    
    if (foundItem){
        foundItem.amount ++;
    }else{
        // eğer elemandan septte bulunmadıysa sepete ekle
        basket.push(product)
    }

    // console.log(basket)
}


// Sepet Açma ve Kapatma


openBtn.addEventListener("click", () => {
    modalSepet.classList.add("active")
    // sepetin içine ürünleri listeleme
    addList()

    // toplam bilgisini güncelleme
    modalInfo.innerText = total
})

closeBtn.addEventListener("click", () => {
    modalSepet.classList.remove("active")

    // sepeti kapatınca içini temizleme
    modalList.innerHTML = ""

    // toplam değerini sıfırlama
    toplam = 0
})

// Sepette listeleme

function addList(){
    basket.forEach((product)=>{
    // console.log(product)
    // sepet dizisinde ki her bir obje için div oluştur
    const listItem = document.createElement("div")
    listItem.classList.add("list-item")

    listItem.innerHTML = `
        <img src="${product.img}" alt="">
        <h2>${product.title}</h2>
        <h2 class="price">${product.price} $</h2>
        <p class= "amount">Miktar: ${product.amount}</p>
        <button id="del" onclick="deleteItem({id: ${product.id},price:${product.price}, amount: ${product.amount}})">Sil</button>
    `
    modalList.appendChild(listItem)
    // ürün listeye eklendikten sonra ürünün fiyatını güncelle
    
    total += (product.price) * product.amount
})
}

// sepetten silme fonksiyonu
function deleteItem(deletingItem){
    // console.log(deletingItem)
    // id si silinicek elemanın idsiyle eşit olmayanları al
    basket = basket.filter((item)=> item.id !== deletingItem.id)
    // slinin elemanın fiyatını totalden cıkarma
    total -= deletingItem.price * deletingItem.amount

    modalInfo.innerText = total
}

// silinen elemanı htmlden kaldırma(list-item divi kaldırılıyor)
modalList.addEventListener("click", (e)=>{
    // console.log(e.target)
    if(e.target.id === "del"){
        e.target.parentElement.remove()
    }
})

// eğer dışarı tıklanırsa kapatma
modalSepet.addEventListener("click", (e) => {
    // console.log(e.target)
    if(e.target.classList.contains("modal-wrapper")){
        modalSepet.classList.remove("active")
    }
})

